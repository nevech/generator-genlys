'use strict';

let fs = require('fs');
let path = require('path');
let remove = require('remove');
let symlink = require('fs-symlink');
let _ = require('underscore');
let config = require('../config');

class Release {
  constructor(properties) {
    _.extend(this, properties);
  }

  isCurrent() {
    return this.path === config.getSymlinkPath();
  }

  setCurrent(callback) {
    let releasePath = config.getSymlinkPath();
    let promise = symlink(this.path, releasePath, 'dir');

    promise.then(callback);
  }

  removeSync() {
    remove.removeSync(this.path);
  }

  static getCurrent() {
    let symlinkPath = config.getSymlinkPath();
    let releasePath = fs.realpathSync(symlinkPath);

    if (!releasePath) return;

    return Release.getByPath(releasePath);
  };

  static getByPath(releasesPath) {
    let stats = fs.statSync(releasesPath);
    let fileName = path.basename(releasesPath);
    let nameRE = /^\d{4}-\d{2}-\d{2}_\d{2}:\d{2}:\d{2}$/;

    if (!nameRE.test(fileName) || !stats.isDirectory()) {
      return;
    }

    return new Release({
      stats,
      name: fileName,
      path: releasesPath,
      ctime: stats.ctime
    });
  }

}


module.exports = Release;
