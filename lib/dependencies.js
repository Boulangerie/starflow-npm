module.exports = function (starflow) {

  var _ = require('lodash');
  var path = require('path');
  var fs = require('fs');
  var Promise = require('bluebird');
  var BaseExecutable = starflow.BaseExecutable;

  Promise.promisifyAll(fs);

  function Dependencies() {
    BaseExecutable.call(this, 'npm.dependencies');
  }
  Dependencies.prototype = Object.create(BaseExecutable.prototype);
  Dependencies.prototype.constructor = Dependencies;

  Dependencies.prototype.get = function get(cwd, includeVersion) {
    var packageJsonPath = path.resolve(cwd + '/package.json');

    return fs
      .readFileAsync(packageJsonPath, 'utf8')
      .then(function (packageJson) {
        var parsedPackageJson = JSON.parse(packageJson);
        var dependencies = _.assign({}, parsedPackageJson.dependencies || {}, parsedPackageJson.devDependencies || {});

        function displayDependencies(deps) {
          var i = 0;
          var len = _.size(deps);
          var bulletPoint;
          _.forEach(deps, function (version, name) {
            bulletPoint = (i < len - 1) ? ' ├ ' : ' └ ';
            starflow.logger.log(bulletPoint + name + ' (' + version + ')');
            i++;
          });
        }

        starflow.logger.log(_.size(_.keys(parsedPackageJson.dependencies)) + ' dependencies found');
        displayDependencies(parsedPackageJson.dependencies);

        starflow.logger.log(_.size(_.keys(parsedPackageJson.devDependencies)) + ' devDependencies found');
        displayDependencies(parsedPackageJson.devDependencies);

        if (!includeVersion) {
          dependencies = _.keys(dependencies);
        }

        this.storage.set('list', dependencies);
      }.bind(this));
  };

  Dependencies.prototype.exec = function exec(cwd, includeVersion) {
    return this.get(path.resolve(cwd || './'), !!includeVersion);
  };

  return function () {
    return new Dependencies();
  };

};
