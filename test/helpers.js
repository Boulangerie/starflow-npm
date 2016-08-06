var Promise = require('bluebird');
var path = require('path');
var tmp = require('tmp');
var fs = require('fs');

Promise.promisifyAll(fs);

tmp.setGracefulCleanup();

function createTmpPackageJson(body) {
  return new Promise(function (resolve, reject) {
    tmp.dir({unsafeCleanup: true}, function (err, dirPath, cleanupCallback) {
      if (err) {
        reject(err);
      } else {
        fs
          .writeFileAsync(path.resolve(dirPath + '/package.json'), body)
          .then(function () {
            resolve({
              path: dirPath,
              cleanupCallback: cleanupCallback
            });
          }, reject);
      }
    });
  });
}

function getFileContent(fileName) {
  return fs.readFileAsync(fileName, 'utf8');
}

module.exports = {
  createTmpPackageJson: createTmpPackageJson,
  getFileContent: getFileContent
};
