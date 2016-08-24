# Global Fishing Watch

This repository will host the Global Fishing Watch client application developed by [vizzuality](http://www.vizzuality.com/)

# Requirements

- [nodejs](https://nodejs.org/en/)

# Installation

Start by installing the required nodejs packages using `npm` (already bundled with recent nodejs installations)

```
npm install
```

Create a `.env` file from the provided sample and set the missing values accordingly

Next, start the server by running:

```
node server.js
```

You should be able to access your application at [http://localhost:3000/](http://localhost:3000/)

# Development

The project includes a set of hooks to automatize boring tasks as well as ensure code quality.
To use them, simply enable to built-in git hook manager:
 
```
./bin/git/init-hooks
```

You only need to do this once. If new hooks/changes to existing hooks are brought from upstream, the git hook manager
 will automatically use them without requiring further actions from you.
 
Note that as of now, before we fix all errors on the existing codebase, the push will carry on even with errors.

# Environment variables description

#### PORT

Port in which the node server will listen for incmming connections

#### GOOGLE_API_KEY

API key for Google Maps

#### NODE_ENV

Environment in which the node server will run (production/development)

#### AUTH_USER + AUTH_PASSWORD

If set, an auth wall will be placed in front of the whole node server

#### EMBED_MAP_URL

If set, the given URL will be loaded using an iframe element, instead of the built in map

#### MAP_API_ENDPOINT

Endpoint of the API (vessel tiles, workspace, contact, etc)

#### BLOG_URL

URL of the blog

#### FAQ_JSON_URL

Endpoint of the FAQ section content

#### DEFINITIONS_JSON_URL

Endpoint of the Definitions section content

#### ART_PUB_JSON_URL

Endpoint of the Articles & publications section content
