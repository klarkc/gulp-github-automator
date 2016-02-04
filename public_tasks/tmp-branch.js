'use strict';

var git = require('gulp-git');

module.exports = function(done) {
  git.checkout('release', {
    args: '-b'
  }, done);
};
