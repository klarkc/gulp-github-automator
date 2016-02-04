'use strict';

var gulp = require('gulp');
var git = require('gulp-git');
var fs = require('fs');
var argv = require('yargs').argv;

var $ = module.export;

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
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};

$.commitChangesStream = function () {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('[Prerelease] Bumped version number'));
};

$.mergeInto = function(branch, done) {
  if (!argv.b) {
        throw new Error('You must set a branch with -b argument');
  }

  git.checkout(branch, function(){
    git.merge(argv.b, {
        args: '--no-ff'
    }, done);
  });
};
