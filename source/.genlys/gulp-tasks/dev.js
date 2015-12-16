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

gulp.task('clean:tmp', function (done) {
  del(config.destDir).then(function () {
    done();
  });
});

gulp.task('dev', gulpsync.sync(['clean:tmp', serveTasks]), function () {
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

  var tasks = [
    'styles:watch',
    'templates:watch',
    'scripts:watch',
    'images:watch',
    'fonts:watch',
    'assets:watch'
  ];

  if (config.fsdk) {
    tasks.push('sdk:watch');
  }

  gulp.start(tasks);

  gulp.watch('bower.json', ['wiredep', 'fonts', browserSync.reload]);
});

gulp.task('serve', function () {
  console.log('Task `serve` is deprecated and will be removed in v1.0.0. Use `dev` task.');
  gulp.start('dev');
});