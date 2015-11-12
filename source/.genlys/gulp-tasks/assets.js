var gulp = require('gulp');
var watch = require('gulp-watch');
var reload = require('../browser-sync').reload;
var config = require('../config');

gulp.task('assets', function () {
  return gulp.src(config.paths.assets)
    .pipe(gulp.dest(config.destDir));
});

gulp.task('assets:watch', function () {
  return gulp.src(config.paths.assets)
    .pipe(watch(config.paths.assets, {verbose: true}))
    .pipe(gulp.dest(config.destDir))
    .pipe(reload({stream: true}));
});

gulp.task('assets:dist', function () {
  return gulp.src(config.paths.assets)
    .pipe(gulp.dest(config.getReleasePath()));
});