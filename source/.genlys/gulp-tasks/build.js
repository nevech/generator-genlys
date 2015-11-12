var gulp = require('gulp');
var del = require('del');
var symlink = require('fs-symlink');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var useref = require('gulp-useref');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var revReplace = require('gulp-rev-replace');
var fs = require('fs');

var config = require('../config');
var releases = require('../releases');

gulp.task('compile', ['templates', 'scripts', 'styles', 'assets:dist'], function () {
  var assets = useref.assets({searchPath: ['.', config.destDir]});

  return gulp.src(config.destDir + '/**/*.html')
    .pipe(assets)
    .pipe(gulpif('*.js', uglify(), rev() ))
    .pipe(gulpif('*.css', minifyCss(), rev() ))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(revReplace())
    .pipe(gulpif('*.html', minifyHtml({
      empty: true,
      spare: true
    })))
    .pipe(gulp.dest(config.getReleasePath()));
});

gulp.task('build', function () {

  var buildTasks = [
    'fonts:dist',
    'images:dist',
    'ngConfig',
    'compile',
    'robotstxt'
  ];

  return gulp.start(buildTasks, function () {
    releases.updateCurrentReleaseLink();
    releases.cleanOldReleases();
    del('.tmp');
  });

});