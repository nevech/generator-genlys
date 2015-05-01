var gulp = require('gulp');
var args = require('yargs').argv;
var del = require('del');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var env = process.env.NODE_ENV || 'development';
var isProduction = false;
var appName = 'myApp';

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  scope: ['dependencies', 'devDependencies']
});

gulp.task('clean', function (cb) {
  del('dist', cb);
});

gulp.task('assets', ['extras'], function () {
  return gulp.src('app/assets/**/*')
    .pipe(gulp.dest('./dist/assets'));
});

gulp.task('extras', function () {
  gulp.src([
    'app/*.*',
    '!app/*.jade',
    '!app/config.json',
  ], {
    dot: true
  }).pipe(gulp.dest('./dist'));
});

gulp.task('scripts', function () {
  return gulp.src('app/scripts/**/*.coffee')
    .pipe($.coffee({
      bare: true
    }))
    .pipe($.ngAnnotate())
    .pipe($.if(isProduction, $.uglify().on('error', $.util.log)))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('config', ['scripts'], function () {
  return gulp.src('app/config.json')
    .pipe($.ngConfig(appName + '.config', {
      environment: env
    }))
    .pipe(gulp.dest('dist/scripts/configs'))
});

gulp.task('styles', function () {
  var filterStyl = $.filter('**/*.styl');

  return gulp.src([
      'app/styles/**/*.styl',
      'app/styles/**/*.css'
    ])
    .pipe(filterStyl)
    .pipe($.stylus())
    .pipe(filterStyl.restore())
    .pipe($.autoprefixer({
      browsers: ['> 0.5%', 'ie 8', 'Opera 11.5']
    }))
    .pipe(gulp.dest('./dist/styles'));
});

gulp.task('build', ['clean'], function () {
  // Set env from args
  if (args.production) {
    isProduction = true;
    env = 'production';
  }

  gulp.start([
    'assets',
    'config',
    'styles',
  ]);
});