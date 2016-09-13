'use strict';

let gulp = require('gulp');
let Core = require('./.genlys/classes')

// require all task from gulp-tasks dir
require('require-dir')('./.genlys/gulp-tasks');

gulp.task('templates', Core.Templates.getTask('tmp'));
gulp.task('templates:dist', Core.Templates.getTask('release'));
gulp.task('templates:watch', Core.Templates.getTask('tmp', true));

gulp.task('templateCache', ['templates'], Core.TemplateCache.getTask('tmp'));
gulp.task('templateCache:dist', ['templates:dist'], Core.TemplateCache.getTask('release'));
gulp.task('templateCache:watch', Core.TemplateCache.getTask('tmp', true));

gulp.task('images', Core.Images.getTask('tmp'));
gulp.task('images:dist', Core.Images.getTask('release'));
gulp.task('images:watch', Core.Images.getTask('tmp', true));
