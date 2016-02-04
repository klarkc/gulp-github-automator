'use strict';

var releaser = require('conventional-github-releaser');
var git = require('gulp-git');
var $ = require('../util.js');

var createAndPush = function(done){
  releaser({
        type: "oauth",
        token: $.conf.token
    }, {
        preset: $.conf.preset
    }, done);
};

module.exports = function (done) {
  git.checkout('master', function(){
    createAndPush(done);
  });
};

