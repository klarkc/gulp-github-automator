"use strict";
var fs = require("fs");
var resolve = require("path").resolve;
var rmdir = require("rimraf");
var mockery = require("mockery");
var git = require("gulp-git");
var gulp = require("gulp");
var runSequence = require("async").series;

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

    stream.on('end', next);
  };

  var testBranch = function (next) {
    git.branch('test', next);
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
    testBranch
  ], function(err, result){
    if(err) {
      throw err;
    }
    done();
  });
}

function createSandboxDir (dir) {
  var loop = function(count) {
    // Try to read the directory
    try {
      fs.lstatSync(dir + "-" + count);
      // If no error (so directory exists), keep going and counting
      loop(++count);
    } catch(err) {
      // Path do not exist, we can create him now
      var newDir = resolve(dir + "-" + count);
      fs.mkdirSync(newDir);
      // Update the path of created directory
      global.sandboxDir = newDir;
    }
  };

  // Create directory and return the path
  loop(0);
}

before(function () {
  global.sandboxDir = resolve(__dirname, process.env.SANDBOX_DIR || "test_sandbox");
  createSandboxDir(global.sandboxDir);
  process.chdir(global.sandboxDir);

  console.log('Test directory is:', global.sandboxDir);

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
  writeFiles();
  prepareGit(done);
});

afterEach(function (done) {
  runSequence([
    function(next){
      rmdir(resolve(global.sandboxDir, '.git'), next);
    },
    function(next){
      rmdir(resolve(global.sandboxDir, '*'), next);
    }
  ], done);
});

after(function (done) {
  mockery.disable();

  process.chdir(mochaCwd);

  rmdir(global.sandboxDir, done);
  global.sandboxDir = resolve(__dirname, process.env.SANDBOX_DIR || "test_sandbox");
});
