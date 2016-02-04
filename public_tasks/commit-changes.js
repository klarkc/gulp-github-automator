'use strict';

var gulp = require('gulp');
var git = require('gulp-git');

module.exports = function () {
    return gulp.src('.')
        .pipe(git.add())
        .pipe(git.commit('[Prerelease] Bumped version number'));
};
