'use strict';

var releaser = require('conventional-github-releaser');

module.exports = [['checkout-master'], function (done) {
    releaser({
        type: "oauth",
        token: process.env.GITHUB_OAUTH // change this to your own GitHub token or use an environment variable
    }, {
        preset: 'angular' // Or to any other commit message convention you use.
    }, done);
}];

