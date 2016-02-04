"use strict";

var git = require("gulp-git");
var runSequence = require("run-sequence");
var $ = require("../util.js");

var renameBranch = function (next) {
  git.branch("release-" + $.packageVersion(), {
    args: "-m"
  }, next);
};

var pushToOrigin = function (next) {
  $.askPushTo("origin", "release-" + $.packageVersion(), next);
};

var commitChanges = $.commitChangesStream();

module.exports = function (done) {
  $.createTmpBranch(function () {
    runSequence(
      "bump-version",
      renameBranch,
      "update-changelog",
      commitChanges,
      pushToOrigin,
      done
    );
  });
};
