'use strict';

let templateCache = require('gulp-angular-templatecache');
let watch = require('gulp-watch');
let path = require('path');
let config = require('../config');
let Base = require('../classes/base');
let map = require('gulp-map');

class TemplateCache extends Base {
  constructor(dist) {
    super(dist);

    this.setSource();

    this.options = {
      base: path.resolve(process.cwd(), this.dist),
      module: config.ngApp,
      standalone: false
    };
  }

  setSource() {
    let templateCachePath = config.paths.templateCache;

    this.src = templateCachePath.map( (p) => path.join(this.dist, p));
  }

  getStream() {
    return this.createStream()
      .pipe(templateCache(this.options))
      .pipe(this.dest(path.join(this.dist, 'scripts')));
  }

  getStreamWithWatch() {
    return this.createWatchStream(this.src, () => this.getStream());
  }

}

module.exports = TemplateCache;
