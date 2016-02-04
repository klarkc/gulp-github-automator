"use strict";

var gulp = require("gulp");
var changelog = require("gulp-conventional-changelog");
var path = require("path");
var $ = require("../util.js");

module.exports = function () {
    var src = gulp.src(path.resolve($.conf.appDir, "./CHANGELOG.md"), {
        buffer: false
    });
    return src
        .pipe(changelog({
            preset: $.conf.preset
        }))
        .pipe(gulp.dest($.conf.appDir));
};

