var gulp = require('gulp');
var browserSync = require('browser-sync');
var del = require('del');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  scope: ['dependencies', 'devDependencies']
});

var reload = browserSync.reload;

var autoprefixerConfig = {
  browsers: ['> 0.5%', 'ie 8', 'Opera 11.5']
};

var srcStyles = [
  './app/styles/**/*.styl',
  './app/styles/**/*.css'
];

/**
 * Clean folder dist and tmp
 * @return {object} stream
 */
gulp.task('clean', function (cb) {
  del([
    './dist',
    './tmp'
  ], cb);
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
 * Copy assets to tmp
 * @return {object} stream
 */
gulp.task('assets:serve', function () {
  return gulp.src('./app/assets/**/*')
    .pipe(gulp.dest('./tmp/assets'));
});

/**
 * Copy extra files to dist
 * @return {object} stream
 */
gulp.task('extras:dist', function () {
  gulp.src([
    'app/*.*',
    '!app/*.jade'
  ], {
    dot: true
  }).pipe(gulp.dest('./dist'));
});

/**
 * Copy extra files to tmp
 * @return {object} stream
 */
gulp.task('extras:serve', function () {
  gulp.src([
    'app/*.*',
    '!app/*.jade'
  ], {
    dot: true
  }).pipe(gulp.dest('./tmp'));
});

/**
 * Compile jade to dist
 * @return {object} stream
 */
var wiredep = require('wiredep').stream;

gulp.task('jade:dist', function () {
  var assets = $.useref.assets()

  return gulp.src('./app/**/*.jade')
    .pipe($.jade({
      pretty: true
    }))
    .on('error', $.util.log)
    .pipe(wiredep({
      optional: 'configuration',
      goes: 'here'
    }))
    .pipe(assets)
    .pipe($.if('*.js', $.uglify(), $.rev() ))
    .pipe($.if('*.css', $.minifyCss()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.minifyHtml({
      empty: true,
      spare: true
    }))
    .pipe(gulp.dest('./dist'));
});

/**
 * Compile jade to tmp
 * @return {object} stream
 */
gulp.task('jade:serve', function () {
  var assets = $.useref.assets()

  return gulp.src('./app/**/*.jade')
    .pipe($.jade({
      pretty: true
    }))
    .on('error', $.util.log)
    .pipe(gulp.dest('./tmp'));
});

/**
 * Compile stylus to dist
 * @return {object} stream
 */
gulp.task('styles:dist', function () {
  var filterStyl = $.filter('**/*.styl');

  return gulp.src(srcStyles)
    .pipe(filterStyl)
    .pipe($.stylus({
      compress: true
    }))
    .pipe(filterStyl.restore())
    .pipe($.concat("main.min.css"))
    .pipe($.autoprefixer(autoprefixerConfig))
    .pipe(gulp.dest('./dist/styles'));
});

/**
 * Compile stylus to tmp
 * @return {object} stream
 */
gulp.task('styles:serve', function () {
  var filterStyl = $.filter('**/*.styl');

  return gulp.src(srcStyles)
    .pipe(filterStyl)
    .pipe($.stylus())
    .on('error', function (err) {
      $.util.log(err.message);
      this.emit('end');
    })
    .pipe(filterStyl.restore())
    .pipe($.autoprefixer(autoprefixerConfig))
    .pipe(gulp.dest('./tmp/styles'))
    .pipe(reload({stream: true}));
});

/**
 * Compile coffee to dist
 * @return {object} stream
 */
gulp.task('scripts:dist', function () {
  return gulp.src('./app/scripts/**/*.coffee')
    .pipe($.coffee({
      bare: true
    }))
    .pipe($.ngAnnotate())
    .pipe($.concat("main.min.js"))
    .pipe($.uglify().on('error', $.util.log))
    .pipe($.sourcemaps.init())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./dist/scripts'));
});

/**
 * Compile coffee to tmp
 * @return {object} stream
 */
gulp.task('scripts:serve', function () {
  return gulp.src('./app/scripts/**/*.coffee')
    .pipe($.coffee({
      bare: true
    }))
    .pipe(gulp.dest('./tmp/scripts'));
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
    .pipe(gulp.dest('./dist/assets/images'));
});

/**
 * Imagemin
 * @return {stream}
 */
gulp.task('imagemin:serve', function () {
  return gulp.src('app/assets/images/**/*.{jpg,.png,.jpeg,.svg}')
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./tmp/assets/images'));
});

gulp.task('build', ['clean'], function () {

  gulp.start([
    'assets:dist',
    'extras:dist',
    'imagemin:dist',
    'jade:dist',
    'styles:dist',
    'scripts:dist'
  ]);

});

gulp.task('serve', ['clean'], function () {
  gulp.start([
    'assets:serve',
    'extras:serve',
    'imagemin:serve',
    'jade:serve',
    'styles:serve',
    'scripts:serve'
  ]);

  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['tmp'],
      routes: {
        '/bower_components': './app/bower_components'
      }
    }
  });

  gulp.watch('app/**/*.jade', ['jade:serve', reload]);
  gulp.watch('app/scripts/**/*.coffee', ['scripts:serve', reload]);
  gulp.watch('app/styles/**/*.styl', ['styles:serve']);
  gulp.watch('app/assets/**/*.*', ['assets:serve', 'imagemin:serve']);
  gulp.watch(['app/*.*', '!app/*.jade'], ['extras:serve']);

});

gulp.task('default', ['serve']);