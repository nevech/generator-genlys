var gulp = require('gulp');
var reload = require('browser-sync').reload;

var config = require('../configs/');
var $ = require('gulp-load-plugins')(config.optionLoadPlugins);

gulp.task('assets', function () {
  return gulp.src(config.paths.assets)
    .pipe(gulp.dest(config.destDir));
});

gulp.task('assets:watch', function () {
  return gulp.src(config.paths.assets)
    .pipe($.watch(config.paths.assets, {verbose: true}))
    .pipe(gulp.dest(config.destDir))
    .pipe(reload({stream: true}));
});

gulp.task('assets:dist', function () {
  return gulp.src(config.paths.assets)
    .pipe(gulp.dest(config.buildDir));
});