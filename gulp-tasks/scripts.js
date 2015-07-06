var config = require('../configs/');
var lazypipe = require('lazypipe');
var reload = require('browser-sync').reload;

var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    watch = require('gulp-watch'),
    coffee = require('gulp-coffee'),
    filter = require('gulp-filter'),
    rename = require('gulp-rename'),
    ngConfig = require('gulp-ng-config'),
    ngAnnotate = require('gulp-ng-annotate');

var coffeeOptions = {
  bare: true
};

var scriptsTasks = lazypipe()
  .pipe(ngAnnotate)
  .pipe(function () {
    return gulp.dest(config.destDir + '/scripts');
  })
  .pipe(function () {
    return reload({stream: true});
  });

gulp.task('scripts', function () {
  return gulp.src(config.paths.scripts)
    .pipe(gulpif('*.coffee', coffee(coffeeOptions)))
    .pipe(ngAnnotate())
    .pipe(gulp.dest(config.destDir + '/scripts'));
});

gulp.task('js:watch', function () {
  return gulp.src(config.paths.js)
    .pipe(watch(config.paths.js, {verbose: true}))
    .pipe(scriptsTasks());
});

gulp.task('coffee:watch', function () {
  return gulp.src(config.paths.coffee)
    .pipe(watch(config.paths.coffee, {verbose: true}))
    .pipe(coffee(coffeeOptions))
    .pipe(scriptsTasks());
});

gulp.task('scripts:watch', ['js:watch', 'coffee:watch']);

gulp.task('ngConfig', function () {
  var src = config.getPathToNgConfig();

  return gulp.src(src)
    .pipe(ngConfig(config.ngApp, {
      createModule: false,
    }))
    .pipe(rename(function (path) {
      path.basename = 'config';
      path.extname = '.js';
    }))
    .pipe(gulp.dest(config.destDir + '/scripts/configs'))
});