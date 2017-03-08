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

# Environment variables description

#### PORT

Port in which the node server will listen for incoming connections

#### GOOGLE_API_KEY

API key for Google Maps

#### NODE_ENV

Environment in which the node server will run (production/development)

#### AUTH_USER + AUTH_PASSWORD

If set, an auth wall will be placed in front of the whole node server

#### COMPLETE_MAP_RENDER

If true, the map will display the header, and footer on the map page. If false, the app will only render the map (full window size) and the sidebar.

#### EMBED_MAP_URL

If set, the given URL will be loaded using an iframe element, instead of the built in map

#### MAP_API_ENDPOINT

Endpoint of the API (vessel tiles, workspace, contact, etc)

#### BLOG_URL

URL of the blog

#### SITE_URL

URL of the main site

#### REQUIRE_MAP_LOGIN

Boolean value to determine if the user needs to be logged in to access the map (setting to false is experimental)

#### GA_TRACKING_CODE

Google Analytics tracking code.

#### DEFAULT_WORKSPACE

Name/ID of the default workspace to be loaded on the map (if `USE_LOCAL_WORKSPACE` is set to false, see below)

#### LOCAL_WORKSPACE

If set, should point to the local workspace to be loaded

#### DISABLE_WELCOME_MODAL

Disable welcome modal. Typically enabled in a dev environment, disabled in prod

#### WELCOME_MODAL_COOKIE_KEY

Key used to read the welcome modal's url cookie. On load, the app will look for a cookie named with the specified key. If any cookie matches the WELCOME_MODAL_COOKIE_KEY and the url of the cookie is new, the html content will be loaded in a modal. EXAMPLE: If WELCOME_MODAL_COOKIE_KEY is set to GlobalFishingWatchNewsletter the cookie's name must also be GlobalFishingWatchNewsletter.
