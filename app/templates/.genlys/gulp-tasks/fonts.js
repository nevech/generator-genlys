var gulp = require('gulp');
var watch = require('gulp-watch');

var config = require('../config');
var mainBowerFiles = require('main-bower-files');
var reload = require('../browser-sync').reload;

function getGlobFonts () {
  var glob = mainBowerFiles({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  });

  glob.concat('app/public/fonts/**/*');

  return glob;
}

gulp.task('fonts', function () {
  var glob = getGlobFonts();

  return gulp.src(glob)
    .pipe(gulp.dest(config.destDir + '/fonts'));
});

gulp.task('fonts:watch', function () {
  var glob = getGlobFonts();

  return gulp.src(glob)
    .pipe(watch(glob, {verbose: true}))
    .pipe(gulp.dest(config.getReleasePath() + '/fonts'))
    .pipe(reload({stream: true}));
});

gulp.task('fonts:dist', function () {
  var glob = getGlobFonts();

  return gulp.src(glob)
    .pipe(gulp.dest(config.getReleasePath() + '/fonts'));
});