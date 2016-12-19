'use strict';
let yeoman = require('yeoman-generator');
let chalk = require('chalk');
let yosay = require('yosay');
let mkdirp = require('mkdirp');
let _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    let done = this.async();

    this.log(yosay(
      'Welcome to the exceptional ' + chalk.green('Genlys') + ' generator!'
    ));

    let prompts = [{
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

    return this.prompt(prompts).then((answers) => {
      this.options = answers;
      this.options.appName = _.camelCase(answers.appName);

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
      let angularVersion = '1.6.0';
      let bower = {
        name: this.options.appName,
        version: '0.0.0',
        dependencies: {
          'angular': '^' + angularVersion,
          'angular-resource': '^' + angularVersion,
          'angular-cookies': '^' + angularVersion,
          'angular-route': '^' + angularVersion,
          'normalize.css': '^5.0.0'
        },
        resolutions: {
          'angular': '>=' + angularVersion
        }
      };

      if (this.options.includeUnderscore) {
        bower.dependencies['underscore'] = '^1.8.3';
      }

      this.copy('bowerrc', '.bowerrc');
      this.write('bower.json', JSON.stringify(bower, null, 2));
    },

    packageJSON: function () {
      let packageFile = require(this.sourceRoot() + '/_package.json');

      let packageJSON = {
        name: this.options.appName,
        description: this.options.appName,
        version: '0.0.0',
        main: 'gulpfile.js',
        devDependencies: packageFile.devDependencies,
        scripts: packageFile.scripts
      };

      this.write('package.json', JSON.stringify(packageJSON, null, 2));
    },

    genlys: function () {
      this.directory('.genlys', '.genlys');
    },

    configs: function () {
      this.directory('configs', 'configs');
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

      this.copy('index.pug', 'app/index.pug');
    }

  },

  install: function () {
    this.installDependencies();
  },

  end: function () {
    this.log(chalk.yellow('Your project is generated! Happy working :)'));
    this.log('Run ' + chalk.green('gulp dev') + ' for start developments');
  }
});
