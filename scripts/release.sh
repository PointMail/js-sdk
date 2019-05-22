#/bin/bash

BRANCH_NAME=${TRAVIS_BRANCH:=`git rev-parse --symbolic-full-name --abbrev-ref HEAD`}

setup_git() {
  git config --global user.email "travis@pointapi.com"
  git config --global user.name "Travis CI"
}

release_master() {
    echo "Releasing master"
    
    setup_git

    echo "Bumping npm version.."
    npm version patch -m "Bumping to %s [skip ci]"

    echo "Pushing to git.."
    git remote show origin
    git remote rm origin
    git remote add origin https://${GH_TOKEN}@github.com/PointMail/js-sdk.git > /dev/null 2>&1
    git push origin HEAD:${BRANCH_NAME}
    git push --tags
}

release_dev() {
    echo "Releasing dev"

    COMMIT_SHA=${TRAVIS_COMMIT:=`git log --pretty=format:'%h' -n 1`}
    COMMIT_SHA=${COMMIT_SHA::7}
    DEV_VERSION=0.0.0-${BRANCH_NAME}.${COMMIT_SHA}

    echo "Bumping npm version to ${DEV_VERSION}.."
    npm version ${DEV_VERSION} -m "Bumping to %s"
}


if [ ${BRANCH_NAME} = "master" ]; then
    release_master
else
    release_dev
fi

echo "Done!"