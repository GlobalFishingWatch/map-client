# Global Fishing Watch

This repository hosts the Global Fishing Watch client application.

# Requirements

- [nodejs](https://nodejs.org/en/)

# Installation

Optional. Start by installing `yarn` as package manager:

```
brew install yarn
```

Once ready continue installing the required nodejs packages running:

```
yarn install || npm install
```

And create a `.env` file from the provided sample and set the missing values accordingly

# Development

Start the server by running:

```
yarn start || npm start
```

You should be able to access your application at [http://localhost:3003/](http://localhost:3003/)

## BrowserStack

We use [BrowserStack](https://www.browserstack.com) to find and fix cross-browser issues.

<a href="https://www.browserstack.com"><img src="https://www.browserstack.com/images/layout/browserstack-logo-600x315.png" height="70" /></a>


# Production

To compile the project to production environment, you need set the NODE_ENV variable value to `production` and
execute the following command.

```
yarn build
```

This command generates a `build` folder with the files needed to run application in a nginx or apache server.

## Error page

On server error, the `/public/500.html` page should be displayed.

# Environment variables

See <a href="https://github.com/GlobalFishingWatch/map-client/blob/develop/documentation/env_variables.md">Environment Variables</a>

# Workspaces

See <a href="https://github.com/GlobalFishingWatch/map-client/blob/develop/documentation/workspaces.md">Workspaces</a>

# Permission keys description

On load, the application will call the /me API endpoint to load user permissions. These are the supported values:

#### selectVessel

Allows a user to select a vessel by clicking on it on the heatmap

#### seeVesselsLayers

Allows a user to see a vessel layer (filters by layer type)

#### seeVesselBasicInfo

Allows a user to see vessel's basic info

#### seeVesselInfo

Allows a user to see all available vessel info

#### shareWorkspace

Allows a user to use the "share" feature

#### seeMap

Allows a user to see the map

#### search

Allows a user to use the search feature

#### custom-layer

Allows a user to upload custom layers

#### reporting

Allows a user to report on report-enabled layers

#### pin-vessel

Allows a user to pin a vessel

# Google Analytics events

#### GA_INNER_TIMELINE_EXTENT_CHANGED

Returns the length of the new inner extent in days.

# GET parameters available on the client

#### params

A base64-encoded JSON object that represent values to override the currently displayed workspace. See <a href="https://github.com/GlobalFishingWatch/map-client/blob/develop/documentation/workspaces.md#workspace-override">"Workspace override" section</a>

#### paramsPlainText

A plain text JSON object that that represent values to override the currently displayed workspace. See <a href="https://github.com/GlobalFishingWatch/map-client/blob/develop/documentation/workspaces.md#workspace-override">"Workspace override" section</a>

#### embedded

A boolean value telling whether the client is in embedded mode (no share, no layers, no menu)

# Console configuration

#### window.extendedMaxTimeRange

Set to true to allow for a longer max time range.
