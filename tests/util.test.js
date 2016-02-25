"use strict";

var should = require("should");
var path = require("path");
var git = require("gulp-git");

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

    git.init({args: '--quiet'});

    util.createTmpBranch(function(name){
      should(name).match(/^tmp\-\d+$/);
      done();
    });
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

    git.init({args: '--quiet'});

    var stream = util.commitChangesStream();

    stream.on('readable', function(){
      var file = stream.read();
      if(file) {
        should(file.gitAdd).equal(true);
        should(file.gitCommit).equal("[Prerelease] Bumped version number");
      }
    });

    stream.on('finish', done);
  });

  it("should not mergeInto without -b", function(){
    var util = require("../util.js");
    util.conf.appDir = process.env.SANDBOX_DIR;

    should(util.mergeInto).throw(Error);
  });

  it("should mergeInto test", function(){
    var util = require("../util.js");
    util.conf.appDir = process.env.SANDBOX_DIR;

    util.mergeInto("test", function(){

    });
  });

});
