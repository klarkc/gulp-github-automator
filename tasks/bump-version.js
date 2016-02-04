'use strict';

var gulp = require('gulp');
var argv = require('yargs').argv;
var gutil = require('gulp-util');
var bump = require('gulp-bump');
var path = require('path');
var fs = require('fs');
var $ = require('../util.js');

module.exports = function (error, bump_type) {
    var bump_params = {
      // Set version type to -t option or version (or if empty, patch)
      type: argv.t || bump_type || 'patch'
    };

    // Set version from command line
    if (argv.v) {
      bump_params.version = argv.v;
    }

    var files = $.conf.versionFiles.reduce(function(files, file){
      var filePath = path.resolve($.conf.appDir, file);
      if(fs.accessSync(filePath)) {
        files.push(filePath);
      }
      return files;
    }, []);

    return gulp.src(files)
      .pipe(bump(bump_params).on('error', gutil.log))
      .pipe(gulp.dest($.conf.appDir));
};
