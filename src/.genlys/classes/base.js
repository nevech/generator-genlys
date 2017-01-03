'use strict';

let gulp = require('gulp');
let watch = require('gulp-watch');
let config = require('../config');
let reload = require('../browser-sync').reload;

class Base {
  constructor(dist, src) {
    this.gulp = gulp;
    this.dist = dist;
    this.src = src;
  }

  createStream(src) {
    src = src || this.src;

    return this.gulp.src(src);
  }

  createWatchStream(src, options) {
    src = src || this.src;
    options = options || {verbose: true};

    return watch(src, options);
  }

  dest(dist) {
    dist = dist || this.dist;

    return this.gulp.dest(dist);
  }

  reload(options) {
    options = options || {stream: true};

    return reload(options);
  }

  getStream() {
    return this.createStream()
      .pipe(this.dest());
  }

  getStreamWithWatch() {
    return this.createWatchStream()
      .pipe(this.dest())
      .pipe(this.reload());
  }

  static getTask(dist, isWatch) {
    switch (dist) {
      case 'tmp':
        dist = config.destDir;
        break;
      case 'release':
        dist = config.getReleasePath();
        break;
    }

    return () => {
      let inst = new this(dist);
      return isWatch ? inst.getStreamWithWatch() : inst.getStream();
    }
  }

}

module.exports = Base;
