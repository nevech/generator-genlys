'use strict';

let path = require('path');
let imagemin = require('gulp-imagemin');
let config = require('../config');
let Base = require('./base');

class Images extends Base {
  constructor(dist) {
    super(dist, config.paths.images);

    this.dist = path.resolve(this.dist, 'images');
    this.imageminOptions = {
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    };
  }

  getStream() {
    return this.createStream()
      .pipe(imagemin(this.imageminOptions))
      .pipe(this.dest());
  }

  getStreamWithWatch() {
    return this.createWatchStream()
      .pipe(imagemin(this.imageminOptions))
      .pipe(this.dest())
      .pipe(this.reload());
  }

}

module.exports = Images;
