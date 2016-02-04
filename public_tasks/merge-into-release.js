'use strict';

var git = require('gulp-git');
var argv = require('yargs').argv;
var version = require('./package-version.js');

module.exports = function (done) {
    if (!argv.r) {
        throw new Error('You must set a release branch with -r argument');
    }

    git.checkout('release-' + version(), function () {
        git.merge(argv.r, {
            args: '--no-ff'
        }, done);
    });
};
