"use strict";

var loadTasks = require("gulp-load-tasks");
var $ = require("./util.js");

module.export = function(options) {
  $.merge($.conf, options);
  loadTasks();
};
