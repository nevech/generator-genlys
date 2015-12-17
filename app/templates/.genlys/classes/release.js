var fs = require('fs');
var path = require('path');
var remove = require('remove');
var symlink = require('fs-symlink');
var extend = require('util')._extend;
var config = require('../config');

function Release (properties) {
  extend(this, properties);
}

Release.prototype.isCurrent = function() {
  return this.path === config.getSymlinkPath();
};

Release.prototype.setCurrent = function(callback) {
  var releasePath = config.getSymlinkPath();
  var promise = symlink(this.path, releasePath, 'dir');

  promise.then(callback);
};

Release.prototype.removeSync = function() {
  remove.removeSync(this.path);
};

Release.getCurrent = function () {
  var symlinkPath = config.getSymlinkPath();
  var releasePath = fs.realpathSync(symlinkPath);

  if (!releasePath) return;

  return Release.getByPath(releasePath);
};

Release.getByPath = function (releasesPath) {
  var stats = fs.statSync(releasesPath);
  var fileName = path.basename(releasesPath);
  var nameRE = /^\d{4}-\d{2}-\d{2}_\d{2}:\d{2}:\d{2}$/;

  if (!nameRE.test(fileName) || !stats.isDirectory()) {
    return;
  }

  return new Release({
    name: fileName,
    path: releasesPath,
    ctime: stats.ctime,
    stats: stats
  });
}

module.exports = Release;