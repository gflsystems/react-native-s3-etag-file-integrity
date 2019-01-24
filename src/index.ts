import {Buffer} from 'buffer';
import * as base64 from 'base-64';
import crypto from './libs/crypto';
import RNFS from 'react-native-fs';

interface File {
  path: string,
  etag: string,
  chunks: number,
  chunkSize: number,
  size: number
};



export const s3eTag = (filePath: string, etag: string, fileSize: number) => {
  const rootPath = RNFS.DocumentDirectoryPath; // Android
  const md5sOfEachPart: Array < string > = [];
  const file: File = {
    path: '',
    etag: '',
    chunks: 0,
    chunkSize: 0,
    size: null
  }
  let currentBytesRead: number = 0;
  
  if (!filePath || !etag || !fileSize) throw new Error('You need to pass the file path && ETAG && the file size');

  file.path = filePath;
  file.etag = etag;
  file.chunks = etag.includes('-') ? Number(etag.split('-')[1]) : 0;
  file.chunkSize = etag.includes('-') ? 5 * 1024 * 1024 : fileSize;
  file.size = fileSize;

  console.log(file);

  return new Promise((resolve, reject) => {
    const read = () => {
      let data: Buffer;
      let buffer: Buffer;
      let bytesRead: number;

      RNFS.read(`${rootPath}/${file.path}`, file.chunkSize, currentBytesRead, 'base64')
        .then(res => {
          bytesRead = base64.decode(res).length;

          if (bytesRead === 0) {
            resolve(md5sOfEachPart.length === 1 ? md5sOfEachPart[0] : crypto.createHash('md5').update(Buffer.from(md5sOfEachPart.join(''), 'hex')).digest('hex') + '-' + file.chunks);
            return;
          }

          buffer = Buffer.from(res, 'base64');

          currentBytesRead += bytesRead;

          if (bytesRead < file.chunkSize) {
            data = buffer.slice(0, bytesRead);
          } else {
            data = buffer;
          }

          md5sOfEachPart.push(
            crypto
            .createHash('md5')
            .update(data)
            .digest('hex')
          );

          console.log(`Read: ${ currentBytesRead } of ${ file.size }`)
          read();
        })
        .catch(err => reject(err));
    }

    read();
  });
};