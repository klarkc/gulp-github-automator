"use strict";
var should = require("should");
var bumpVersion = require("../tasks/bump-version.js");

describe("Task bump-version", function(){
  it("should bump patch", function(){
    var util = require("../util.js");
    util.conf.appDir = global.sandboxDir;
    var gulpStream = bumpVersion(null, "patch");
    gulpStream.on("end", function(){
      var version = util.packageVersion();
      version.should.match(/\d+.\d+.\d+/);
    });
  });
});
