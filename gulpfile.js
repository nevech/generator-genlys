var gulp = require('gulp');
var browserSync = require('browser-sync');
var autoprefixer = require('autoprefixer-core');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  scope: ['dependencies', 'devDependencies']
});

var reload = browserSync.reload;

var autoprefixerConfig = {
  browsers: ['> 50%']
};

/**
 * Clean folder dist and tmp
 * @return {object} stream
 */
gulp.task('clean', function () {
  return gulp.src(['./dist', './tmp'])
    .pipe($.clean())
});

/**
 * Copy assets to dist
 * @return {object} stream
 */
gulp.task('assets:dist', function () {
  return gulp.src('./app/assets/**/*')
    .pipe(gulp.dest('./dist/assets'));
});

/**
 * Compile jade to dist
 * @return {object} stream
 */
gulp.task('jade:dist', function () {
  var assets = $.useref.assets()

  return gulp.src('./app/**/*.jade')
    .pipe($.jade({
      pretty: true
    }))
    .on('error', $.util.log)
    .pipe(assets)
    .pipe($.if('*.js', $.uglify(), $.rev() ))
    .pipe($.if('*.css', $.minifyCss()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'));
});

/**
 * Compile stylus to dist
 * @return {object} stream
 */
gulp.task('styles:dist', function (cb) {
  var filter = $.filter('**/*.styl');
  var src = [
    './app/styles/**/*.styl',
    './app/styles/**/*.css'
  ];

  return gulp.src(src)
    .pipe(filter)
    .pipe($.stylus({
      compress: true
    }))
    .on('error', $.util.log)
    .pipe(filter.restore())
    .pipe($.concat("main.min.css"))
    .pipe($.postcss([
      autoprefixer(autoprefixerConfig)
    ]))
    .pipe(gulp.dest('./dist/styles'));
});

/**
 * Compile coffee to dist
 * @return {object} stream
 */
gulp.task('coffee:dist', function () {
  var stream = gulp.src('./app/scripts/**/*.coffee')
    .pipe($.coffee({
      bare: true
    }))
    .pipe($.concat("main.min.js"))
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe($.sourcemaps.init())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./dist/scripts'))
});

gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/*.jade')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

/**
 * Imagemin
 * @return {stream}
 */
gulp.task('imagemin:dist', function () {
  return gulp.src('app/assets/images/**/*.{jpg,.png,.jpeg,.svg}')
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('build', ['clean'], function () {

  gulp.start([
    'assets:dist',
    'imagemin:dist',
    'wiredep',
    'jade:dist',
    'styles:dist',
    'coffee:dist'
  ]);

});

gulp.task('default', ['build']);