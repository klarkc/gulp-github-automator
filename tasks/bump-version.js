"use strict";

var gulp = require("gulp");
var argv = require("yargs").argv;
var gutil = require("gulp-util");
var bump = require("gulp-bump");
var path = require("path");
var fs = require("fs");
var $ = require("../util.js");

module.exports = function (error, bumpType) {
    var bumpParams = {
      // Set version type to -t option or version (or if empty, patch)
      type: argv.t || bumpType || "patch"
    };

    // Set version from command line
    if (argv.v) {
      bumpParams.version = argv.v;
    }

    var files = $.conf.versionFiles.reduce(function(files, file){
      var filePath = path.resolve($.conf.appDir, file);
      if(fs.statSync(filePath)) {
        files.push(filePath);
      }
      return files;
    }, []);
    return gulp.src(files)
      .pipe(bump(bumpParams).on("error", gutil.log))
      .pipe(gulp.dest($.conf.appDir));
};
