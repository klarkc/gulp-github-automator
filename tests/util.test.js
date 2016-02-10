"use strict";

var should = require("should");
var path = require("path");
var fakeFS = require("mock-fs");


describe("util.js", function(){
  it("should have a default conf", function(){
    var util = require("../util.js");

    should(util.conf.token).equal(null);
    should(util.conf.preset).equal("angular");
    should(util.conf.testTask).equal(null);
    should(util.conf.appDir).equal(
      path.dirname(require.main.filename)
    );
    should(util.conf.versionFiles.length).greaterThan(0);
  });

  it("should createTmpBranch", function(done){
    var util = require("../util.js");

    util.createTmpBranch(function(name){
      should(name).match(/^tmp\-\d+$/);
      done();
    });
  });

  it("should read packageVersion", function() {
    var util = require("../util.js");

    fakeFS({
      "package.json": "{\n\"version\": \"1.2.3\"\n}"
    });

    should(util.packageVersion('package.json')).match(/^(\d+\.)?\d+.\d+$/);

    fakeFS.restore();
  });
/*
  it("should commitChangesStream", function(){
    var util = require("../util.js");

  });
*/
});
