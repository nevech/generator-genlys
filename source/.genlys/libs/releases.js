var symlink = require('fs-symlink');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var config = require('../config');
var Release = require('../classes/release');

var releases = module.exports = {};

releases.rollbackToLast = function () {
  var symlinkPath = config.getSymlinkPath();
};

releases.updateCurrentSymlink = function (releasePath) {
  var releasePath = config.getReleasePath();

  symlink(releasePath, releasePath, 'dir');
};

releases.cleanOld = function () {
  var keepReleases = config.keepReleases || 2;
  var releases = getReleases();
  var countReleases = releases.length;
  var countOldReleases = countReleases - keepReleases;

  if (countOldReleases <= 0) {
    return;
  }

  var oldReleases = releases.slice(0, countOldReleases);

  _.each(oldReleases, function (release) {
    if (!release.isCurrent()) {
      release.removeSync();
    }
  });
};

releases.rollback = function (to, done) {
  if (arguments.length < 2) {
    done = arguments[0];
    to = process.argv[3];
    to = Math.abs(to);
  }

  if (!to) {
    return done('Must specify a release number');
  }

  var releases = getReleases();
  var indexRelease = releases.length - 1 - to;
  var release = releases[indexRelease];

  if (!release) {
    return done('Release not found');
  }

  release.setCurrent(done);
};

function getReleases (callback) {
  var releasesPath = path.resolve('releases');
  var files = fs.readdirSync(releasesPath);
  var releases = [];

  _.each(files, function (fileName) {
    var filePath = path.resolve('releases', fileName);
    var stats = fs.statSync(filePath);
    var nameRE = /^\d{4}-\d{2}-\d{2}_\d{2}:\d{2}:\d{2}$/;

    if (stats.isDirectory() && nameRE.test(fileName)) {
      var release = new Release({
        name: fileName,
        path: filePath,
        ctime: stats.ctime,
        stats: stats
      });

      releases.push(release);
    }
  });

  return _.sortBy(releases, 'ctime');
}
