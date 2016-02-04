'use strict';

var git = require('gulp-git');
var pkgVersion = require('./package-version.js');

module.exports = [['checkout-master'], function (done) {
    var version = pkgVersion();
    git.tag(version, 'Created Tag for version: ' + version, function (error) {
        if (error) {
            return done(error);
        }
        git.push('origin', 'master', {
            args: '--tags'
        }, done);
    });
}];
