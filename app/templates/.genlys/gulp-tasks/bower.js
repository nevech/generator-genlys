var gulp = require('gulp');
var config = require('../config');

gulp.task('bower:dist', function () {
  var src = 'bower_components/**/*.*';
  var dist = config.getReleasePath() + '/bower_components';

  return gulp.src(src)
    .pipe(gulp.dest(dist));
});
