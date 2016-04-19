"use strict";

var gulp = require("gulp");
var git = require("gulp-git");
var fs = require("fs");
var argv = require("yargs").argv;
var readline = require("readline");
var path = require("path");
var version = require("conventional-recommended-bump");
var $ = module.exports;
var extend = require("util")._extend;
var runSequence = require("async").series;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

$.conf = {
  token: null,
  preset: "angular",
  testTask: null,
  appDir: path.dirname(require.main.filename),
  versionFiles: [
    "package.json"
  ]
};

$.createTmpBranch = function (done, opts) {
  var name = "tmp-" + Math.floor(Math.random() * 10000);
  var myOpts = extend({}, opts);
  myOpts.args = myOpts.args?myOpts.args+" -b":"-b";
  git.checkout(name, myOpts, function (err) {
    done(err, name);
  });
};

$.packageVersion = function (file) {
  // We parse the json file instead of using require because require caches
  // multiple calls so the version number won"t be updated
  file = file || path.resolve($.conf.appDir, "./package.json");
  return JSON.parse(fs.readFileSync(file, "utf8")).version;
};

$.commitChangesStream = function (opts) {
  var myOpts = extend({}, opts);
  return gulp.src($.conf.appDir)
    .pipe(git.add(myOpts))
    .pipe(git.commit("[Prerelease] Bumped version number", myOpts));
};

$.mergeInto = function (branch, done, opts) {
  var chckOpts = extend({}, opts);
  var mergeOpts = extend({}, opts);
  mergeOpts.args = mergeOpts.args?mergeOpts.args + " --no-ff":" --no-ff";
  if (!argv.b) {
    throw new Error("You must set a branch with -b argument");
  }

  git.checkout(branch, chckOpts, function () {
    git.merge(argv.b, mergeOpts, done);
  });
};

$.calculateVersion = function (done) {
  version({
    preset: $.conf.preset
  }, done);
};

$.askContinue = function (text, callback, must) {
  must = must || false;
  rl.question(text + " (Default to Yes): ", function (answer) {
    if (!answer.match(/not|no|n/i)) {
      callback(true);
    } else if(must) {
      throw new Error("The last question must be answered with a yes YES for this task keeps going");
    } else {
      callback(false);
    }
  });
};


$.askDeleteBranch = function (branch, callback, opts) {
  var myOpts = extend({}, opts);
  var pushOpts = extend({}, opts);
  myOpts.args = myOpts.args?myOpts.args+" -d":"-d";
  pushOpts.args = pushOpts.args?pushOpts.args+" --delete":"--delete";
  $.askContinue("Want to delete local and remote " + branch + " branch? ", function (did) {
    if (did) {
      runSequence([
        // Delete local branch
        function(next){
          git.branch(branch, myOpts, next);
        },
        // Delete remote branch
        function(next){
          git.push("origin", branch, pushOpts, next);
        }
      ], function(err, result){
        if(err) {
          callback(false); // I know it's weird but I do not figured out how to test this throw in util.test.js
        } else {
          callback(true);
        }

      });
    } else {
      callback(false);
    }
  });
};

$.askPushTo = function (local, remote, callback, opts) {
  var pushOpts = extend({}, opts);
  pushOpts.args = pushOpts.args?pushOpts.args + " -u":"-u";
  $.askContinue("Want to push the local " + local + " branch to " + remote + " repository?", function (did) {
    if (did) {
      git.push(remote, local, pushOpts, function(err){
        if (err) {
          callback(false); // I know it's weird but I do not figured out how to test this throw in util.test.js
        } else {
          callback(true);
        }
      });
    } else {
      callback(false);
    }
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
