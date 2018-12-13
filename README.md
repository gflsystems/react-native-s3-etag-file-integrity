# React Native s3 Etag File Integrity

Module to read a local file and find the ETAG of the downloaded file from **Amazon**.

**NOTE**

Currently it isn't tested on IOS, it should not work due to the root directory being specific to Android.

**NOTE**

This uses module [react-native-fs](https://www.npmjs.com/package/react-native-fs)

**NOTE**

**Depending on tablet** and on Large files THIS WILL TAKE TIME!
As I have to check the integrity of downloaded file on a slow and old android tablet it takes a while...

## Install

`npm i react-native-s3-etag-file-integrity`

or

`yarn add react-native-s3-etag-file-integrity`

## Usage

###### You can find the etag and size through a HEAD request to the file at amazon.

```javascript
  s3eTag('Path to file without the root folder', 'Etag', 'Size of the file')
    .then(res => console.log(res))
    .catch(err => console.log(err));
```

## Bugs

If you find a bug create a issue on the repo.
