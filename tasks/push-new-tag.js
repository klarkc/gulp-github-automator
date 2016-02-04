'use strict';

var git = require('gulp-git');
var $ = require('../utils.js');

var createAndPush = function (done) {
  var version = $.packageVersion();
  git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return done(error);
    }
    git.push('origin', 'master', {
      args: '--tags'
    }, done);
  });
};

module.exports = function (done) {
  git.checkout('master', function () {
    createAndPush(done);
  });
};
