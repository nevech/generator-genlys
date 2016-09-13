var gulp = require('gulp');
var coffeelint = require('gulp-coffeelint');
var config = require('../config');
var path = require('path');

var pathToLintConfig = path.resolve(__dirname, '../../', 'configs/coffeelint.json')

gulp.task('lint', function () {
  gulp.src(config.paths.coffee)
    .pipe(coffeelint(pathToLintConfig))
    .pipe(coffeelint.reporter('coffeelint-stylish'))
    .pipe(coffeelint.reporter('fail'));
});
