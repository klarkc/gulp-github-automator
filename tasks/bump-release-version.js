'use strict';

var runSequence = require('run-sequence');

module.exports = function (done) {
    runSequence('tmp-branch', 'bump-version', done);
};

