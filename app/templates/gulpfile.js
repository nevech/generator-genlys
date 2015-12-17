var gulp = require('gulp');
var plumber = require('gulp-plumber');

// require all task from gulp-tasks dir
require('require-dir')('./.genlys/gulp-tasks');

// apply gulp-plumber for all tasks
var _gulpsrc = gulp.src;
gulp.src = function() {
  return _gulpsrc.apply(gulp, arguments)
    .pipe(plumber());
};
