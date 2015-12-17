var gulp = require('gulp');
var jade = require('gulp-jade');
var filter = require('gulp-filter');
var watch = require('gulp-watch');
var wiredep = require('wiredep').stream;

var reload = require('../browser-sync').reload;
var config = require('../config');

var jadeOptions = {
  pretty: true,
  locals: config.getConstants('jade')
};

function templatesStream (dest) {
  var jadeFilter = filter('**/*.jade', {restore: true});

  return gulp.src(config.paths.templates)
    .pipe(jadeFilter)
    .pipe(jade(jadeOptions))
    .pipe(jadeFilter.restore)
    .pipe(gulp.dest(dest));
}

gulp.task('wiredep', function () {
  return gulp.src('app/index.jade')
    .pipe(wiredep({
      directory: './bower_components',
      ignorePath: /^(\.\.\/)*\.\./
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
  var jadeFilter = filter('**/*.jade', {restore: true});
  var src = config.paths.templates;

  return gulp.src(src)
    .pipe(watch(src, {verbose: true}))

    .pipe(jadeFilter)
    .pipe(jade(jadeOptions))
    .pipe(jadeFilter.restore)

    .pipe(gulp.dest(config.destDir))
    .pipe(reload({stream: true}));
});
