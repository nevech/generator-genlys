var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;
var gulp = require('gulp');
var del = require('del');
var gulpsync = require('gulp-sync')(gulp);
var lazypipe = require('lazypipe');

var reload = browserSync.reload;
var config = require('./configs/');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  scope: ['dependencies', 'devDependencies']
});

require('require-dir')('./gulp-tasks');

var _gulpsrc = gulp.src;
gulp.src = function() {
  return _gulpsrc.apply(gulp, arguments)
    .pipe($.plumber());
};

function imageminTransform (dest) {
  return lazypipe()
    .pipe(function imagemin() {
      return $.imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      });
    })();
}

function bowerFonts(dest) {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/public/fonts/**/*'))
    .pipe(gulp.dest(dest));
}

gulp.task('clean', function (cb) {
  del([config.buildDir, config.destDir], cb);
});

gulp.task('assets', function () {
  return gulp.src(config.paths.assets)
    .pipe(gulp.dest(config.destDir));
});

gulp.task('assets:watch', function () {
  return gulp.src(config.paths.assets)
    .pipe($.watch(config.paths.assets, {verbose: true}))
    .pipe(gulp.dest(config.destDir))
    .pipe(reload({stream: true}));
});

gulp.task('assets:dist', function () {
  return gulp.src(config.paths.assets)
    .pipe(gulp.dest(config.buildDir));
});

gulp.task('bowerFonts', function () {
  return bowerFonts(config.destDir + '/fonts');
});

gulp.task('bowerFonts:dist', function () {
  return bowerFonts(config.buildDir + '/fonts');
});

gulp.task('images', function () {
  return gulp.src(config.paths.images)
    .pipe(imageminTransform())
    .pipe(gulp.dest(config.destDir + '/images'));
});

gulp.task('images:watch', function () {
  return gulp.src(config.paths.images)
    .pipe($.watch(config.paths.images, {verbose: true}))
    .pipe(imageminTransform())
    .pipe(gulp.dest(config.destDir + '/images'))
    .pipe(reload({stream: true}));
});

gulp.task('images:dist', function () {
  return gulp.src(config.paths.images)
    .pipe(imageminTransform())
    .pipe(gulp.dest(config.buildDir + '/images'));
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
  return gulp.src(config.paths.jade)
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest(config.destDir));
});

gulp.task('jade:watch', function () {
  return gulp.src(config.paths.jade)
    .pipe($.watch(config.paths.jade, {verbose: true}))
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest(config.destDir))
    .pipe(reload({stream: true}));
});

var serveTasks = [
  'assets',
  'bowerFonts',
  'images',
  'jade',
  'styles',
  'scripts',
  'ngConfig'
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

  gulp.start([
    'styles:watch',
    'jade:watch',
    'scripts:watch',
    'images:watch',
    'assets:watch'
  ]);

  gulp.watch('bower.json', ['wiredep', 'bowerFonts', reload]);
});

gulp.task('compile:dist', ['jade', 'scripts', 'styles', 'assets:dist'], function () {
  var assets = $.useref.assets({searchPath: ['.', config.destDir]});

  return gulp.src(config.destDir + '/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify(), $.rev() ))
    .pipe($.if('*.css', $.minifyCss(), $.rev() ))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe($.if('*.html', $.minifyHtml({
      empty: true,
      spare: true
    })))
    .pipe(gulp.dest(config.buildDir));
});

gulp.task('build', ['clean'], function () {

  gulp.start([
    'bowerFonts:dist',
    'images:dist',
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