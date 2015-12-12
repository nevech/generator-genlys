var gulp = require('gulp');
var releases = require('../libs/releases');

gulp.task('rollback', releases.rollback);