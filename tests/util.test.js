"use strict";

var should = require("should");
var assertions = require('./custom-assertions');
var mockery = require("mockery");
var path = require("path");
var git = require("gulp-git");
var gitOptions = {quiet: true};
var fs = require("fs");

describe("util.js", function(){
  it("should have a default conf", function(){
    var util = require("../util.js");
    util.conf.appDir = process.env.SANDBOX_DIR;

    should(util.conf.token).equal(null);
    should(util.conf.preset).equal("angular");
    should(util.conf.testTask).equal(null);
    should(util.conf.appDir).equal(process.cwd());
    should(util.conf.versionFiles.length).greaterThan(0);
  });

  it("should createTmpBranch", function(done){
    var util = require("../util.js");
    util.conf.appDir = process.env.SANDBOX_DIR;

    util.createTmpBranch(function(name){
      should(name).match(/^tmp\-\d+$/);
      done();
    }, gitOptions);
  });

  it("should read packageVersion", function() {
    var util = require("../util.js");
    util.conf.appDir = process.env.SANDBOX_DIR;

    should(util.packageVersion('package.json')).match(/^(\d+\.)?\d+.\d+$/);
  });

  it("should commitChangesStream", function(done){
    var util = require("../util.js");

    fs.writeFileSync('deleteme.md', 'please, deleteme');
    util.conf.appDir = 'deleteme.md';

    var stream = util.commitChangesStream(gitOptions);
    stream.on('finish', function(){
      should(process.env.SANDBOX_DIR).containsGitLog(
        "[Prerelease] Bumped version number",
        done
      );
    });
  });

  it("should not mergeInto without -b", function(){
    var util = require("../util.js");
    util.conf.appDir = process.env.SANDBOX_DIR;

    should(util.mergeInto).throw(Error);
  });

  it("should test branch mergeInto master", function(done){
    var util = require("../util.js");
    util.conf.appDir = process.env.SANDBOX_DIR;

    util.mergeInto("test", function(){
      should(process.env.SANDBOX_DIR).containsGitLog(
        "Merged",
        done
      );
    }, gitOptions);
  });

});
