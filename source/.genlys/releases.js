var symlink = require('fs-symlink');
var fs = require('fs');
var path = require('path');
var remove = require('remove');
var _ = require('underscore');

var config = require('./config');

var releases = module.exports = {};

releases.updateCurrentReleaseLink = function () {
  var releasePath = config.getReleasePath();
  var currentReleasePath = config.getCurrentReleasePath();

  symlink(releasePath, currentReleasePath, 'dir');
};

releases.cleanOldReleases = function () {
  var keepReleases = keepReleases || 2;
  var releases = getReleases();
  var countReleases = releases.length;
  var countOldReleases = countReleases - keepReleases;

  if (countOldReleases <= 0) {
    return;
  }

  var oldReleases = releases.slice(0, countOldReleases);

  _.each(oldReleases, function (release) {
    remove.removeSync(release.path);
  });
};

function getReleases (callback) {
  var releasesPath = path.resolve('releases');
  var files = fs.readdirSync(releasesPath);
  var releases = [];

  _.each(files, function (fileName) {
    var filePath = path.resolve('releases', fileName);

    if (filePath === config.getCurrentReleasePath()) {
      return;
    }

    var stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      releases.push({
        name: fileName,
        path: filePath,
        ctime: stats.ctime
      })
    }
  });

  return _.sortBy(releases, 'ctime');
}