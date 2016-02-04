'use strict';

var git = require('gulp-git');
var argv = require('yargs').argv;

module.exports = [['checkout-develop'], function (done) {
    if (!argv.b) {
        throw new Error('You must set a branch with -b argument');
    }

    git.merge(argv.b, {
        args: '--no-ff'
    }, done);
}];
