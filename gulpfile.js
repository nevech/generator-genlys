var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;
var gulp = require('gulp');
var del = require('del');
var gulpsync = require('gulp-sync')(gulp);

var reload = browserSync.reload;
var config = require('./configs/gulpconfig.js');

console.log(config);

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  scope: ['dependencies', 'devDependencies']
});

var _gulpsrc = gulp.src;
gulp.src = function() {
  return _gulpsrc.apply(gulp, arguments)
    .pipe($.plumber());
};

gulp.task('clean', function (cb) {
  del([config.distDir, config.destDir], cb);
});

gulp.task('ngConfig', function () {
  var src = 'configs/ng_config/' + config.env + '.json';

  return gulp.src(src)
    .pipe($.ngConfig(config.ngAppName, {
      createModule: false,
    }))
    .pipe($.rename(function (path) {
      path.basename = 'config';
      path.extname = '.js';
    }))
    .pipe(gulp.dest(config.destDir + '/scripts/configs'))
});

gulp.task('assets', function () {
  return gulp.src([
    'app/public/**/*',
    '!app/public/images',
  ]).pipe(gulp.dest(config.destDir));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/public/fonts/**/*'))
    .pipe(gulp.dest(config.destDir + '/fonts'));
});

gulp.task('imagemin', function () {
  var src = 'app/public/images/**/*.{jpg,.png,.jpeg,.svg}';

  return gulp.src(src)
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(config.destDir + '/images'));
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
    .pipe(gulp.dest(config.destDir + '/scripts'));
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
    .pipe(gulp.dest(config.destDir + '/styles'));
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
    .pipe(gulp.dest(config.destDir));
});

gulp.task('compile:dist', ['jade', 'scripts', 'styles'], function () {
  var assets = $.useref.assets({searchPath: ['.', config.destDir]});

  return gulp.src(config.destDir + '/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify(), $.rev() ))
    .pipe($.if('*.css', $.minifyCss(), $.rev()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe($.minifyHtml({
      empty: true,
      spare: true
    }))
    .pipe(gulp.dest(config.distDir));
});

var serveTasks = [
  'assets',
  'fonts',
  'imagemin',
  'jade',
  'scripts',
  'ngConfig',
  'styles',
];

gulp.task('serve', gulpsync.sync(['clean', serveTasks]), function () {
  browserSync({
    notify: false,
    port: config.port,
    server: {
      baseDir: ['.tmp'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/**/*.jade', ['jade', reload]);
  gulp.watch('app/scripts/**/*.coffee', ['scripts', reload]);
  gulp.watch('app/styles/**/*.styl', ['styles', reload]);
  gulp.watch('app/public/images', ['imagemin', reload]);
  gulp.watch('bower.json', ['wiredep', 'fonts', reload]);

  gulp.watch([
    'app/public/**/*',
    '!app/public/images',
  ], ['assets', reload]);

});

gulp.task('build', ['clean'], function () {

  gulp.start([
    'assets',
    'fonts',
    'imagemin',
    'ngConfig',
    'compile:dist'
  ], function () {
    del('.tmp');
  });

});

gulp.task('serve:dist', function () {
  browserSync({
    notify: false,
    port: config.port,
    server: {
      baseDir: ['dist'],
    }
  });
});

gulp.task('default', function () {
  gulp.src('package.json')
    .pipe($.prompt.prompt({
      type: 'list',
      name: 'task',
      message: 'What do you want to do?',
      choices: [
        'serve',
        'build'
      ]
    }, function (answer) {
      gulp.start(answer.task);
    }));
});