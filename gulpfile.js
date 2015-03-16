var gulp = require('gulp');
var browserSync = require('browser-sync');
var autoprefixer = require('autoprefixer-core');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  scope: ['dependencies', 'devDependencies']
});

var reload = browserSync.reload;

var config = {
  app: './app',
  dist: './dist',
  tmp: './.tmp'
};

var autoprefixerConfig = {
  browsers: ['> 50%']
};

/**
 * Clean folder dist and tmp
 * @return {object} stream
 */
gulp.task('clean', function () {
  return gulp.src([config.dist, config.tmp])
    .pipe($.clean())
});

/**
 * Copy assets to dist
 * @return {object} stream
 */
gulp.task('assets:dist', function () {
  return gulp.src(config.app + '/assets/**/*')
    .pipe(gulp.dest(config.dist + '/assets'));
});

/**
 * Compile jade to dist
 * @return {object} stream
 */
gulp.task('jade:dist', function () {
  var assets = $.useref.assets()

  return gulp.src(config.app + '/**/*.jade')
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
    config.app + '/styles/**/*.styl',
    config.app + '/styles/**/*.css'
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
    .pipe(gulp.dest(config.dist + '/styles'));
});

/**
 * Compile coffee to dist
 * @return {object} stream
 */
gulp.task('coffee:dist', function () {
  var stream = gulp.src(config.app + '/scripts/**/*.coffee')
    .pipe($.coffee({
      bare: true
    }))
    .pipe($.concat("main.min.js"))
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe($.sourcemaps.init())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(config.dist + '/scripts'))
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

gulp.task('usemin:dist', function () {
  gulp.src(config.dist + '/index.html')
    .pipe($.usemin({
      css: [$.minifyCss(), 'concat'],
      js: [$.uglify(), $.rev()]
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['clean'], function () {

  gulp.start([
    'assets:dist',
    'imagemin:dist',
    'wiredep',
    'jade:dist',
    // 'usemin:dist',
    'styles:dist',
    'coffee:dist'
  ]);

});

gulp.task('default', ['build']);