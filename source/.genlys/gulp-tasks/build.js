var gulp = require('gulp');
var del = require('del');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var useref = require('gulp-useref');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var revReplace = require('gulp-rev-replace');

var config = require('../config');

gulp.task('clean:dist', function (cb) {
  del(config.buildDir, cb);
});

gulp.task('compile:dist', ['templates', 'scripts', 'styles', 'assets:dist'], function () {
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
    .pipe(gulp.dest(config.buildDir));
});

gulp.task('build', ['clean:dist'], function () {

  gulp.start([
    'fonts:dist',
    'images:dist',
    'ngConfig',
    'compile:dist',
    'robotstxt'
  ], function () {
    del('.tmp');
  });

});
