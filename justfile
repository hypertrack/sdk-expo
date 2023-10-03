build:
    yarn expo-module clean
    yarn expo-module build

clean:
  npx yarn clean
  npx yarn cache clean --force
  rm -rf node_modules ~/Library/Developer/Xcode/DerivedData

release:
    npm publish --dry-run
    @echo "THIS IS DRY RUN. Check if everything is ok and then run 'npm publish'. Checklist:"
    @echo "\t- check the release steps in CONTRIBUTING"

setup:
  npx yarn
  npx expo install --yarn

