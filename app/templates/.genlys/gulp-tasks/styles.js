var gulp = require('gulp');
var watch = require('gulp-watch');
var filter = require('gulp-filter');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var lazypipe = require('lazypipe');

var config = require('../config');
var reload = require('../browser-sync').reload;

function stylesStream (dest) {
  var stylusFilter = filter('**/*.styl', {restore: true});
  var cssFilter = filter('**/*.css', {restore: true});

  return gulp.src(config.paths.styles)
    .pipe(stylusFilter)
    .pipe(stylus())
    .pipe(stylusFilter.restore)

    .pipe(cssFilter)
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(cssFilter.restore)

    .pipe(gulp.dest(dest));
}

gulp.task('styles', function () {
  return stylesStream(config.destDir);
});

gulp.task('styles:dist', function () {
  return stylesStream(config.getReleasePath());
});

gulp.task('styles:watch', function () {
  var stylusFilter = filter('**/*.styl', {restore: true});
  var cssFilter = filter('**/*.css', {restore: true});
  var src = config.paths.styles;

  return gulp.src(src)
    .pipe(watch(src, {verbose: true}))

    .pipe(stylusFilter)
    .pipe(stylus())
    .pipe(stylusFilter.restore)

    .pipe(cssFilter)
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(cssFilter.restore)

    .pipe(gulp.dest(config.destDir))
    .pipe(reload({stream: true}));
});
