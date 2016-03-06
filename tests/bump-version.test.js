"use strict";
var should = require("should");
var fs = require("fs");
var mockery = require("mockery");

var mockOptions = {
  warnOnUnregistered: false,
  warnOnReplace: false,
  useCleanCache: true
};

describe("Task bump-version", function(){
  beforeEach(function(){
    mockery.enable(mockOptions);
  });

  afterEach(function(){
    mockery.disable();
  });

  it("should bump patch", function(done){
    mockery.registerMock("yargs", {
      argv: {
        t: "patch"
      }
    });

    var util = require("../util.js");
    util.conf.appDir = global.sandboxDir;

    var bumpVersion = require("../tasks/bump-version.js");

    var gulpStream = bumpVersion();
    gulpStream.on("end", function(){
      var version = util.packageVersion();
      version.should.equal("1.2.4");
      done();
    });
  });

  it("should bump minor", function(done){
    mockery.registerMock("yargs", {
      argv: {
        t: "minor"
      }
    });

    var util = require("../util.js");
    util.conf.appDir = global.sandboxDir;

    var bumpVersion = require("../tasks/bump-version.js");

    var gulpStream = bumpVersion();
    gulpStream.on("end", function(){
      var version = util.packageVersion();
      version.should.equal("1.3.0");
      done();
    });
  });

  it("should bump major", function(done){
    mockery.registerMock("yargs", {
      argv: {
        t: "major"
      }
    });

    var util = require("../util.js");
    util.conf.appDir = global.sandboxDir;

    var bumpVersion = require("../tasks/bump-version.js");

    var gulpStream = bumpVersion(null, "minor");
    gulpStream.on("end", function(){
      var version = util.packageVersion();
      version.should.equal("2.0.0");
      done();
    });
  });
});
