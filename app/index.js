'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var _ = require('underscore');
var s = require('underscore.string');

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
    }, {
      type: 'confirm',
      name: 'includeUnderscore',
      message: 'Will you use underscore.js?',
      default: true
    }];

    this.prompt(prompts, function (answers) {
      this.options = answers;
      this.options.appName = s.camelize(answers.appName);

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

    editorConfig: function () {
      this.copy('editorconfig', '.editorconfig');
    },

    readme: function () {
      this.copy('_README.md', 'README.md');
    },

    bower: function () {
      var bower = {
        name: this.options.appName,
        private: true,
        version: '0.0.1',
        dependencies: {
          'angular': '^1.3.1',
          'angular-resource': '^1.3.1',
          'angular-cookies': '^1.3.1',
          'angular-route': '^1.3.1',
          'normalize.css': '^3.0.2'
        },
        resolutions: {
          'angular': '>=1.3.1'
        }
      };

      if (this.options.includeUnderscore) {
        bower.dependencies['underscore'] = '^1.8.2';
      }

      this.copy('bowerrc', '.bowerrc');
      this.write('bower.json', JSON.stringify(bower, null, 2));
    },

    packageJSON: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this.options
      );
    },

    app: function () {
      mkdirp('app/public/fonts');
      mkdirp('app/public/images');
      mkdirp('app/scripts');
      mkdirp('app/scripts/configs');
      mkdirp('app/scripts/controllers');
      mkdirp('app/scripts/services');
      mkdirp('app/scripts/factories');
      mkdirp('app/scripts/filters');
      mkdirp('app/scripts/directives');
      mkdirp('app/styles');
      mkdirp('app/views');

      this.directory('public', 'app/public');
      this.directory('scripts', 'app/scripts');
      this.directory('styles', 'app/styles');
      this.directory('views', 'app/views');
      this.copy('index.jade', 'app/index.jade');

      this.copy('robots.txt', 'app/public/robots.txt');
      this.copy('config.json', 'app/config.json');
    }

  },

  install: function () {
    this.installDependencies();
  },

  end: function () {
    this.log(chalk.yellow('Your project is generated! Happy working :)'));
    this.log('Run ' + chalk.green('gulp serve') + ' for start developments');
  }
});
