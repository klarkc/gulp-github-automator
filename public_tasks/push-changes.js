'use strict';

var git = require('gulp-git');
var version = require('./package-version.js');

module.exports = function (done) {
    git.push('origin', 'release-' + version(), {
        args: '-u'
    }, done);
};
