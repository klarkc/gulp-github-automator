# gulp-gitflow
It's a collection of gulp tasks with the objective of simplify the workflow of your application development in your GitHub repository.

The principle is: Your master branch is always in sync with your production environment, and develop branch is used for developing things.

![Git Flow](http://nvie.com/img/git-model@2x.png)

[More details](http://nvie.com/posts/a-successful-git-branching-model/)

## Usage
In your gulpfile.js:
```
var gulp = require('gulp');

// Load Tasks
require('gulp-gitmagic', {
    preset: 'angular',
    test_task: 'test',
    github_token: process.env.GITHUB_TOKEN
});

gulp.task('default', ['release']);
```

### options

#### preset
Type: `string` Possible values: `'angular', 'atom', 'codemirror', 'ember', 'eslint', 'express', 'jquery', 'jscs', 'jshint'`

Is the pattern of the commits messages, with this you can automate the changelog generation and other tasks. The default one is the [angular preset](https://github.com/ajoslin/conventional-changelog/blob/master/conventions/angular.md).

#### test_task
Type: `string` Default: `undefined`

Is the task that you are using to test things before the submission of your code. It's optional, and if not defined the test will be skiped.

#### github_token
Type: `string`

You can get the token in your [settings page in GitHub](https://github.com/settings/tokens/). Security concerns: If you put the token directly in your source code everyone with access to the code will be able to use this token.

