var gulp = require('gulp');
var lazypipe = require('lazypipe');
var watch = require('gulp-watch');
var imagemin = require('gulp-imagemin');
var reload = require('../browser-sync').reload;
var config = require('../config');

var imageminTask = lazypipe()
  .pipe(function imageMin() {
    return imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    });
  });

gulp.task('images', function () {
  return gulp.src(config.paths.images)
    .pipe(imageminTask())
    .pipe(gulp.dest(config.destDir + '/images'));
});

gulp.task('images:watch', function () {
  return gulp.src(config.paths.images)
    .pipe(watch(config.paths.images, {verbose: true}))
    .pipe(imageminTask())
    .pipe(gulp.dest(config.destDir + '/images'))
    .pipe(reload({stream: true}));
});

gulp.task('images:dist', function () {
  return gulp.src(config.paths.images)
    .pipe(imageminTask())
    .pipe(gulp.dest(config.getReleasePath() + '/images'));
});