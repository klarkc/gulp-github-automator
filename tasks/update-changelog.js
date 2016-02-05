"use strict";

var gulp = require("gulp");
var changelog = require("gulp-conventional-changelog");
var path = require("path");
var $ = require("../util.js");

module.exports = function () {
  var file = path.resolve($.conf.appDir, "./CHANGELOG.md");
  var src;

  if (path.accessSync(file)) {
    // If file exists
    src = gulp.src(file, {
      buffer: false
    });
    return src
      .pipe(changelog({
        preset: $.conf.preset
      }))
      .pipe(gulp.dest($.conf.appDir));
  } else {
    // If file do not exists
    src = gulp.src(file, {
      buffer: false,
      read: false
    });
    return src
      .pipe(changelog({
        preset: $.conf.preset,
        releaseCount: 0
      }))
      .pipe(gulp.dest($.conf.appDir));
  }
};
