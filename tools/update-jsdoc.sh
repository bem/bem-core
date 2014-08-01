#!/usr/bin/env bash

set -e

JSDOC_BRANCH=${TRAVIS_BRANCH}-jsdoc
JSDOC_DIR=gh-jsdoc
CURRENT_COMMIT=`git rev-parse HEAD`

if [ "$TRAVIS_REPO_SLUG" = "$GH_REF" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]; then
    echo "Updating JSDocs"

    rm -rf $JSDOC_DIR
    npm run bem-jsdoc || exit 1

    mkdir -p $JSDOC_DIR
    cd $JSDOC_DIR

    git init
    git config user.name "Travis CI"
    git config user.email "travis@travis-ci.org"

    cp -fR ../desktop.jsdoc .

    # Commit and Push the Changes
    git add -f -- **/*.md
    git commit \
        -m "jsdoc on successful travis build $TRAVIS_BUILD_NUMBER of $CURRENT_COMMIT auto-pushed to $JSDOC_BRANCH" \
        -m "[ci skip]"
    git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:${JSDOC_BRANCH} > /dev/null 2>&1 || exit 1
fi

