var symlink = require('fs-symlink');
var path = require('path');
var config = require('./config');

var releases = module.exports = {};

releases.updateCurrentReleaseLink = function () {
  var releasePath = config.getReleasePath();
  var currentReleasePath = config.getCurrentReleasePath();

  symlink(releasePath, currentReleasePath);
};

releases.cleanOldReleases = function () {

};