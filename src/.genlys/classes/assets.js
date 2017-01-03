'use strict';

let config = require('../config');
let Base = require('../classes/base');

class Assets extends Base {
  constructor(dist) {
    super(dist, config.paths.assets);
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

}

module.exports = Assets;
