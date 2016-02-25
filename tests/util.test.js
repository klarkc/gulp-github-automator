"use strict";

var should = require("should");
var assertions = require('./custom-assertions');
var mockery = require("mockery");
var path = require("path");
var git = require("gulp-git");
var fs = require("fs");
var gulp = require("gulp");

var gitOptions = {
  quiet: true
};

describe("util.js", function () {
  it("should have a default conf", function () {
    var util = require("../util.js");
    util.conf.appDir = global.sandboxDir;

    should(util.conf.token).equal(null);
    should(util.conf.preset).equal("angular");
    should(util.conf.testTask).equal(null);
    should(util.conf.appDir).equal(process.cwd());
    should(util.conf.versionFiles.length).greaterThan(0);
  });

  it("should createTmpBranch", function (done) {
    var util = require("../util.js");
    util.conf.appDir = global.sandboxDir;

    util.createTmpBranch(function (err, name) {
      if(err) {
        throw err;
      }

      should(name).match(/^tmp\-\d+$/);
      done();
    }, gitOptions);
  });

  it("should read packageVersion", function () {
    var util = require("../util.js");
    util.conf.appDir = global.sandboxDir;

    should(util.packageVersion('package.json')).match(/^(\d+\.)?\d+.\d+$/);
  });

  it("should commitChangesStream", function (done) {
    var util = require("../util.js");

    fs.writeFileSync('deleteme.md', 'please, deleteme');
    util.conf.appDir = 'deleteme.md';

    var stream = util.commitChangesStream(gitOptions);
    stream.on('finish', function () {
      should(global.sandboxDir).containsGitLog(
        "[Prerelease] Bumped version number",
        done
      );
    });
  });

  it("should not mergeInto without -b", function () {
    var util = require("../util.js");
    util.conf.appDir = global.sandboxDir;

    mockery.registerMock('yargs', {
      yargs: {
        argv: {}
      }
    });

    should(util.mergeInto).throw(Error);
  });

  it("should test branch mergeInto master", function (done) {
    var util = require("../util.js");
    util.conf.appDir = global.sandboxDir;

    git.checkout("test", function () {
      fs.writeFileSync('deleteme.md', 'please, deleteme');
      util.conf.appDir = 'deleteme.md';

      var addCommit = gulp.src('deleteme.md')
        .pipe(git.add(gitOptions))
        .pipe(git.commit("Testing merge", gitOptions));

      addCommit.on('finish', function () {
        util.mergeInto("test", function (err) {
          if (err) {
            throw err;
          }

          should(global.sandboxDir).containsGitLog(
            "Testing merge",
            done
          );
        }, gitOptions);
      });

    });
  });

  it("should calculateVersion", function(done){
    done();
  });

});
