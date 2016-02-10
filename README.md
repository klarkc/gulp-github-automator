gulp-github-automator
=

[![Travis][travis-image]][travis-url]
[![David deps][david-image]][david-url]
[![Codacy][codacy-image]][codacy-url]
[![Coverage][coverage-image]][coverage-url]

[travis-image]: https://img.shields.io/travis/klarkc/gulp-github-automator/master.svg
[travis-url]: https://travis-ci.org/klarkc/gulp-github-automator
[david-image]: https://img.shields.io/david/klarkc/gulp-github-automator.svg
[david-url]: https://david-dm.org/klarkc/gulp-github-automator
[codacy-image]: https://img.shields.io/codacy/67950dc659aa4f589efd881190b5a5a0.svg
[codacy-url]: https://www.codacy.com/app/walker/gulp-github-automator
[coverage-image]: https://api.codacy.com/project/badge/coverage/67950dc659aa4f589efd881190b5a5a0
[coverage-url]: https://www.codacy.com/app/walker/gulp-github-automator

It"s a collection of gulp tasks with the objective of simplify the workflow of your application development in your GitHub repository.

The principle is simple: Your master branch is always in sync with your production environment, and develop branch is used as base of new features. With this We can automate the changelog file generation and versioning info. New versions of your application are created when needed as well the releases and tags on GitHub repository.

![Git Flow](http://nvie.com/img/git-model@2x.png)

[More details](http://nvie.com/posts/a-successful-git-branching-model/)

## Usage
In your gulpfile.js:
```javascript
var automatorTasks = require("gulp-github-automator");

// Load tasks
automatorTasks({
    preset: "angular",
    testTask: "test",
    token: process.env.GITHUB_TOKEN,
});
```

### Options

#### preset
Type: `string` Possible values: `"angular", "atom", "codemirror", "ember", "eslint", "express", "jquery", "jscs", "jshint"`

Is the pattern of the commits messages, with this you can automate the changelog generation and define automatic version detection. The default one is the [angular preset](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#).

#### testTask
Type: `string` Default: `undefined`

Is the task that you are using to test things before the submission of your code. It"s optional, and if not defined the test will be skiped.

#### token
Type: `string`

You can get the token in your [settings page in GitHub](https://github.com/settings/tokens/). Security concerns: If you put the token directly in your source code everyone with access to the code will be able to use this token.

#### versionFiles
Type: `array` Default: `["package.json", "bower.json"]`

Where github-automator will search for versioning strings for the automatic version bump.

### Tasks
To run a task just type `$ gulp taskname` in your project directory.

#### init
Configure your repository with needed files and branches and bump the first version from the one in your package.json manifest.

#### start-feature
Start a new branch from develop branch with a new feature. Use `-n` argument to define the name (or reference) to the new feature. You will be asked if you want to send the feature branch to the origin repository.

#### finish-feature
Merge the given feature branch (use `-b` argument to define the branch name). With [testTask](#testTask) argument you can define a gulp task to test your application before we finish.

#### start-release
Start a new branch with all features from develop branch that will be merged in future to the master branch. You will be asked if you want to send the release branch to the origin repository.

#### finish-release
Merge the given release branch (use `-b` argument to define the branch name). With [testTask](#testTask) argument you can define a gulp task to test your application before we finish.

#### start-hotfix
Start a new branch from the master branch. You will be asked if you want to send the hotfix branch to the origin repository.

#### finish-hotfix
Merge the given hotfix branch (use `-b` argument to define the branch name). With [testTask](#testTask) argument you can define a gulp task to test your application before we finish.
