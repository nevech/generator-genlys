'use strict';

let jade = require('gulp-jade');
let filter = require('gulp-filter');
let wiredep = require('wiredep').stream;
let lazypipe = require('lazypipe');

let config = require('../config');
let Base = require('./base');

class Templates extends Base {
  constructor(dist) {
    super(dist, config.paths.templates);

    this.jadeOptions = {
      pretty: true,
      locals: config.getConstants('jade')
    };
  }

  getStream() {
    let pipes = this.getLazypipe();

    return this.createStream()
      .pipe(pipes())
      .pipe(this.dest());
  }

  getStreamWithWatch() {
    let pipes = this.getLazypipe();

    return this.createWatchStream()
      .pipe(pipes())
      .pipe(this.dest())
      .pipe(this.reload());
  }

  getLazypipe() {
    let jadeFilter = filter('**/*.jade', {restore: true});
    let wiredepPipe = Templates.getLazypipeWiredep();

    return lazypipe()
      .pipe(() => jadeFilter)
      .pipe(jade, this.jadeOptions)
      .pipe(() => jadeFilter.restore)

      .pipe(wiredepPipe)
  }

  static getLazypipeWiredep() {
    let indexFilter = filter('index.html', {restore: true});

    return lazypipe()
      .pipe(() => indexFilter)
      .pipe(wiredep, {
        directory: './bower_components',
        ignorePath: /^(\.\.\/)*\.\.\//
      })
      .pipe(() => indexFilter.restore)
  }

}

module.exports = Templates;
