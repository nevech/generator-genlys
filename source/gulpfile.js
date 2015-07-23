var gulp = require('gulp');
var plumber = require('gulp-plumber');
var prompt = require('gulp-prompt');
var config = require('./.genlys/config');

// require all task from gulp-tasks dir
require('require-dir')('./.genlys/gulp-tasks');

// apply gulp-plumber for all tasks
var _gulpsrc = gulp.src;
gulp.src = function() {
  return _gulpsrc.apply(gulp, arguments)
    .pipe(plumber());
};

gulp.task('default', function () {
  gulp.src('package.json')
    .pipe(prompt.prompt({
      type: 'list',
      name: 'task',
      message: 'What do you want to do?',
      choices: [
        'serve',
        'build'
      ]
    }, function (answer) {
      gulp.start(answer.task);
    }));
});