'use strict';

require('dotenv').config({silent: true});

const path = require('path');
const koa = require('koa');
const serve = require('koa-static');
const webpack = require('webpack');
const webpackMiddleware = require('koa-webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');

const port = process.env.PORT || 3000;
const app = koa();

if (process.env.NODE_ENV === 'production') {
  app.use(serve(path.join(__dirname, 'dist')));
} else {
  app.use(serve(path.join(__dirname, 'app')));
  app.use(webpackMiddleware(webpack(webpackConfig), {
    stats: {
      colors: true
    }
  }));
}

app.use(serve(path.join(__dirname, 'public')));

app.listen(port);
