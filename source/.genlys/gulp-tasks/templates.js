var fs = require('fs');
var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var gulpif = require('gulp-if');
var jade = require('gulp-jade');
var lazypipe = require('lazypipe');

var browserSync = require('../browser-sync');
var wiredep = require('wiredep').stream;

var config = require('../config');

var jadeOptions = {
  pretty: true,
  locals: config.getConstants('jade')
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
    .pipe(gulpif('*.jade', jade(jadeOptions)))
    .pipe(gulp.dest(config.destDir));
});

gulp.task('html', function () {
  return gulp.src(config.paths.html)
    .pipe(gulp.dest(config.destDir));
});

gulp.task('jade', function () {
  return gulp.src(config.paths.jade)
    .pipe(jade(jadeOptions))
    .pipe(gulp.dest(config.destDir));
});

gulp.task('templates:watch', function  () {
  var src = config.destDir + "/*.html";

  gulp.watch(config.paths.html, ['html']);
  gulp.watch(config.paths.jade, ['jade']);

  gulp.watch(src).on('change', function (argument) {
    browserSync.reload();
  });
});