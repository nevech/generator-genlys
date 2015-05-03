var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;
var gulp = require('gulp');

var del = require('del');

var reload = browserSync.reload;

var env = process.env.NODE_ENV || 'development';
var appName = 'myApp';
var destDir = '.tmp';

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  scope: ['dependencies', 'devDependencies']
});

gulp.task('clean', function (cb) {
  del(['dist', '.tmp'], cb);
});

// Set env from arguments
gulp.task('set:env', function (cb) {
  var fs = require('fs'), args = require('yargs').argv;

  fs.readFile('app/config.json', {encoding: 'utf-8'}, function (err, data) {
    var config = JSON.parse(data);
    var envs = Object.keys(config);

    for (var i = 0, l = envs.length; i < l; i++) {
      if (args[envs[i]]) {
        env = envs[i];
        break;
      }
    }

    cb();
  });

});

gulp.task('ngConfig', function () {
  return gulp.src('app/config.json')
    .pipe($.ngConfig(appName, {
      createModule: false,
      environment: env
    }))
    .pipe(gulp.dest('.tmp/scripts/configs'))
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
  }).concat('app/assets/fonts/**/*'))
    .pipe(gulp.dest(destDir + '/assets/fonts'));
});

gulp.task('scripts', function () {
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
    .pipe(gulp.dest('.tmp/scripts'));
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
    .pipe(gulp.dest('.tmp/styles'));
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
    .pipe(gulp.dest('.tmp'));
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
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['clean', 'set:env'], function () {
  destDir = 'dist';

  gulp.start([
    'extras',
    'assets',
    'fonts',
    'ngConfig',
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

gulp.task('serve', ['clean', 'set:env'], function () {

  gulp.start([
    'extras',
    'assets',
    'fonts',
    'jade',
    'scripts',
    'ngConfig',
    'styles',
  ], function () {
  });

  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/*.jade', ['jade', reload]);
  gulp.watch('app/scripts/**/*.coffee', ['scripts', reload]);
  gulp.watch('app/styles/**/*.styl', ['styles', reload({stream: true})]);
  gulp.watch('app/config.json', ['ngConfig', reload()]);
  gulp.watch('app/config.json', ['ngConfig', reload()]);

  gulp.watch([
    'app/assets/**/*',
  ], ['assets', reload]);

  gulp.watch([
    'app/*.*',
    '!app/*.jade',
    '!app/config.json',
  ], ['extras', reload()]);

});

gulp.task('default', ['build']);