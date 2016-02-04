'use strict';

var git = require('gulp-git');
var argv = require('yargs').argv;

module.exports = [['checkout-master'], function (done) {
    if (!argv.b) {
        throw new Error('Branch não informado, informe-o usando o argumento -b');
    }

    git.merge(argv.b, {
        args: '--no-ff'
    }, done);
}];
