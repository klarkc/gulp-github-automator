var should = require('should');
var git = require("gulp-git");
var resolve = require("path").resolve;
var escapeString = require('escape-string-regexp');

should.Assertion.add(
  // the name of the custom assertion
  'containsGitLog',

  // the implementation of the custom assertion
  function (expected, done) {
    this.obj.should.be.a.String();

    if(typeof expected !== "string") {
      expected.should.be.a.insanceof(RegExp);
    }

    done.should.be.a.Function();

    var beforeDir = resolve(process.cwd());
    var gitDir = this.obj;

    this.params = {
      operator: 'directory to contain the git log'
    };

    process.chdir(resolve(gitDir));

    git.exec({
      args: 'log --quiet',
      quiet: true
    }, function (err, output) {
      if (err) throw err;

      process.chdir(beforeDir);

      if(expected instanceof RegExp) {
        should(output).match(expected);
      } else {
        should(output).match(new RegExp(escapeString(expected)));
      }
      done();
    });
  }
);
