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

var _gulpsrc = gulp.src;
gulp.src = function() {
  return _gulpsrc.apply(gulp, arguments)
    .pipe($.plumber());
};

function scriptsTransform () {
  var filterCoffee = $.filter('**/*.coffee');

  return lazypipe()
    .pipe(function setFilterCoffee() {
      return filterCoffee;
    })
    .pipe(function compileCoffee() {
      return $.coffee({
        bare: true
      });
    })
    .pipe(filterCoffee.restore)
    .pipe($.ngAnnotate)();
}

function stylesTransform () {
  var filterStyl = $.filter('**/*.styl');

  return lazypipe()
    .pipe(function setFilterStylus() {
      return filterStyl;
    })
    .pipe($.stylus)
    .pipe(filterStyl.restore)
    .pipe(function autoPrefixer() {
      return $.autoprefixer(config.autoprefixer);
    })();
}

gulp.task('clean', function (cb) {
  del([config.distDir, config.destDir], cb);
});

gulp.task('ngConfig', function () {
  var src = config.getPathToNgConfig();

  return gulp.src(src)
    .pipe($.ngConfig(config.ngApp, {
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
  return gulp.src(config.paths.images)
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(config.destDir + '/images'));
});

gulp.task('wiredep', function () {
  return gulp.src('app/index.jade')
    .pipe(wiredep({
      directory: './bower_components',
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('scripts', function () {
  return gulp.src(config.paths.js)
    .pipe(scriptsTransform())
    .pipe(gulp.dest(config.destDir + '/scripts'));
});

gulp.task('scripts:watch', function () {
  return gulp.src(config.paths.js)
    .pipe($.watch(config.paths.js, {verbose: true}))
    .pipe(scriptsTransform())
    .pipe(gulp.dest(config.destDir + '/scripts'))
    .pipe(reload({stream: true}));
});

gulp.task('styles', function () {
  return gulp.src(config.paths.styles)
    .pipe(stylesTransform())
    .pipe(gulp.dest(config.destDir + '/styles'));
});

gulp.task('styles:watch', function () {
  return gulp.src(config.paths.styles)
    .pipe($.watch(config.paths.styles, {verbose: true}))
    .pipe(stylesTransform())
    .pipe(gulp.dest(config.destDir + '/styles'))
    .pipe(reload({stream: true}));
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

  gulp.start(['styles:watch', 'jade:watch', 'scripts:watch']);

  gulp.watch(config.paths.images, ['imagemin', reload]);
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