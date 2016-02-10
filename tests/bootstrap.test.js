"use strict";

var mockery = require("mockery");
var mocks = require("./mocks.js");

beforeEach(function () {
  mockery.enable({
    useCleanCache: true
  });

  mockery.warnOnUnregistered(false);

  mockery.registerMock("gulp-git", mocks.git);

  mockery.registerAllowable("../util.js");
});

afterEach(function () {
  mockery.disable();
  mockery.deregisterAll();
});
