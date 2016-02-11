var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var del = require('del');
var symlink = require('fs-symlink');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var useref = require('gulp-useref');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var revReplace = require('gulp-rev-replace');
var fs = require('fs');
var map = require('gulp-map');
var filter = require('gulp-filter');
var shell = require('gulp-shell');

var config = require('../config');
var releases = require('../libs/releases');

var compileTasks = (function () {
  var tasks = ['templates', 'scripts', 'styles', 'assets:dist', ['docs']];

  if (config.fsdk) {
    tasks.unshift(['sdk:compile'])
  }

  return tasks;
})();

gulp.task('compile', gulpsync.sync(compileTasks), function () {
  var jsFilter = filter('*.js', {restore: true});
  var cssFilter = filter('*.css', {restore: true});
  var htmlFilter = filter('**/*.html', {restore: true});
  var notIndexFilter = filter(['**/*.*', '!**/*.html'], {restore: true});

  return gulp.src(config.destDir + '/**/*.html')
    .pipe(useref({
      searchPath: ['.', config.destDir]
    }))
    // minify js file
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(jsFilter.restore)

    // minify css file
    .pipe(cssFilter)
    .pipe(minifyCss())
    .pipe(cssFilter.restore)

    // minify html file
    .pipe(htmlFilter)
    .pipe(minifyHtml({
      empty: true,
      spare: true
    }))
    .pipe(htmlFilter.restore)

    // rename js and css file
    .pipe(notIndexFilter)
    .pipe(rev())
    .pipe(notIndexFilter.restore)

    .pipe(revReplace())

    .pipe(gulp.dest(config.getReleasePath()));
});

gulp.task('docs', function() {
  return gulp.task('docs', shell.task([
    'node_modules/jsdoc/jsdoc.js '+
      '-c node_modules/angular-jsdoc/common/conf.json '+   // config file
      '-t node_modules/angular-jsdoc/angular-template '+   // template file
      '-r app/scripts/directives ' + // source code directory
      '-d dist/docs '+                           // output directory
      './README.md ' +                            // to include README.md as index contents
      '-r .tmp/scripts'                    // source code directory
  ]));
});

gulp.task('build', function () {
  var buildTasks = [
    'fonts:dist',
    'images:dist',
    'ngConfig',
    'robotstxt',
    'compile'
  ];

  return gulp.start(buildTasks, function (done) {
    releases.create(done);
    del(config.destDir);
  });

});