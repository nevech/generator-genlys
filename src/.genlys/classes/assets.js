'use strict';

let config = require('../config');
let Base = require('../classes/base');

class Assets extends Base {
  constructor(dist) {
    super(dist, config.paths.assets);
  }
}

module.exports = Assets;
