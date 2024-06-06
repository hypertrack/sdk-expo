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
    if [ $(git symbolic-ref --short HEAD) = "master" ] ; then
        VERSION=$(just version)
        git tag $VERSION
        git push origin $VERSION
        just _open-github-release-data
    else
        echo "You are not on master branch"
    fi

release:
    npm publish --dry-run
    @echo "THIS IS DRY RUN. Check if everything is ok and then run 'npm publish'. Checklist:"
    @echo "\t- check the release steps in CONTRIBUTING"

setup:
  npx yarn
  npx expo install --yarn

version:
  @cat package.json | grep version | head -n 1 | grep -o -E '{{SEMVER_REGEX}}'

_open-github-release-data:
    code CHANGELOG.md
    just open-github-releases
