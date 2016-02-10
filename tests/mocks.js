"use strict";

var $ = module.exports;
$.git = {
  checkout: function (branch, opt, cb) {
    if (!branch) {
      cb(Error("missing branch parameter"));
    }
    cb();
  },
  add: function () {
    return;
  },
  commit: function (msg) {
    if (!msg) {
      throw Error("missing message parameter");
    }
    return;
  },
  merge: function (branch, opt, cb) {
    if (!branch) {
      cb(Error("missing branch parameter"));
    } else {
      cb();
    }
  },
  branch: function (branch, opt, cb) {
    if (!branch) {
      cb(Error("missing branch parameter"));
    } else {
      cb();
    }
  },
  push: function (remote, branch, opt, cb) {
    cb();
  },
};
