'use strict';

var runSequence = require('run-sequence');

module.exports = function (done) {
    runSequence(
        'release-branch',
        'changelog',
        'commit-changes',
        'push-changes',
        done
    );
};
