'use strict';

let gulp = require('gulp');
let Core = require('./.genlys/classes')
let Releases = require('./.genlys/libs/releases');

// require all task from gulp-tasks dir
require('require-dir')('./.genlys/gulp-tasks');

gulp.task('rollback', Releases.rollback);

gulp.task('templates', Core.Templates.getTask('tmp'));
gulp.task('templates:dist', Core.Templates.getTask('release'));
gulp.task('templates:watch', Core.Templates.getTask('tmp', true));

gulp.task('templateCache', ['templates'], Core.TemplateCache.getTask('tmp'));
gulp.task('templateCache:dist', ['templates:dist'], Core.TemplateCache.getTask('release'));
gulp.task('templateCache:watch', Core.TemplateCache.getTask('tmp', true));

gulp.task('styles', Core.Styles.getTask('tmp'));
gulp.task('styles:dist', Core.Styles.getTask('release'));
gulp.task('styles:watch', Core.Styles.getTask('tmp', true));

gulp.task('images', Core.Images.getTask('tmp'));
gulp.task('images:dist', Core.Images.getTask('release'));
gulp.task('images:watch', Core.Images.getTask('tmp', true));

gulp.task('assets', Core.Assets.getTask('tmp'));
gulp.task('assets:dist', Core.Assets.getTask('release'));
gulp.task('assets:watch', Core.Assets.getTask('tmp', true));

gulp.task('fonts', Core.Fonts.getTask('tmp'));
gulp.task('fonts:dist', Core.Fonts.getTask('release'));
gulp.task('fonts:watch', Core.Fonts.getTask('tmp', true));
