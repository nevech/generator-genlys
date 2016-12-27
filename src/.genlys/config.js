var fs = require('fs');
var moment = require('moment');
var path = require('path');

var config = require('../configs/gulpconfig.js');
var configENV = config.environments[config.env];

function getConfigENV (name, defaultValue) {
  var defaultValue = defaultValue || true;

  if (!configENV || configENV[name] === undefined) {
    return defaultValue;
  }

  return configENV[name];
}

config.isCompressFiles = function () {
  return !!getConfigENV('compressFiles', true);
};

config.getConstants = function () {
  let path = config.getPathToConstants();

  return JSON.parse(fs.readFileSync(path, {
    encoding: 'utf8'
  }));
};

config.getPathToConstants = function () {
  return `configs/constants/${config.env}.json`;
};

config.getReleasePath = (function () {
  var dirName = moment.utc().format('YYYY-MM-DD_HH:mm:ss');
  var buildDir = path.resolve('releases', dirName);

  return function () {
    return buildDir;
  };

})();

config.getSymlinkPath = function () {
  var releaseDirname = config.releaseDirname || 'current';
  return path.resolve('releases', releaseDirname);
};

module.exports = config;
