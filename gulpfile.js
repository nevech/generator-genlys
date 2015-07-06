var browserSync = require('browser-sync');
var gulp = require('gulp');
var del = require('del');
var gulpsync = require('gulp-sync')(gulp);

var reload = browserSync.reload;
var config = require('./configs/');

// load gulp plugins
var $ = require('gulp-load-plugins')(config.optionLoadPlugins);

// require all task from gulp-tasks dir
require('require-dir')('./gulp-tasks');

// apply gulp-plumber for all streams
var _gulpsrc = gulp.src;
gulp.src = function() {
  return _gulpsrc.apply(gulp, arguments)
    .pipe($.plumber());
};

gulp.task('clean', function (cb) {
  del([config.buildDir, config.destDir], cb);
});

var serveTasks = [
  'assets',
  'bowerFonts',
  'images',
  'templates',
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
    'templates:watch',
    'scripts:watch',
    'images:watch',
    'assets:watch'
  ]);

  gulp.watch('bower.json', ['wiredep', 'bowerFonts', reload]);
});

gulp.task('compile:dist', ['templates', 'scripts', 'styles', 'assets:dist'], function () {
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