var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var del = require('del');
var config = require('../config');
var shell = require('gulp-shell');

gulp.task('clean:docs', function (done) {
  del('docs').then(function () {
    done();
  });
});

gulp.task('docs', gulpsync.sync(['clean:tmp', 'clean:docs', ['scripts']]), function() {
  return gulp.task('docs', shell.task([
    'node_modules/jsdoc/jsdoc.js '+
      '-c node_modules/angular-jsdoc/common/conf.json '+   // config file
      '-t node_modules/angular-jsdoc/angular-template '+   // template file
      '-d jsdocs '+                                          // output directory
      'README.md ' +                                    // to include README.md as index contents
      '-r ' + config.destDir + '/scripts '+                // source code directory
      '--verbose'                                          // Log detailed information to the console as JSDoc runs
  ]));
});

