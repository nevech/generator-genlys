var browserSync = require('./.genlys/browser-sync');
var gulp = require('gulp');
var del = require('del');
var gulpsync = require('gulp-sync')(gulp);
var modRewrite  = require('connect-modrewrite');

var config = require('./.genlys/config');

// load gulp plugins
var $ = require('gulp-load-plugins')(config.optionLoadPlugins);

// require all task from gulp-tasks dir
require('require-dir')('./.genlys/gulp-tasks');

// apply gulp-plumber for all tasks
var _gulpsrc = gulp.src;
gulp.src = function() {
  return _gulpsrc.apply(gulp, arguments)
    .pipe($.plumber());
};

gulp.task('clean:serve', function (cb) {
  del(config.destDir, cb);
});

var serveTasks = [
  'assets',
  'fonts',
  'images',
  'templates',
  'styles',
  'scripts',
  'ngConfig'
];

gulp.task('serve', gulpsync.sync(['clean:serve', serveTasks]), function () {
  browserSync.init({
    notify: false,
    port: config.port,
    server: {
      baseDir: ['.tmp'],
      routes: {
        '/bower_components': 'bower_components'
      },
      middleware: [
        modRewrite([
          '!\\.\\w+\?.*$ /index.html [L]'
        ])
      ]
    }
  });

  gulp.start([
    'styles:watch',
    'templates:watch',
    'scripts:watch',
    'images:watch',
    'fonts:watch',
    'assets:watch'
  ]);

  gulp.watch('bower.json', ['wiredep', 'fonts', browserSync.reload]);
});


gulp.task('serve:dist', function () {
  browserSync.init({
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