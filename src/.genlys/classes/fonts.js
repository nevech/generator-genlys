'use strict';

let mainBowerFiles = require('main-bower-files');
let path = require('path');
let config = require('../config');
let Base = require('../classes/base');

class Fonts extends Base {
  constructor(dist) {
    super(path.join(dist, 'fonts'));

    let src = mainBowerFiles({
      filter: '**/*.{eot,svg,ttf,woff,woff2}'
    });

    this.src = src.concat('app/public/fonts/**/*');
  }
}

module.exports = Fonts;
