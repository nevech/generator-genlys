'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to the exceptional ' + chalk.green('Genlys') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'appName',
      message: 'Enter project name',
      default: 'myApp'
    }];

    this.prompt(prompts, function (answers) {
      this.options = answers;

      done();
    }.bind(this));

  },

  writing: {
    gulpfile: function () {
      this.template('gulpfile.js');
    },

    git: function () {
      this.copy('gitignore', '.gitignore');
    },

    app: function () {
      mkdirp('app');
      mkdirp('app/styles');
      mkdirp('app/scripts');
      mkdirp('app/scripts/config');
      mkdirp('app/scripts/controllers');
      mkdirp('app/scripts/services');
      mkdirp('app/scripts/factories');
      mkdirp('app/scripts/directives');
      mkdirp('app/assets');
      mkdirp('app/assets/images');
      mkdirp('app/assets/fonts');

      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {appName: this.options.appName}
      );

      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        {appName: this.options.appName}
      );

      this.copy('bowerrc', '.bowerrc');
    },

  },

  install: function () {
    this.installDependencies();
  }
});
