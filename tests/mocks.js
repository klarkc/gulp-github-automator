"use strict";

var stream = require('stream');

var $ = module.exports;
$.git = {
  checkout: function (branch, opt, cb) {
    if (!branch) {
      cb(Error("missing branch parameter"));
    }
    cb();
  },
  add: function () {
    var addStream = new stream.Transform();
    addStream._transform = function (chunk, _, next) {
      //this.push(chunk.toString() + "\ngit.add()");
      this.push(chunk);
      next();
    };
    return addStream;
  },
  commit: function (msg) {
    if (!msg) {
      throw Error("missing message parameter");
    }

    var commitStream = new stream.Transform();
    commitStream._transform = function (chunk, _, next) {
      //this.push(chunk.toString() + "\ncommiting msg: " + msg);
      this.push(chunk);
      next();
    };
    return commitStream;
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
