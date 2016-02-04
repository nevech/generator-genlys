var gulp = require('gulp');
var prompt = require('gulp-prompt');

gulp.task('default', function () {
  return gulp.src('package.json')
    .pipe(prompt.prompt({
      type: 'list',
      name: 'task',
      message: 'What do you want to do?',
      choices: [
        'dev',
        'build'
      ]
    }, function (answer) {
      gulp.start(answer.task);
    }));
});