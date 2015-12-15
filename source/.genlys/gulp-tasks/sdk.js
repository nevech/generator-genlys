var gulp = require('gulp');
var path = require('path');
var fsdk = require('fsdk');
var watch = require('gulp-watch');
var reload = require('../browser-sync').reload;
var config = require('../config');

var fsdkConfig = config.fsdk;

gulp.task('sdk:compile', function () {
  var dest = path.resolve(config.getReleasePath(), fsdkConfig.dest);

  return gulp.src(fsdkConfig.src)
    .pipe(fsdk.parseFile(fsdkConfig.env))
    .pipe(gulp.dest(dest));
});

gulp.task('sdk:watch', function () {
  var dest = path.resolve(config.destDir, fsdkConfig.dest);

  return gulp.src(fsdkConfig.src)
    .pipe(watch(fsdkConfig.src, {verbose: true}))
    .pipe(fsdk.parseFile(fsdkConfig.env))
    .pipe(gulp.dest(dest))
    .pipe(reload({stream: true}));
});