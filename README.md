# BEM Core Library [![Build Status](https://travis-ci.org/bem/bem-core.png)](https://travis-ci.org/bem/bem-core)

This README is also availabe [in
Russian](https://github.com/bem/bem-core/blob/v1/README.ru.md).

## What is this?

`bem-core` is a base library for web interface development.
It provides the minimal stack for coding client-side JavaScript and templating.

## Use

The easiest way to run a project with `bem-core` is to use
the [project-stub](https://github.com/bem/project-stub).

You can use any other way you are familiar with to include the library into
the project.

## Inside

### Levels
  - common.blocks
  - desktop.blocks
  - touch.blocks

### Blocks
  - i-bem

### Technologies
  - bemhtml
  - bemtree

## Changelog

You can check the changelog at the [changelog page](CHANGELOG.md).

## Migration

If you used BEM before, check the [migration instructions](MIGRATION.md).

## Development

### Working copy

1. Get the needed version code (e.g., `v1`):
```
$ git clone -b v1 git@github.com:bem/bem-core.git
$ cd bem-core
```

2. Install the dependencies:
```
$ npm install
```
You need
`export PATH=./node_modules/.bin:$PATH`
or an alternative way to run locally-installed bem-tools.

3. Install all the necessary libraries with bem-tools:
```
$ bem make libs
```

4. Build examples and tests:
```
$ bem make sets
```

5. Run development server:
```
$ bem server
```

### How to contribute

1. [Create an issue](https://github.com/bem/bem-core/issues/new) with a proper
description.
2. Decide which version needs your changes.
3. Create a feature-branch with an issue number and a version (`issues/<issue
number>@v<version number>`) based on a version branch.
For example, for an issue #42 and a version #1: `git checkout -b issues/42@v1 v1`.
If you need changes for several versions, each of them has to have a feature
branch.
4. Commit changes and `push`. Rebase your branch on a corresponding version
branch if it's needed.
5. Create a pull-request from your feature branch; or several pull-requests if
you changed several versions.
6. Link your pull request with an issue number any way you like. A comment will work
perfectly.
7. Wait for your pull request and the issue to be closed ;-)

### Modular testing

A default test bundle for `ecma_array`: `bem make common.sets/ecma__array.tests/default`
You can see the results of the tests in the terminal after the building process
finishes.
You can also watch them in a browser loading `common.sets/ecma__array.tests/default/default.html`.

Run tests for other BEM entities in the same way. This will work for those which
are equiped with `.test.js` file.

Test are built with a [bem-pr](https://github.com/narqo/bem-pr) library.
Check the
[details](https://github.com/narqo/bem-pr/blob/master/docs/tests.ru.md]
about testing infrastructure of the [bem-pr](https://github.com/narqo/bem-pr)
library.
