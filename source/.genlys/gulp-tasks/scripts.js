var gulp = require('gulp');
var watch = require('gulp-watch');
var coffee = require('gulp-coffee');
var filter = require('gulp-filter');
var rename = require('gulp-rename');
var ngConfig = require('gulp-ng-config');
var ngAnnotate = require('gulp-ng-annotate');
var lazypipe = require('lazypipe');

var config = require('../config');
var reload = require('../browser-sync').reload;

var coffeeOptions = {
  bare: true
};

var watchOptions = {
  verbose: true
};

var ngConfigOptions = {
  createModule: false
};

var ngConfigTasks = lazypipe()
  .pipe(function () {
    return ngConfig(config.ngApp, ngConfigOptions);
  })
  .pipe(function () {
    return rename(function (path) {
      path.basename = 'config';
      path.extname = '.js';
    });
  })
  .pipe(function () {
    return gulp.dest(config.destDir + '/scripts/configs')
  });

function ngConfigStream (dest) {
  var src = config.getPathToNgConfig();

  return gulp.src(src)
    .pipe(ngConfigTasks())
    .pipe(gulp.dest(dest + '/scripts/configs'));
}

function scriptsStream (dest) {
  var coffeeFilter = filter('**/*.coffee', {restore: true});
  var jsFilter = filter('**/*.js', {restore: true});

  return gulp.src(config.paths.scripts)
    .pipe(coffeeFilter)
    .pipe(coffee(coffeeOptions))
    .pipe(coffeeFilter.restore)

    .pipe(jsFilter)
    .pipe(ngAnnotate())
    .pipe(jsFilter.restore)

    .pipe(gulp.dest(dest));
}

gulp.task('scripts', function () {
  return scriptsStream(config.destDir);
});

gulp.task('scripts:dist', ['ngConfig:dist'], function () {
  return scriptsStream(config.getReleasePath());
});

gulp.task('ngConfig', function () {
  return ngConfigStream(config.destDir);
});

gulp.task('ngConfig:dist', function () {
  return ngConfigStream(config.getReleasePath());
});

gulp.task('ngConfig:watch', function () {
  var src = config.getPathToNgConfig();

  return gulp.src(src)
    .pipe(watch(src, watchOptions))
    .pipe(ngConfigTasks())
    .pipe(gulp.dest(config.destDir + '/scripts/configs'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts:watch', function () {
  var coffeeFilter = filter('**/*.coffee', {restore: true});
  var jsFilter = filter('**/*.js', {restore: true});
  var src = config.paths.scripts;

  gulp.start('ngConfig:watch');

  return gulp.src(src)
    .pipe(watch(src, watchOptions))

    .pipe(coffeeFilter)
    .pipe(coffee(coffeeOptions))
    .pipe(coffeeFilter.restore)

    .pipe(jsFilter)
    .pipe(ngAnnotate())
    .pipe(jsFilter.restore)

    .pipe(gulp.dest(config.destDir))
    .pipe(reload({stream: true}));
});
