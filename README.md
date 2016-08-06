# starflow-npm [![Build Status](https://travis-ci.org/Boulangerie/starflow-npm.svg?branch=master)](https://travis-ci.org/Boulangerie/starflow-npm)

## Prerequisites

In order to use this plugin, your project must have [starflow](http://github.com/boulangerie/starflow) as a dependency.

## Install

```
$ npm install --save-dev starflow-npm
```

## Usage

Using a workflow:

```js
var starflow = require('starflow');

var steps = [
  'npm.dependencies'
];

var workflow = new starflow.Workflow(steps);
return workflow
  .addPlugin(require('starflow-npm'))
  .run();
```

In an executable:

```js
module.exports = function (starflow) {
  var createBranchFactory = require('starflow-npm')(starflow).factories.dependencies;

  function MyExecutable() {
    starflow.BaseExecutable.call(this, 'myPlugin.myExecutable');
  }
  MyExecutable.prototype = Object.create(starflow.BaseExecutable.prototype);
  MyExecutable.prototype.constructor = MyExecutable;

  MyExecutable.prototype.exec = function exec() {
    var dependenciesExecutable = this.createExecutable(dependenciesFactory);
    return new starflow.Task(dependenciesExecutable)
      .run();
  };

  return function () {
    return new MyExecutable();
  };
};
```

## Executables

Thereafter is the list of all the executable classes provided by this plugin.

> **Important** The titles indicate the name that can be used when writing the steps of a workflow.

### npm.dependencies

Get an array of dependencies and devDependencies names (e.g. `['a', 'b', 'c']`) for a particular _package.json_.

If asked for, it provides a map of `name: version` instead of an array (e.g. `{'a': '0.0.0', 'b': '0.0.0'}`).

Usage:
```js
// for a workflow
var withVersions = true;
var steps = [
  // if no path is provided, the executable will look at the package.json file at the root of the project
  {'npm.dependencies': ['path/to/dirHoldingPackageJson', withVersions]}
  // or {'npm.dependencies': 'path/to/dirHoldingPackageJson'} to only get the names
];

// in an executable
var dependenciesFactory = require('starflow-npm')(starflow).factories.dependencies;
var withVersions = true;
var myTask = new starflow.Task(dependenciesFactory, ['path/to/dirHoldingPackageJson', withVersions]);
```

### npm.updatePackageVersion

Update the version of a specific dependency in a given _package.json_ file.

Usage:
```js
// for a workflow
var steps = [
  {'npm.updatePackageVersion': ['path/to/package.json', 'dependencyName', 'version']}
];

// in an executable
var updatePackageVersionFactory = require('starflow-npm')(starflow).factories.updatePackageVersion;
var myTask = new starflow.Task(updatePackageVersionFactory, ['path/to/package.json', 'dependencyName', 'version']);
```

## Storage

Some of the executables of this plugin store some values in their storage.

### npm.dependencies

- **list** Contains either an array of dependency names or a map of `name: version`.

  Example 1:

  ```js
  var starflow = require('starflow');

  var steps = [
    'npm.dependencies',
    // displays the names of dependencies and devDependencies for the current project
    {'custom.echo': '{{/npm.dependencies/list}}'}
  ];

  var workflow = new starflow.Workflow(steps);
  return workflow
    .addPlugin(require('starflow-npm'))
    .addPlugin(require('starflow-custom')) // plugin that contains the 'echo' executable
    .run();
  ```
  
  Example 2:
  
  ```js
  var starflow = require('starflow');

  var steps = [
    {'npm.dependencies': [null, true]},
    // displays the names and their versions of dependencies and devDependencies for the current project
    {'custom.echo': '{{/npm.dependencies/list}}'}
  ];

  var workflow = new starflow.Workflow(steps);
  return workflow
    .addPlugin(require('starflow-npm'))
    .addPlugin(require('starflow-custom')) // plugin that contains the 'echo' executable
    .run();
  ```

> **Note:** learn more about storage paths on the [Starflow documentation page](http://github.com/boulangerie/starflow/blob/master/docs/API.md#path-format).
