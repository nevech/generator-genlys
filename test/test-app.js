'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('projects:app', function () {
  before(function (done) {
    var mockPrompts = {
      appName: 'testApp'
    };

    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join( __dirname, './tmp'))
      .withPrompts(mockPrompts)
      .on('end', done);
  });

  // it('creates files', function () {
  //   assert.file([
  //     'bower.json',
  //     'package.json',
  //     '.editorconfig',
  //   ]);
  // });

});
