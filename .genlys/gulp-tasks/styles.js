var config = require('../config');
var lazypipe = require('lazypipe');
var reload = require('../browser-sync').reload;

var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    watch = require('gulp-watch'),
    filter = require('gulp-filter'),
    stylus = require('gulp-stylus'),
    autoprefixer = require('gulp-autoprefixer');

var stylesTasks = lazypipe()
  .pipe(function autoPrefixer() {
    return autoprefixer(config.autoprefixer);
  })
  .pipe(function () {
    return gulp.dest(config.destDir + '/styles');
  })
  .pipe(function () {
    return reload({stream: true});
  });

gulp.task('styles', function () {
  return gulp.src(config.paths.styles)
    .pipe(gulpif('*.styl', stylus()))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(gulp.dest(config.destDir + '/styles'));
});

gulp.task('css:watch', function () {
  return gulp.src(config.paths.css)
    .pipe(watch(config.paths.css, {verbose: true}))
    .pipe(stylesTasks());
});

gulp.task('stylus:watch', function () {
  return gulp.src(config.paths.stylus)
    .pipe(watch(config.paths.stylus, {verbose: true}))
    .pipe(stylus())
    .pipe(stylesTasks());
});

gulp.task('styles:watch', ['css:watch', 'stylus:watch']);