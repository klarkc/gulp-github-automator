"use strict";
var fs = require("fs");
var resolve = require("path").resolve;
var rmdir = require("rimraf");
var mockery = require("mockery");
var git = require("gulp-git");
var gulp = require("gulp");

var sandboxDir = process.env.SANDBOX_DIR;

var mochaCwd = process.cwd();

var gitOptions = {
  quiet: true
};

function writeFiles() {
  fs.writeFileSync("package.json", "{\n\"version\": \"1.2.3\"\n}");
}

before(function () {
  if (!sandboxDir) {
    sandboxDir = process.env.SANDBOX_DIR = resolve(__dirname, "test_sandbox");
  }

  mockery.enable({
    warnOnUnregistered: false
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

  // Init Git
  git.init(gitOptions, function () {
    // Add and commit
    var gitAddCommit = gulp.src("*")
      .pipe(git.add(gitOptions))
      .pipe(git.commit("first commit", gitOptions));

    gitAddCommit.on('finish', function(){
      // Test branch
      git.branch('test', gitOptions, done);
    });
  });
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
