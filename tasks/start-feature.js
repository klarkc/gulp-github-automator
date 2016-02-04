"use strict";

var git = require("gulp-git");
var runSequence = require("run-sequence");
var argv = require("yargs").argv;
var $ = require("../util.js");

var checkoutDevelop = function (next) {
  git.checkout("develop", next);
};

var createBranch = function (next) {
  git.checkout("feature-" + argv.n, {
    args: "-b"
  }, next);
};

var pushToOrigin = function (next) {
  $.askPushTo("origin", "feature-" + argv.n, next);
};

module.exports = function (done) {
  if (!argv.n) {
    throw new Error("You must set a issue or feature name with -n argument");
  }

  runSequence(
    checkoutDevelop,
    createBranch,
    pushToOrigin,
    done
  );
};
