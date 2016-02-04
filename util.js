'use strict';

var gulp = require('gulp');
var git = require('gulp-git');
var fs = require('fs');
var argv = require('yargs').argv;
var rl = require('readline');
var path = require('path');
var version = require('conventional-recommended-bump');
var $ = module.export;

$.conf = {
  token: undefined,
  preset: 'angular',
  testTask: undefined,
  appDir: path.dirname(require.main.filename),
  versionFiles: [
    'package.js',
    'bower.json'
  ]
};

$.createTmpBranch = function (done) {
  var name = 'tmp-' + Math.floor(Math.random() * 10000);
  git.checkout(name, {
    args: '-b'
  }, function () {
    done(name);
  });
};

$.packageVersion = function () {
  // We parse the json file instead of using require because require caches
  // multiple calls so the version number won't be updated
  return JSON.parse(fs.readFileSync(path.resolve($.conf.appDir, './package.json'), 'utf8')).version;
};

$.commitChangesStream = function () {
  return gulp.src($.conf.appDir)
    .pipe(git.add())
    .pipe(git.commit('[Prerelease] Bumped version number'));
};

$.mergeInto = function (branch, done) {
  if (!argv.b) {
    throw new Error('You must set a branch with -b argument');
  }

  git.checkout(branch, function () {
    git.merge(argv.b, {
      args: '--no-ff'
    }, done);
  });
};

$.calculateVersion = function (done) {
  version({
    preset: $.conf.preset
  }, done);
};

$.askContinue = function (question, keepGoing) {
  rl.question(question + ' (Default to Yes): ', function (answer) {
    if (!answer.match(/not|no|n/i)) {
      keepGoing();
    }
  });
};

$.askDeleteBranch = function (branch, done) {
  $.askContinue('Want to delete local and remote ' + branch + ' branch? ', function () {
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
};

$.askPushTo = function (local, remote, done) {
  $.askContinue('Want to push the local ' + branch + ' branch to ' + remote + ' repository?', function () {
    git.push(remote, local, {
      args: '-u'
    }, done);
  });
};
