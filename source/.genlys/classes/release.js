var fs = require('fs');
var path = require('path');
var extend = require('util')._extend;
var config = require('../config');
var remove = require('remove');
// var pathSymlink = path.resolve('releases', releaseDirname);

function Release (properties) {
  extend(this, properties);
  // console.log(this);
}

Release.prototype.isCurrent = function() {
  return this.path === config.getSymlinkPath();
};

Release.prototype.setCurrent = function(callback) {
  var releasePath = config.getReleasePath();
  var promise = symlink(this.path, releasePath, 'dir');
  console.log('promise', promise);
  promise.then(callback);
};

Release.prototype.removeSync = function() {
  remove.removeSync(this.path);
};

module.exports = Release;