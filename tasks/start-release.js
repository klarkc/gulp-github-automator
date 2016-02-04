'use strict';

var git = require('gulp-git');
var runSequence = require('run-sequence');
var $ = require('../util.js');

var renameBranch = function (next) {
  git.branch('release-' + $.packageVersion(), {
    args: '-m'
  }, next);
};

var pushToOrigin = function (next) {
  git.push('origin', 'release-' + $.packageVersion(), {
    args: '-u'
  }, next);
};

var commitChanges = $.commitChangesStream();

module.exports = function (done) {
  $.createTmpBranch(function () {
    runSequence(
      'bump-version',
      renameBranch,
      'changelog',
      commitChanges,
      pushToOrigin,
      done
    );
  });
};
