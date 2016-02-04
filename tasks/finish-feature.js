'use strict';

var argv = require('yargs').argv;
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var git = require('gulp-git');
var $ = require('../util.js');

var mergeIntoDevelop = function (done) {
  $.mergeInto('develop', done);
};

module.exports = [[$.conf.testTask], function (done) {
  var checkError = function (error) {
    if (error) {
      throw error;
    } else {
      gutil.log('FEATURE MERGED SUCCESSFULLY');
      $.askDeleteBranch(argv.b, done);
    }
  };
  runSequence(
    mergeIntoDevelop,
    checkError
  );
}];
