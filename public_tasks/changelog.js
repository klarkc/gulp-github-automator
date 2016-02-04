'use strict';

var gulp = require('gulp');
var changelog = require('gulp-conventional-changelog');

module.exports = function () {
    var src = gulp.src('CHANGELOG.md', {
        buffer: false
    });
    return src
        .pipe(changelog({
            preset: 'angular' // Or to any other commit message convention you use.
        }))
        .pipe(gulp.dest('./'));
};

