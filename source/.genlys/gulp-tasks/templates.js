var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var lazypipe = require('lazypipe');

var browserSync = require('../browser-sync');
var wiredep = require('wiredep').stream;

var config = require('../config');
var $ = require('gulp-load-plugins')(config.optionLoadPlugins);

var jadeOptions = {
  pretty: true
};

gulp.task('wiredep', function () {
  return gulp.src('app/index.jade')
    .pipe(wiredep({
      directory: './bower_components',
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('templates', ['wiredep'], function () {
  return gulp.src(config.paths.templates)
    .pipe($.if('*.jade', $.jade(jadeOptions)))
    .pipe(gulp.dest(config.destDir));
});

gulp.task('html', function () {
  return gulp.src(config.paths.html)
    .pipe(gulp.dest(config.destDir));
});

gulp.task('jade', function () {
  return gulp.src(config.paths.jade)
    .pipe($.jade(jadeOptions))
    .pipe(gulp.dest(config.destDir));
});

gulp.task('templates:watch', function  () {
  gulp.watch(config.paths.html, ['html']);
  gulp.watch(config.paths.jade, ['jade']);

  gulp.watch(".tmp/*.html").on('change', function (argument) {
    browserSync.reload();
  });
});