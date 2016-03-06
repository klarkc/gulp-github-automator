"use strict";

var gulp = require("gulp");
var changelog = require("gulp-conventional-changelog");
var path = require("path");
var fs = require("fs");
var $ = require("../util.js");

module.exports = function () {
  var file = path.resolve($.conf.appDir, "./CHANGELOG.md");
  var src;

  try {
    // If file exists
    fs.statSync(file);
    src = gulp.src(file, {
      buffer: false
    });
    return src
      .pipe(changelog({
        preset: $.conf.preset
      }))
      .pipe(gulp.dest($.conf.appDir));
  } catch(err) {
    if(err.code !== "ENOENT") {
      throw err;
    }

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
