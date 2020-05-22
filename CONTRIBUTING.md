# Contributing

svg-sprite-loader is a free and open source, and we appreciate any help you're willing to give - whether it's 
fixing bugs, improving documentation, or suggesting new features.

Table of contents
- [Code of conduct](#code-of-conduct)
- [What's up?](#whatsup)
- [Code contribution](#code-contribution)
  - [Setup](#setup)
  - [Develop](#develop)
- [Releasing](#releasing)

## Code of conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). 
By participating in this project you agree to abide by its terms.

## What's up?

### Got a question or problem with setup?
If you have questions about how to use svg-sprite-loader, please read the [docs](README.md) and [question issues](https://github.com/JetBrains/svg-sprite-loader/issues?q=is:issue+label:question) first. 
 
### Found a bug or inconsistency?
If you find a bug in the source code or a mistake in the documentation, you can help us by [submitting an issue](https://github.com/JetBrains/svg-sprite-loader/issues/new). 
__But even better you can submit a [pull request with a fix](#code-contribution).__

### Want a feature?
You can request a new feature by [submitting an issue](https://github.com/JetBrains/svg-sprite-loader/issues/new).
If you would like to implement a new feature then follow the [code contribution steps](#code-contribution).

<a name="code-contribution"></a>
## Code contribution

Please follow these steps to contribute effectively.

### Setup

1. **Fork & clone** a repo ([how to](https://help.github.com/articles/fork-a-repo)).
2. **Add an upstream remote repo** (original repository that we forked from):

   ```bash
   git remote add upstream https://github.com/JetBrains/svg-sprite-loader.git
   ```

3. **Keep your fork up to date**:

   ```bash
   git pull --ff upstream master
   ```

4. **Setup project** properly:
  now u need install nvm

   ```bash
   sh scripts/build.sh
   ```

   It will:
   1. Install project dependencies.
   2. Install git hooks.
   3. Install dependencies for testing in `webpack-1` and `webpack-2` environments.
   4. Set `webpack-3` environment as current.
   
   Don't use `yarn install` or `npm install`.

### Develop

1. **Make changes in a new git branch** (don't use master!):

   ```bash
   git checkout -b my-fix master
   ```

2. **Lint your code** to check it's following our code style:

   ```bash
   yarn lint
   ```

   Linter runs each time before the commit happens (via git hook).

3. **Test your code** in each environment (webpack-1 and webpack-2):

   ```bash
   # It will run tests in webpack-1 & webpack-2 environments
   yarn test:all

   # Test only in webpack-2
   yarn test:webpack-2
   ```

   Test coverage is collected in each test run. If it decrease too much, tests will fails.

4. **Commit your changes** using a [Angular commit convention](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit-message-format):

   ```bash
   # Run it when you have changes staged for commit
   yarn commit
   ```

   Commit messages validated each time when commit happens.

5. **Push your branch to GitHub**:

   ```bash
   git push origin my-fix
   ```

6. **Create a pull request on GitHub** ([how to](https://help.github.com/articles/creating-a-pull-request)).
7. **Cleanup after pull request is merged**:

   ```bash
   # Delete the remote branch on GitHub
   git push origin --delete my-fix

   # Check out the master branch
   git checkout master -f

   # Delete the local branch
   git branch -D my-fix
   ```

<a name="releasing"></a>
## Releasing

* Commits of type `fix` will trigger bugfix releases, e.g. `0.0.1`.
* Commits of type `feat` will trigger feature releases, e.g. `0.1.0`.
* Commits with `BREAKING CHANGE` in body or footer will trigger breaking releases, e.g. `1.0.0`.

All other commit types will trigger no new release.
