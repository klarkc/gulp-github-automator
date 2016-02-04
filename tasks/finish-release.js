'use strict';

var argv = require('yargs').argv;
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var git = require('gulp-git');
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
    'create-new-tag',
    'github-release',
    function (error) {
      if (error) {
        throw error;
      } else {
        gutil.log('RELEASE FINISHED SUCCESSFULLY');

        $.askContinue('Delete local and remote release branch? ', function () {
          // Delete local release branch
          git.branch(argv.b, {
            args: '-d'
          }, function () {
            // Delete remote release branch
            git.push('origin', argv.b, {
              args: '--delete'
            }, done);
          });
        });
      }
    });
}];
