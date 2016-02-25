"use strict";
var fs = require("fs");
var resolve = require("path").resolve;
var rmdir = require("rimraf");
var mockery = require("mockery");

var sandboxDir = process.env.SANDBOX_DIR;

var mochaCwd = process.cwd();

function writeFiles() {
  fs.writeFileSync("package.json", "{\n\"version\": \"1.2.3\"\n}");
}

before(function () {
  if (!sandboxDir) {
    sandboxDir = process.env.SANDBOX_DIR = resolve(__dirname, "test_sandbox");
  }
});

beforeEach(function () {
  fs.mkdirSync(sandboxDir);
  process.chdir(resolve(sandboxDir));
  writeFiles();

  mockery.enable({
    warnOnUnregistered: false
  });
});

afterEach(function (done) {
  mockery.disable();
  process.chdir(mochaCwd);
  rmdir(resolve(sandboxDir), done);
});

after(function(done){
  // If something gone wrong we force-removal of the test directory, we don't want this directory messing up future tests.
  try {
    rmdir(resolve(sandboxDir), done);
    throw new Error("Test sandbox directory has been forced deleted");
  } catch(err) {
    done();
  }
});
