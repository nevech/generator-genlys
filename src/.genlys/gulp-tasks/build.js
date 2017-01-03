var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var del = require('del');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var useref = require('gulp-useref');
var minifyHtml = require('gulp-minify-html');
var cleanCSS = require('gulp-clean-css');
var revReplace = require('gulp-rev-replace');
var map = require('gulp-map');
var filter = require('gulp-filter');

var config = require('../config');
var releases = require('../libs/releases');

var compileTasks = ['templates', 'templateCache', 'scripts', 'styles', 'assets:dist'];

var buildTasks = (function () {
  var tasks = ['fonts:dist', 'images:dist', 'robotstxt', 'assets:dist'];

  if (config.fsdk) {
    tasks.unshift(['sdk:compile']);
  }

  if (config.isCompressFiles()) {
    tasks.push('ngConfig', ['compress']);
  } else {
    tasks.push('scripts:dist', 'styles:dist', 'templates:dist', 'templateCache:dist', 'bower:dist');
  }

  return tasks;
})();

gulp.task('compress', gulpsync.sync(compileTasks), function () {
  var jsFilter = filter('**/*.js', {restore: true});
  var cssFilter = filter('**/*.css', {restore: true});
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
    .pipe(cleanCSS())
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

gulp.task('build', gulpsync.sync(buildTasks), function (done) {
  releases.create(done);
  del(config.destDir);
});
