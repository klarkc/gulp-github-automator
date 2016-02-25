"use strict";
var fs = require("fs");
var resolve = require("path").resolve;
var rmdir = require("rimraf");
var mockery = require("mockery");
var git = require("gulp-git");
var gulp = require("gulp");
var runSequence = require("async").series;

var sandboxDir = process.env.SANDBOX_DIR;

var mochaCwd = process.cwd();

var gitOptions = {
  quiet: true
};

function writeFiles() {
  fs.writeFileSync("package.json", "{\n\"version\": \"1.2.3\"\n}");
}

function prepareGit(done) {

  var initGit = function (next) {
    git.init(gitOptions, next);
  };

  var addAndCommit = function (next) {
    var stream = gulp.src("*")
      .pipe(git.add(gitOptions))
      .pipe(git.commit("first commit", gitOptions));

    stream.on('finish', next);
  };

  var testBranch = function (next) {
    git.branch('test', gitOptions, next);
  };

  var configUserMail = function (next) {
    git.exec({
      args: "config user.mail 'test@example.com'",
      quiet: true
    }, next);
  };

  var configUserName = function (next) {
    git.exec({
      args: "config user.name 'test'",
      quiet: true
    }, next);
  };

  runSequence([
    initGit,
    configUserMail,
    configUserName,
    addAndCommit,
    testBranch,
    function(){
      done();
    }
  ]);
}

before(function () {
  if (!sandboxDir) {
    sandboxDir = process.env.SANDBOX_DIR = resolve(__dirname, "test_sandbox");
  }

  mockery.enable({
    warnOnUnregistered: false,
    warnOnReplace: false
  });

  var mockArgs = {
    argv: {
      b: 'test'
    }
  };
  mockery.registerMock('yargs', mockArgs);
});

beforeEach(function (done) {
  fs.mkdirSync(sandboxDir);
  process.chdir(resolve(sandboxDir));
  writeFiles();
  prepareGit(done);
});

afterEach(function (done) {
  process.chdir(mochaCwd);
  rmdir(resolve(sandboxDir), done);
});

after(function (done) {
  mockery.disable();

  // If something gone wrong we force-removal of the test directory, we don't want this directory messing up future tests.
  try {
    rmdir(resolve(sandboxDir), done);
    throw new Error("Test sandbox directory has been forced deleted");
  } catch (err) {
    done();
  }
});
