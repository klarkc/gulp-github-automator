"use strict";

var should = require("should");
var assertions = require('./custom-assertions');
var mockery = require("mockery");
var path = require("path");
var git = require("gulp-git");
var fs = require("fs");
var mockery = require("mockery");
var gulp = require("gulp");
var extend = require("util")._extend;

var gitOptions = {
  quiet: true
};

describe("util.js", function () {
  beforeEach(function(){
    mockery.enable({
      warnOnUnregistered: false,
      warnOnReplace: false,
      useCleanCache: true
    });

    // Default aswers yes for every question
    mockery.registerMock("readline", {
      createInterface: function (obj){
        return {
          question: function(text, callback) {
            return callback("yes");
          }
        };
      }
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
      mockery.disable(); // We do not want mockery here, cause it generates an error with gulp things
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
    it("should continue without must and yes response", function(){
      var util = require("../util.js");
      util
        .askContinue
        .bind(null, "Want to continue?", function(){}, false)
        .should.not.throw();
    });
    it("should get an error with must and no response", function(){
      mockery.registerMock("readline", {
        createInterface: function (obj){
          return {
            question: function(text, callback) {
              return callback("no");
            }
          };
        }
      });
      var util = require("../util.js");
      util
        .askContinue
        .bind(null, "Want to continue?", function(){}, true)
        .should
        .throw("The last question must be answered with a yes YES for this task keeps going");
    });
    it("should continue without must and no response", function(){
      mockery.registerMock("readline", {
        createInterface: function (obj){
          return {
            question: function(text, callback) {
              return callback("no");
            }
          };
        }
      });
      var util = require("../util.js");
      util
        .askContinue
        .bind(null, "Want to continue?", function(){}, false)
        .should.not.throw();
    });
  });

  describe("askDeleteBranch", function(){
    it("should not delete a branch with no response", function(done){
      mockery.registerMock("readline", {
        createInterface: function (obj){
          return {
            question: function(text, callback) {
              return callback("no");
            }
          };
        }
      });
      var util = require("../util.js");
      util.askDeleteBranch("test", function(did){
        did.should.be.false();
        done();
      }, gitOptions);
    });
    it("should callback with false did when yes response", function(done){
      var util = require("../util.js");
      util.askDeleteBranch("test", function(did){
        did.should.be.false();
        done();
      }, gitOptions);
    });
  });

  describe("mergeInto", function(){
    var setArgs = function(branch){
      // Do not working, mock do not being registered
      mockery.registerMock('yargs', {
        argv: {b: branch}
      });
    };

    beforeEach(function(done){
      git.checkout("test", gitOptions, function () {
        fs.writeFileSync('deleteme.md', 'please, deleteme');
        var addCommit = gulp.src('deleteme.md')
        .pipe(git.add(gitOptions))
        .pipe(git.commit("Testing merge", gitOptions));

        addCommit.on('end', function(){
          git.checkout("master", gitOptions, done);
        });
      });
    });
    afterEach(function(done){
      git.checkout("master", gitOptions, done);
    });
    it("should not merge without -b", function () {
      setArgs(null);
      var util = require("../util.js");

      (function(){
        util.mergeInto("test", function(){});
      }).should.throw("You must set a branch with -b argument");
    });

    it("should merge test branch into master", function (done) {
      setArgs('test');

      var util = require("../util.js");
      util.conf.appDir = global.sandboxDir;
      util.mergeInto("test", function (err) {
        if (err) {
          throw err;
        }

        should(global.sandboxDir).containsGitLog(
          "Testing merge",
          done
        );
      });
    });
  });

  describe("mergeInto", function(){
    var setArgs = function(branch){
      // Do not working, mock do not being registered
      mockery.registerMock('yargs', {
        argv: {b: branch}
      });
    };

    beforeEach(function(done){
      git.checkout("test", gitOptions, function () {
        fs.writeFileSync('deleteme.md', 'please, deleteme');
        var addCommit = gulp.src('deleteme.md')
        .pipe(git.add(gitOptions))
        .pipe(git.commit("Testing merge", gitOptions));

        addCommit.on('end', function(){
          git.checkout("master", gitOptions, done);
        });
      });
    });
    afterEach(function(done){
      git.checkout("master", gitOptions, done);
    });
    it("should not merge without -b", function () {
      setArgs(null);
      var util = require("../util.js");

      (function(){
        util.mergeInto("test", function(){});
      }).should.throw("You must set a branch with -b argument");
    });

    it("should merge test branch into master", function (done) {
      setArgs('test');

      var util = require("../util.js");
      util.conf.appDir = global.sandboxDir;
      util.mergeInto("test", function (err) {
        if (err) {
          throw err;
        }

        should(global.sandboxDir).containsGitLog(
          "Testing merge",
          done
        );
      });
    });
  });

});
