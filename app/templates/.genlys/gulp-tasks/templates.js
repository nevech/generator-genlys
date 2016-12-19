var gulp = require('gulp');
var pug = require('gulp-pug');
var filter = require('gulp-filter');
var watch = require('gulp-watch');
var wiredep = require('wiredep').stream;

var reload = require('../browser-sync').reload;
var config = require('../config');

var pugOptions = {
  pretty: true,
  locals: config.getConstants('pug')
};

function templatesStream (dest) {
  var pugFilter = filter('**/*.pug', {restore: true});

  return gulp.src(config.paths.templates)
    .pipe(pugFilter)
    .pipe(pug(pugOptions))
    .pipe(pugFilter.restore)
    .pipe(gulp.dest(dest));
}

gulp.task('wiredep', function () {
  return gulp.src('app/index.pug')
    .pipe(wiredep({
      directory: './bower_components',
      ignorePath: /^(\.\.\/)*\.\.\//
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('templates', ['wiredep'], function () {
  return templatesStream(config.destDir)
});

gulp.task('templates:dist', ['wiredep'], function () {
  return templatesStream(config.getReleasePath())
});

gulp.task('templates:watch', function  () {
  var pugFilter = filter('**/*.pug', {restore: true});
  var src = config.paths.templates;

  return gulp.src(src)
    .pipe(watch(src, {verbose: true}))

    .pipe(pugFilter)
    .pipe(pug(pugOptions))
    .pipe(pugFilter.restore)

    .pipe(gulp.dest(config.destDir))
    .pipe(reload({stream: true}));
});
