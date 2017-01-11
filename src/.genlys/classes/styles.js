'use strict';

let lazypipe = require('lazypipe');
let postcss = require('gulp-postcss');
let map = require('gulp-map');
let config = require('../config');
let Base = require('./base');

let postprocessors = [
  require('autoprefixer'),
  require('postcss-nested'),
  require("postcss-cssnext")
];

class Styles extends Base {
  constructor(dist) {
    super(dist, config.paths.css);
  }

  getStream() {
    return this.createStream()
      .pipe(postcss(postprocessors))
      .pipe(this.dest());
  }

  getStreamWithWatch() {
    return this.createWatchStream()
      .pipe(postcss(postprocessors))
      .pipe(this.dest())
      .pipe(this.reload());
  }

}

module.exports = Styles;
