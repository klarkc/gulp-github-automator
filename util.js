"use strict";

var gulp = require("gulp");
var git = require("gulp-git");
var fs = require("fs");
var argv = require("yargs").argv;
var rl = require("readline");
var path = require("path");
var version = require("conventional-recommended-bump");
var $ = module.exports;

$.conf = {
  token: null,
  preset: "angular",
  testTask: null,
  appDir: path.dirname(require.main.filename),
  versionFiles: [
    "package.js",
    "bower.json"
  ]
};

$.createTmpBranch = function (done, args) {
  var name = "tmp-" + Math.floor(Math.random() * 10000);
  args = args || "";
  git.checkout(name, {
    args: "-b " + args
  }, function () {
    done(name);
  });
};

$.packageVersion = function (file) {
  // We parse the json file instead of using require because require caches
  // multiple calls so the version number won"t be updated
  file = file || path.resolve($.conf.appDir, "./package.json");
  return JSON.parse(fs.readFileSync(file, "utf8")).version;
};

$.commitChangesStream = function (args) {
  args = args || "";
  return gulp.src($.conf.appDir)
    .pipe(git.add())
    .pipe(git.commit("[Prerelease] Bumped version number", {args: args}));
};

$.mergeInto = function (branch, done, args) {
  args = args || "";
  if (!argv.b) {
    throw new Error("You must set a branch with -b argument");
  }

  git.checkout(branch, function () {
    git.merge(argv.b, {
      args: "--no-ff " + args
    }, done);
  }, args);
};

$.calculateVersion = function (done) {
  version({
    preset: $.conf.preset
  }, done);
};

$.askContinue = function (question, keepGoing, must) {
  must = must || false;

  rl.question(question + " (Default to Yes): ", function (answer) {
    if (!answer.match(/not|no|n/i)) {
      keepGoing();
    } else if(must) {
      throw new Error("The last question must be answered with a yes YES for this task keeps going");
    }
  });
};


$.askDeleteBranch = function (branch, done) {
  $.askContinue("Want to delete local and remote " + branch + " branch? ", function () {
    // Delete local release branch
    git.branch(argv.b, {
      args: "-d"
    }, function () {
      // Delete remote release branch
      git.push("origin", argv.b, {
        args: "--delete"
      }, done);
    });
  });
};

$.askPushTo = function (local, remote, done) {
  $.askContinue("Want to push the local " + local + " branch to " + remote + " repository?", function () {
    git.push(remote, local, {
      args: "-u"
    }, done);
  });
};

/*
* Recursively merge properties of two objects
*/
$.merge = function (obj1, obj2) {

  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if ( obj2[p].constructor==Object ) {
        obj1[p] = $.merge(obj1[p], obj2[p]);

      } else {
        obj1[p] = obj2[p];

      }

    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];

    }
  }

  return obj1;
};
