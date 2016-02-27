"use strict";

var should = require("should");
var assertions = require('./custom-assertions');
var mockery = require("mockery");
var path = require("path");
var git = require("gulp-git");
var fs = require("fs");
var mockery = require("mockery");
var gulp = require("gulp");

var gitOptions = {
  quiet: true
};

describe("util.js", function () {
  beforeEach(function(){
    mockery.enable({
      warnOnUnregistered: false
    });
  });

  afterEach(function(){
    mockery.disable();
  });

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
    stream.on('end', function () {
      should(global.sandboxDir).containsGitLog(
        "[Prerelease] Bumped version number",
        done
      );
    });
  });

  describe("calculateVersion", function(){
    beforeEach(function(){
      fs.writeFileSync('deleteme.md', 'please, deleteme');
    });

    it("should calculate minor", function(done){
      var util = require("../util.js");
      var stream = gulp.src('deleteme.md')
      .pipe(git.add(gitOptions))
      .pipe(git.commit("feat(docs): New deleteme file", gitOptions));

      stream.on('end', function(){
        util.calculateVersion(function(err, release){
          if (err) {
            throw err;
          }
          should(release).equal('minor');
          done();
        });
      });
    });

    it("should calculate major", function(done){
      var util = require("../util.js");
      var stream = gulp.src('deleteme.md')
      .pipe(git.add(gitOptions))
      .pipe(git.commit("feat(docs): New deleteme file\n\nBREAKING CHANGE: New file on repository must be detected by someone else",
                       gitOptions));

      stream.on('end', function(){
        util.calculateVersion(function(err, release){
          if (err) {
            throw err;
          }
          should(release).equal('major');
          done();
        });
      });
    });
  });

  describe("askContinue", function(){
    mockery.registerMock("readline", {
      createInterface: function (obj){
        return {
          question: function(text, callback) {
            return callback("no");
          }
        }
      }
    });
    it("should get an error", function(){
      var util = require("../util.js");
      (function(){
        util.askContinue("Want to continue?", function(){}, true);
      }).should.throw("The last question must be answered with a yes YES for this task keeps going");
    });
    it("should continue", function(){
      var util = require("../util.js");
      (function(){
        util.askContinue("Want to continue?");
      }).should.not.throw();
    });
  });

});
