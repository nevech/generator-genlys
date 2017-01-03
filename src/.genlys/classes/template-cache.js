'use strict';

let templateCache = require('gulp-angular-templatecache');
let path = require('path');
let config = require('../config');
let Base = require('../classes/base');

class TemplateCache extends Base {
  constructor(dist) {
    super(dist);

    this.src = config.paths.templateCache.map(p => path.join(this.dist, p));

    this.options = {
      base: path.resolve(process.cwd(), this.dist),
      module: config.ngApp,
      standalone: false
    };
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
