var gulp = require('gulp');
var path = require('path');
var fsdk = require('fsdk');
var watch = require('gulp-watch');
var filter = require('gulp-filter');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var coffee = require('gulp-coffee');

var reload = require('../browser-sync').reload;
var config = require('../config');

var fsdkConfig = config.fsdk;
var jadeOptions = {
  pretty: true,
  locals: config.getConstants('jade')
};

gulp.task('sdk:compile', function () {
  var coffeeFilter = filter('**/*.coffee', {restore: true});
  var stylusFilter = filter('**/*.styl', {restore: true});
  var jadeFilter = filter('**/*.jade', {restore: true});
  var dest = path.resolve(config.getReleasePath(), fsdkConfig.dest);

  return gulp.src(fsdkConfig.src)
    .pipe(fsdk.parseFile(fsdkConfig.env))

    // CoffeeScript filter
    .pipe(coffeeFilter)
    .pipe(coffee({bare: true}))
    .pipe(coffeeFilter.restore)

    // Stylus filter
    .pipe(stylusFilter)
    .pipe(stylus())
    .pipe(stylusFilter.restore)

    // Jade filter
    .pipe(jadeFilter)
    .pipe(jade(jadeOptions))
    .pipe(jadeFilter.restore)

    .pipe(gulp.dest(dest));
});

gulp.task('sdk:watch', function () {
  var coffeeFilter = filter('**/*.coffee', {restore: true});
  var stylusFilter = filter('**/*.styl', {restore: true});
  var jadeFilter = filter('**/*.jade', {restore: true});
  var dest = path.resolve(config.destDir, fsdkConfig.dest);

  return gulp.src(fsdkConfig.src)
    .pipe(watch(fsdkConfig.src, {verbose: true}))
    .pipe(fsdk.parseFile(fsdkConfig.env))

    // CoffeeScript filter
    .pipe(coffeeFilter)
    .pipe(coffee({bare: true}))
    .pipe(coffeeFilter.restore)

    // Stylus filter
    .pipe(stylusFilter)
    .pipe(stylus())
    .pipe(stylusFilter.restore)

    // Jade filter
    .pipe(jadeFilter)
    .pipe(jade(jadeOptions))
    .pipe(jadeFilter.restore)

    .pipe(gulp.dest(dest))
    .pipe(reload({stream: true}));
});