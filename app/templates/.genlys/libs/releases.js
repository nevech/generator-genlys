var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var config = require('../config');
var Release = require('../classes/release');

var releases = module.exports = {};

releases.create = function (done) {
  var releasePath = config.getReleasePath();
  var release = Release.getByPath(releasePath);

  if (!release) {
    return done('Release not found');
  }

  release.setCurrent(function () {
    cleanOldReleases();
    done();
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
  var currentRelease = Release.getCurrent();

  if (!release) {
    return done('Release not found');
  }

  release.setCurrent(function (err) {
    if (!err && currentRelease) {
      currentRelease.removeSync();
    }

    done(err);
  });
};

function getReleases (callback) {
  var releasesPath = path.resolve('releases');
  var files = fs.readdirSync(releasesPath);
  var releases = [];

  _.each(files, function (fileName) {
    var filePath = path.resolve('releases', fileName);
    var release = Release.getByPath(filePath);

    if (release) {
      releases.push(release);
    }
  });

  return _.sortBy(releases, 'ctime');
}

function cleanOldReleases () {
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
}
