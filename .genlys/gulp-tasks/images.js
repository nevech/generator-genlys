var gulp = require('gulp');
var lazypipe = require('lazypipe');
var reload = require('../browser-sync').reload;

var config = require('../config');
var $ = require('gulp-load-plugins')(config.optionLoadPlugins);

var imageminTask = lazypipe()
  .pipe(function imagemin() {
    return $.imagemin({
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
    .pipe($.watch(config.paths.images, {verbose: true}))
    .pipe(imageminTask())
    .pipe(gulp.dest(config.destDir + '/images'))
    .pipe(reload({stream: true}));
});

gulp.task('images:dist', function () {
  return gulp.src(config.paths.images)
    .pipe(imageminTask())
    .pipe(gulp.dest(config.buildDir + '/images'));
});