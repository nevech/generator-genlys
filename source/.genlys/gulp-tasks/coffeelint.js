var gulp = require('gulp');
var guppy = require('git-guppy')(gulp);
var coffeelint = require('gulp-coffeelint');
var stylish = require('coffeelint-stylish');
var config = require('../config');
var path = require('path');

var pathToLintConfig = path.resolve(__dirname, '../../', 'configs/coffeelint.json')

gulp.task('lint', function () {
  gulp.src(config.paths.coffee)
    .pipe(coffeelint(pathToLintConfig, null, true))
    .pipe(coffeelint.reporter(stylish))
    .pipe(coffeelint.reporter('fail'));
});

gulp.task('pre-commit', ['lint']);