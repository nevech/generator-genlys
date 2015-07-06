var gulp = require('gulp');
var lazypipe = require('lazypipe');

var reload = require('browser-sync').reload;
var wiredep = require('wiredep').stream;

var config = require('../configs/');
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

gulp.task('html:watch', function () {
  return gulp.src(config.paths.html)
    .pipe($.watch(config.paths.html, {verbose: true}))
    .pipe(gulp.dest(config.destDir))
    .pipe(reload({stream: true}));
});

gulp.task('jade:watch', function () {
  return gulp.src(config.paths.jade)
    .pipe($.watch(config.paths.jade, {verbose: true}))
    .pipe($.jade(jadeOptions))
    .pipe(gulp.dest(config.destDir))
    .pipe(reload({stream: true}));
});

gulp.task('templates:watch', ['html:watch', 'jade:watch']);