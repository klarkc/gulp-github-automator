"use strict";

var git = require("gulp-git");
var gutil = require("gulp-utils");
var runSequence = require("run-sequence");
var $ = require("../util.js");

var developBranch = function (next) {
  $.askContinue("We gonna create the develop branch, if this branch already exists the branch will be reset to HEAD. Continue?", function () {
    git.checkout("develop", {
      args: "-B"
    }, next);
  }, true);
};

var afterInstructions = function(next){
  gutil.info("We created a release branch, please review the release branch and if it's ok, execute: $ gulp finish-release");
  next();
};

module.exports = function (done) {
  runSequence(
    developBranch,
    "start-release",
    afterInstructions,
    done
  );
};
