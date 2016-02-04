'use strict';

var gulp = require('gulp');
var argv = require('yargs').argv;
var gutil = require('gulp-util');
var bump = require('gulp-bump');

module.exports = [['calculate-version'], function (error, bump_type) {
    var bump_params = {
        // Set version type to -t option or version (or if empty, patch)
        type: argv.t || bump_type || 'patch'
    };

    // Set version from command line
    if (argv.v) {
        bump_params.version = argv.v;
    }

    return gulp.src(['package.json'])
        .pipe(bump(bump_params).on('error', gutil.log))
        .pipe(gulp.dest('.'));
}];

