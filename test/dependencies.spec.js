var path = require('path');
var _ = require('lodash');
var expect = require('chai').expect;
var dependenciesFactoryWrapper = require('../lib/dependencies');
var starflow = require('starflow');
var helpers = require('./helpers');

beforeEach(function () {
  starflow.logger.mute();
});

afterEach(function () {
  starflow.logger.unmute();
});

describe('Dependencies', function () {

  it('Factory should provide an executable instance', function () {
    var dependenciesInstance = dependenciesFactoryWrapper(starflow)();
    expect(typeof dependenciesInstance).to.equal('object');
    expect(typeof dependenciesInstance.exec).to.equal('function');
  });

  it('Name should be "npm.dependencies"', function () {
    var dependenciesInstance = dependenciesFactoryWrapper(starflow)();
    expect(dependenciesInstance.name).to.equal('npm.dependencies');
  });

  it('should store an array of dependencies and devDependencies names', function (done) {
    helpers
      .getFileContent(path.resolve(__dirname + '/fixtures/example.package.json'))
      .then(helpers.createTmpPackageJson)
      .then(execDependenciesInstance)
      .then(function (res) {
        expect(res.dependenciesInstance.storage.get('list')).to.have.members(['a', 'b', 'c']);
        res.cleanupCallback();
        done();
      });

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    function execDependenciesInstance(res) {
      var dependenciesInstance = dependenciesFactoryWrapper(starflow)();
      return dependenciesInstance
        .exec(res.path)
        .then(function () {
          return _.assign(res, {
            dependenciesInstance: dependenciesInstance
          });
        });
    }
  });

  it('should store a map of dependencies and devDependencies names with their versions', function (done) {
    helpers
      .getFileContent(path.resolve(__dirname + '/fixtures/example.package.json'))
      .then(helpers.createTmpPackageJson)
      .then(execDependenciesInstance)
      .then(function (res) {
        expect(res.dependenciesInstance.storage.get('list')).to.have.property('a', '1.2.3');
        expect(res.dependenciesInstance.storage.get('list')).to.have.property('b', '4.5.6');
        expect(res.dependenciesInstance.storage.get('list')).to.have.property('c', '7.8.9');
        res.cleanupCallback();
        done();
      });

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    function execDependenciesInstance(res) {
      var dependenciesInstance = dependenciesFactoryWrapper(starflow)();
      return dependenciesInstance
        .exec(res.path, true)
        .then(function () {
          return _.assign(res, {
            dependenciesInstance: dependenciesInstance
          });
        });
    }
  });

});
