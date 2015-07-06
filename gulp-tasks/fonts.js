var gulp = require('gulp');
var config = require('../configs/');
var mainBowerFiles = require('main-bower-files');

function bowerFonts(dest) {
  var glob = mainBowerFiles({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  });

  return gulp.src(glob)
    .concat('app/public/fonts/**/*'))
    .pipe(gulp.dest(dest));
}

gulp.task('bowerFonts', function () {
  return bowerFonts(config.destDir + '/fonts');
});

gulp.task('bowerFonts:dist', function () {
  return bowerFonts(config.buildDir + '/fonts');
});