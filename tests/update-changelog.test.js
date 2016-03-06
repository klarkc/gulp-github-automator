"use strict";
var should = require("should");
var updChangelog = require("../tasks/update-changelog.js");
var fs = require("fs");

describe("Task update-changelog", function(){
  it("should create changelog file", function(done){
    var util = require("../util.js");
    util.conf.appDir = global.sandboxDir;

    var gulpStream = updChangelog();
    gulpStream.on("end", function(){
      var file = fs.readFileSync("./CHANGELOG.md");
      console.log(file);
      done();
    });
  });
  it("should update existing changelog file", function(done){
    var util = require("../util.js");
    util.conf.appDir = global.sandboxDir;

    var gulpStream = updChangelog();
    gulpStream.on("end", function(){
      /* Test something here */
      done();
    });
  });
});
