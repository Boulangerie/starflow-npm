var path = require('path');
var _ = require('lodash');
var expect = require('chai').expect;
var updatePackageVersionFactoryWrapper = require('../lib/updatePackageVersion');
var starflow = require('starflow');
var helpers = require('./helpers');

beforeEach(function () {
  starflow.logger.mute();
});

afterEach(function () {
  starflow.logger.unmute();
});

describe('UpdatePackageVersion', function () {

  it('Factory should provide an executable instance', function () {
    var updatePackageVersionInstance = updatePackageVersionFactoryWrapper(starflow)();
    expect(typeof updatePackageVersionInstance).to.equal('object');
    expect(typeof updatePackageVersionInstance.exec).to.equal('function');
  });

  it('Name should be "npm.updatePackageVersion"', function () {
    var updatePackageVersionInstance = updatePackageVersionFactoryWrapper(starflow)();
    expect(updatePackageVersionInstance.name).to.equal('npm.updatePackageVersion');
  });

  it('should update the version of a given dependency', function (done) {
    helpers
      .getFileContent(path.resolve(__dirname + '/fixtures/example.package.json'))
      .then(helpers.createTmpPackageJson)
      .then(getTmpPackageJsonContent)
      .then(function (res) {
        var parsedPackageJson = JSON.parse(res.fileBody);
        expect(parsedPackageJson.dependencies.a).to.equal('1.2.3');
        return res;
      })
      .then(execDependenciesInstance)
      .then(getTmpPackageJsonContent)
      .then(function (res) {
        var parsedPackageJson = JSON.parse(res.fileBody);
        expect(parsedPackageJson.dependencies.a).to.equal('updated-version');
        res.cleanupCallback();
        done();
      });

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    function execDependenciesInstance(res) {
      var updatePackageVersionInstance = updatePackageVersionFactoryWrapper(starflow)();
      return updatePackageVersionInstance
        .exec(path.resolve(res.path + '/package.json'), 'a', 'updated-version')
        .then(function () {
          return _.assign(res, {
            updatePackageVersionInstance: updatePackageVersionInstance
          });
        });
    }

    function getTmpPackageJsonContent(res) {
      return helpers
        .getFileContent(path.resolve(res.path + '/package.json'))
        .then(function (data) {
          return _.assign(res, {
            fileBody: data
          });
        })
    }
  });

});
