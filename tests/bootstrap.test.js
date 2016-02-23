"use strict";
var fs = require("fs");
var resolve = require("path").resolve;
var rmdir = require("rimraf");
var git = require("gulp-git");

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
  git.init({args: '--quiet'});
});

afterEach(function (done) {
  process.chdir(mochaCwd);
  rmdir(resolve(sandboxDir), done);
});

after(function(done){
  if(fs.statSync(resolve(sandboxDir)).isDirectory()) {
    rmdir(resolve(sandboxDir), done);
  } else {
    done();
  }
});
