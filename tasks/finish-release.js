'use strict';
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var $ = require('../util.js');

var mergeIntoMaster = function (next) {
  $.mergeInto('master', next);
};

var mergeIntoDevelop = function (next) {
  $.mergeInto('develop', next);
};

module.exports = [ /*['test'],*/ function (done) {
  runSequence(
    mergeIntoMaster,
    mergeIntoDevelop,
    'push-new-tag',
    'push-new-release',
    function (error) {
      if (error) {
        throw error;
      } else {
        gutil.log('RELEASE FINISHED SUCCESSFULLY');
        $.askDeleteBranch('release', done);
      }
    });
}];
