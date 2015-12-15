var gulp = require('gulp');
var del = require('del');
var gulpsync = require('gulp-sync')(gulp);
var modRewrite  = require('connect-modrewrite');

var browserSync = require('../browser-sync');
var config = require('../config');

var serveTasks = [
  'assets',
  'fonts',
  'images',
  'templates',
  'styles',
  'scripts',
  'ngConfig'
];

gulp.task('clean:dev', function (cb) {
  del(config.destDir, cb);
});

gulp.task('dev', gulpsync.sync(['clean:dev', serveTasks]), function () {
  browserSync.init({
    notify: false,
    port: config.port,
    server: {
      baseDir: [config.destDir],
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

gulp.task('serve', function () {
  console.log('Task `serve` is deprecated and will be removed in v1.0.0. Use `dev` task.');
  gulp.start('dev');
});