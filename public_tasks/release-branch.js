'use strict';

var git = require('gulp-git');
var version = require('./package-version.js');

module.exports = [['bump-release-version'], function (done) {
    // Rename current branch to package version
    git.branch('release-' + version(), {
        args: '-m'
    }, done);
}];
