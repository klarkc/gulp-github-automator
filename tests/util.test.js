"use strict";

var should = require("should");
var assertions = require('./custom-assertions');
var mockery = require("mockery");
var path = require("path");
var git = require("gulp-git");
var gitOptions = {args: '--quiet', quiet: true};

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

    git.init(gitOptions);

    util.createTmpBranch(function(name){
      should(name).match(/^tmp\-\d+$/);
      done();
    }, gitOptions.args);
  });

  it("should read packageVersion", function() {
    var util = require("../util.js");
    util.conf.appDir = process.env.SANDBOX_DIR;

    should(util.packageVersion('package.json')).match(/^(\d+\.)?\d+.\d+$/);
  });

  it("should commitChangesStream", function(done){
    var util = require("../util.js");
    util.conf.appDir = process.env.SANDBOX_DIR;

    util.conf.appDir = '*';

    git.init(gitOptions);

    var stream = util.commitChangesStream(gitOptions.args);
    stream.on('finish', function(){
      should(process.env.SANDBOX_DIR).containsGitLog(
        "[Prerelease] Bumped version number",
        done
      );
    });
  });

  it("should not mergeInto without -b", function(){
    var mockArgs = {
      argv: {}
    };

    var util = require("../util.js");
    util.conf.appDir = process.env.SANDBOX_DIR;

    should(util.mergeInto).throw(Error);
  });

  it("should -b test mergeInto master", function(){
    var mockArgs = {
      argv: {b: 'test'}
    };

    mockery.registerMock('yargs', mockArgs);
    var util = require("../util.js");
    util.conf.appDir = process.env.SANDBOX_DIR;

    util.mergeInto("test", function(){

    }, gitOptions.args);
  });

});
