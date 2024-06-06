alias pt := push-tag
alias v := version

REPOSITORY_NAME := "sdk-react-native"

# Source: https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
# \ are escaped
SEMVER_REGEX := "(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?"

build:
    yarn expo-module clean
    yarn expo-module build

clean:
  npx yarn clean
  npx yarn cache clean --force
  rm -rf node_modules ~/Library/Developer/Xcode/DerivedData

open-github-prs:
    open "https://github.com/hypertrack/{{REPOSITORY_NAME}}/pulls"

open-github-releases:
    open "https://github.com/hypertrack/{{REPOSITORY_NAME}}/releases"

push-tag:
    #!/usr/bin/env sh
    set -euo pipefail
    if [ $(git symbolic-ref --short HEAD) = "main" ] ; then
        VERSION=$(just version)
        git tag $VERSION
        git push origin $VERSION
        just _open-github-release-data
    else
        echo "You are not on main branch"
    fi

release publish="dry-run":
    #!/usr/bin/env sh
    set -euo pipefail
    VERSION=$(just version)
    if [ {{publish}} = "publish" ]; then
        BRANCH=$(git branch --show-current)
        if [ $BRANCH != "main" ]; then
            echo "You must be on main branch to publish a new version (current branch: $BRANCH))"
            exit 1
        fi
        echo "Are you sure you want to publish version $VERSION? (y/N)"
        just _ask-confirm
        open "https://www.npmjs.com/package/hypertrack-sdk-expo/v/$VERSION"
    else
        npm publish --dry-run
    fi

setup:
  npx yarn
  npx expo install --yarn

version:
  @cat package.json | grep version | head -n 1 | grep -o -E '{{SEMVER_REGEX}}'

_open-github-release-data:
    code CHANGELOG.md
    just open-github-releases
