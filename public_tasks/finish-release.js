'use strict';

var argv = require('yargs').argv;
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var git = require('gulp-git');

module.exports = [/*['test'],*/ function (done) {
    runSequence(
        'merge-into-master',
        'merge-into-develop',
        'create-new-tag',
        'github-release',
        function (error) {
            if (error) {
                throw error;
            } else {
                gutil.log('RELEASE FINISHED SUCCESSFULLY');
                // Delete local release branch
                git.branch(argv.b, {
                    args: '-d'
                }, function () {
                    // Delete remote release branch
                    git.push('origin', argv.b, {
                        args: '--delete'
                    }, done);
                });
            }
        });
}];
