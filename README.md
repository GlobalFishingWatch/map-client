# Global Fishing Watch

This repository will host the Global Fishing Watch client application developed by [vizzuality](http://www.vizzuality.com/)

# Requirements

- [nodejs](https://nodejs.org/en/)

# Installation

Start by installing the required nodejs packages using `npm` (already bundled with recent nodejs installations)

```
npm install
```

Next, start the server by running:

```
node server.js
```

You should be able to access your application at [http://localhost:3000/](http://localhost:3000/)

Eslint and sass-lint should be run before pushing anything. You can set up that behaviour by adding a symlink to a file that runs `npm test`:
```
cd .git/hooks && ln -s -f ../../scripts/pre-push pre-push && cd ../..
```

Note that as of now, before we fix all errors on the existing codebase, the push will carry on even with errors.
