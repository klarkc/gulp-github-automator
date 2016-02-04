"use strict";

var argv = require("yargs").argv;
var runSequence = require("run-sequence");
var gutil = require("gulp-util");
var $ = require("../utils.js");

var mergeIntoRelease = function (done) {
  $.mergeInto(argv.r, done);
};

var mergeIntoMaster = function (done) {
  $.mergeInto("master", done);
};

var mergeIntoDevelop = function (done) {
  $.mergeInto("develop", done);
};

var pushToMaster = function (next) {
  $.askPushTo("master", "origin", next);
};

var pushToRelease = function (next) {
  $.askPushTo(argv.r, "origin", next);
};

var pushToDevelop = function (next) {
  $.askPushTo("develop", "origin", next);
};

var commitChanges = $.commitChangesStream();

module.exports = [[$.conf.testTask], function (done) {
  var checkError = function (error) {
    if (error) {
      throw error;
    } else {
      gutil.log("HOTFIX RELEASE FINISHED SUCCESSFULLY");
      $.askDeleteBranch(argv.b, done);
    }
  };

  if (argv.r) {
    runSequence(
      "bump-version",
      "update-changelog",
      commitChanges,
      mergeIntoMaster,
      pushToMaster,
      mergeIntoRelease,
      pushToRelease,
      mergeIntoDevelop,
      pushToDevelop,
      "create-new-tag",
      "github-release",
      checkError
    );
  } else {
    runSequence(
      "bump-version",
      "update-changelog",
      commitChanges,
      mergeIntoMaster,
      pushToMaster,
      mergeIntoDevelop,
      pushToDevelop,
      "create-new-tag",
      "github-release",
      checkError
    );
  }

}];
