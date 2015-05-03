var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;
var gulp = require('gulp');
var args = require('yargs').argv;
var del = require('del');

var reload = browserSync.reload;

var env = process.env.NODE_ENV || 'development';
var isProduction = false;
var destDir = '.tmp';
var appName = 'myApp';

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  scope: ['dependencies', 'devDependencies']
});

function setENV () {
  // Set env from args
  if (args.production) {
    isProduction = true;
    env = 'production';
  }
}

gulp.task('clean', function (cb) {
  del(['dist', '.tmp'], cb);
});

gulp.task('assets', function () {
  return gulp.src('app/assets/**/*')
    .pipe(gulp.dest(destDir + '/assets'));
});

gulp.task('extras', function () {
  gulp.src([
    'app/*.*',
    '!app/*.jade',
    '!app/config.json',
  ], {
    dot: true
  }).pipe(gulp.dest(destDir));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/assets/fonts//**/*'))
    .pipe(gulp.dest(destDir + '/assets/fonts'));
});

gulp.task('config', function () {
  return gulp.src('app/config.json')
    .pipe($.ngConfig(appName + '.config', {
      environment: env
    }))
    .pipe(gulp.dest('./.tmp/scripts/configs'))
});

gulp.task('scripts', ['config'], function () {
  var filterCoffee = $.filter('**/*.coffee');

  return gulp.src([
      'app/scripts/**/*.coffee',
      'app/scripts/**/*.js'
    ])
    .pipe(filterCoffee)
    .pipe($.coffee({
      bare: true
    }))
    .pipe(filterCoffee.restore())
    .pipe($.ngAnnotate())
    .pipe($.if(isProduction, $.uglify().on('error', $.util.log)))
    .pipe(gulp.dest('./.tmp/scripts'));
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
    .pipe(gulp.dest('./.tmp/styles'));
});

gulp.task('wiredep', function () {
  return gulp.src('app/index.jade')
    .pipe(wiredep({
      directory: './bower_components',
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('jade', ['wiredep'], function () {
  return gulp.src('app/**/*.jade')
    .pipe($.jade({
      pretty: true
    }))
    .on('error', $.util.log)
    .pipe(gulp.dest('./.tmp'));
});

gulp.task('compile', ['jade', 'scripts', 'styles'], function () {
  var assets = $.useref.assets({searchPath: ['.', '.tmp']});

  return gulp.src('.tmp/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify(), $.rev() ))
    .pipe($.if('*.css', $.minifyCss(), $.rev()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.minifyHtml({
      empty: true,
      spare: true
    }))
    .pipe($.revReplace())
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['clean'], function () {
  setENV();
  destDir = 'dist';

  gulp.start([
    'assets',
    'extras',
    'compile'
  ], function () {
    del('.tmp');
  });

});

gulp.task('serve:dist', function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });
});

gulp.task('serve', ['clean'], function () {
  setENV();

  gulp.start([
    'assets',
    'extras',
    'jade',
    'scripts',
    'styles',
  ], function () {

  });

});

gulp.task('default', ['build']);