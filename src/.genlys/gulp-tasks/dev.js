'use strict';

let gulp = require('gulp');
let del = require('del');
let gulpsync = require('gulp-sync')(gulp);
let modRewrite  = require('connect-modrewrite');
let plumber = require('gulp-plumber');

let browserSync = require('../browser-sync');
let config = require('../config');

let serveTasks = [
  'assets',
  'fonts',
  'images',
  'templates',
  'templateCache',
  'styles',
  'scripts',
  'ngConfig'
];

gulp.task('clean:tmp', function (done) {
  del(config.destDir).then(function () {
    done();
  });
});

gulp.task('apply-plumber', function (done) {
  let gulpsrc = gulp.src;

  gulp.src = function() {
    return gulpsrc.apply(gulp, arguments).pipe(plumber());
  };

  done();
});

gulp.task('dev', gulpsync.sync(['apply-plumber', 'clean:tmp', serveTasks]), function () {
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

  let tasks = [
    'styles:watch',
    'templates:watch',
    'templateCache:watch',
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
