# Global Fishing Watch

This repository hosts the Global Fishing Watch client application.

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

Issues with `mozjpeg` on OSX:
```
brew install automake
brew install libpng
```

# Development

The project includes a set of hooks to automatize boring tasks as well as ensure code quality.
To use them, simply enable to built-in git hook manager:

```
./bin/git/init-hooks
```

You only need to do this once. If new hooks/changes to existing hooks are brought from upstream, the git hook manager
 will automatically use them without requiring further actions from you.

Note that as of now, before we fix all errors on the existing codebase, the push will carry on even with errors.

# Production

To compile the project to production environment, you need set the NODE_ENV variable value to `production` and
execute the following command.
```
npm run build
```

This command generates a `dist` folder with the files needed to run application in a nginx or apache server. Your
server needs to be configured to serve all routers from a static `index.html` file.

### nginx
Example nginx config
```
server {
    listen 80;
    server_name myserver;

    location / {
        root    /labs/Projects/Nodebook/public;
        index   index.html;
        try_files $uri /index.html;
    }

}
```

### apache
Example apache configure
```
Options +FollowSymLinks
IndexIgnore */*
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule (.*) index.html
```

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

#### info

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
