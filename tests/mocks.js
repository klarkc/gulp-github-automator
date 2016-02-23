"use strict";

var through = require("through2");
var vinyl = require("vinyl-fs-mock");
var stream = require("stream");

var $ = module.exports;
$.git = {
  checkout: function (branch, opt, cb) {
    if (!branch) {
      throw new Error("missing branch parameter");
    }
    cb();
  },
  add: function () {
    return through.obj(function (file, enc, next) {
      file.gitAdd = true;
      console.log('added file', file);
      this.push(file);
      next();
    });
  },
  commit: function (msg) {
    if (!msg) {
      throw new Error("missing message parameter");
    }

    return through.obj(function (file, enc, next) {
      file.gitCommit = msg;
      this.push(file);
      next();
    });
  },
  merge: function (branch, opt, cb) {
    if (!branch) {
      cb(new Error("missing branch parameter"));
    } else {
      cb();
    }
  },
  branch: function (branch, opt, cb) {
    if (!branch) {
      cb(new Error("missing branch parameter"));
    } else {
      cb();
    }
  },
  push: function (remote, branch, opt, cb) {
    cb();
  }
};

$.gulp = vinyl({
  "deleteme": "empty"
});
