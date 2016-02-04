'use strict';

var version = require('conventional-recommended-bump');

module.exports = function (done) {
    version({
        preset: 'angular'
    }, done);
};

