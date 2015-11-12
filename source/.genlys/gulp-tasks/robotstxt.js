var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require("gulp-rename");
var fs = require('fs');
var config = require('../config');

var pathToFiles = 'configs/robotstxt/';
var defaultFile = pathToFiles + 'development.txt';

function getFile (name, callback) {
  var path = pathToFiles + name + '.txt';

  fs.stat(path, function (err, stats) {
    if (err) return callback(err);

    callback(null, stats, path);
  });
}

function getPathRobotstxt (callback) {
  getFile(config.env, function (err, stats, path) {
    if (err || !stats.isFile()) {
      path = defaultFile;
    }

    callback(path);
  });
}

gulp.task('robotstxt', function (callback) {

  getPathRobotstxt(function (path) {

    gulp.src(path)
      .pipe(rename(function (file) {
        file.basename = "robots";
      }))
      .pipe(gulp.dest(config.getReleasePath()))
      .on('end', function () {
        gutil.log('Used ', gutil.colors.green(path), 'for robots.txt');
        callback();
      });

  });

});