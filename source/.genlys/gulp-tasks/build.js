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
var config = require('../config');

function updateCurrentReleaseSymlink() {
  var releasePath = config.getReleasePath();
  var currentReleasePath = config.getCurrentReleasePath();

  symlink(releasePath, currentReleasePath);
}

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
    updateCurrentReleaseSymlink();
    del('.tmp');
  });

});
