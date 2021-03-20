# Rarible

[![npm](https://img.shields.io/npm/v/npm.svg?style=flat-square)](https://www.npmjs.com/package/npm)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

The CLI App for Rarible - NFT Marketplace

## Developing

### Built With

- [Node](https://nodejs.org/en/) `12.19.0` (This matches with the AWS Lamba Node Verison)
- [ESLint](https://eslint.org/)
- [Prettier-Eslint](https://github.com/prettier/prettier-eslint)
- [Husky](https://github.com/typicode/husky)
- [Lint-Staged](https://github.com/okonet/lint-staged)

### Prerequisites

You'll need to have the Zapier Platform CLI installed if you haven't already:

```shell
npm install -g zapier-platform-cli
```

### Deploying / Publishing

- Add yourself as a collaborator in the Zapier Dashboard
- Run the command `zapier link` and make sure that it shows the green check signifying that the right app is picked
- Run the command `zapier push` to push changes to the app (make sure that `package.json` is updated to reflect
  the version you want to push to).
- Whenever a change is going to be pushed out make sure to update the [CHANGELOG.md](CHANGELOG.md) to record what is
  changing (and make sure to enter the version based on the guidance below).

## Versioning

We should use [SemVer](http://semver.org/) for versioning. For the versions available, see the
[CHANGELOG](CHANGELOG.md).

## Tests

Right now there are no tests. These need to be created.

## Style guide

We use [ESLint](https://eslint.org/) and a common set of rules developed by AirBnB with a couple of tweaks. Linting
should occur automatically whenever you make a commit (see [package.json](package.json) for the exact things being run).

With that being said, you can run the following command to run the lint check against all of your files:

```shell
npm run lint
```

Or you can run this to format all of your files properly:

```shell
npm run format
```

## API References

- https://docs.rarible.com/
