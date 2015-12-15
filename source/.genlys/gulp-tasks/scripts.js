var config = require('../config');
var lazypipe = require('lazypipe');
var reload = require('../browser-sync').reload;

var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    watch = require('gulp-watch'),
    coffee = require('gulp-coffee'),
    filter = require('gulp-filter'),
    rename = require('gulp-rename'),
    ngConfig = require('gulp-ng-config'),
    ngAnnotate = require('gulp-ng-annotate');

var coffeeOptions = {
  bare: true
};

var watchOptions = {
  verbose: true
};

var jsTasks = lazypipe()
  .pipe(ngAnnotate)
  .pipe(function () {
    return gulp.dest(config.destDir);
  })
  .pipe(function () {
    return reload({stream: true});
  });

var ngConfigTasks = lazypipe()
  .pipe(function () {
    return ngConfig(config.ngApp, {
      createModule: false,
    });
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

function scriptsStream (dest) {
  return gulp.src(config.paths.scripts)
    .pipe(gulpif('*.coffee', coffee(coffeeOptions)))
    .pipe(ngAnnotate())
    .pipe(gulp.dest(dest));
}

gulp.task('scripts', function () {
  return scriptsStream(config.destDir);
});

gulp.task('scripts:dist', function () {
  return scriptsStream(config.getReleasePath());
});

gulp.task('ngConfig', function () {
  var src = config.getPathToNgConfig();

  return gulp.src(src)
    .pipe(ngConfigTasks());
});

gulp.task('ngConfig:watch', function () {
  var src = config.getPathToNgConfig();

  return gulp.src(src)
    .pipe(watch(src, watchOptions))
    .pipe(ngConfigTasks())
    .pipe(reload({stream: true}));
});

gulp.task('js:watch', function () {
  return gulp.src(config.paths.js)
    .pipe(watch(config.paths.js, watchOptions))
    .pipe(jsTasks());
});

gulp.task('coffee:watch', function () {
  return gulp.src(config.paths.coffee)
    .pipe(watch(config.paths.coffee, watchOptions))
    .pipe(coffee(coffeeOptions))
    .pipe(jsTasks());
});

gulp.task('scripts:watch', ['js:watch', 'coffee:watch', 'ngConfig:watch']);


