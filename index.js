module.exports = function (starflow) {

  return {
    factories: {
      dependencies: require('./lib/dependencies')(starflow),
      updatePackageVersion: require('./lib/updatePackageVersion')(starflow)
    }
  };

};
