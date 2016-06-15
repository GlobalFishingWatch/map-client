'use strict';
var HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {

  context: path.join(__dirname, 'app'),

  entry: [
    'whatwg-fetch',
    './src/index.jsx'
  ],

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: ''
  },

  module: {
    loaders: [{
      test: /\.(js|jsx)?/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('css?sourceMap&modules&importLoaders=1&localI‌​dentName=[name]__[local]___[hash:base64:5]!sass?sourceMap')
    }, { test: /\.html$/, loader: 'html-loader' }]
  },

  resolve: {
    modulesDirectories: ['node_modules', 'app'],
    extensions: ['', '.js', '.jsx']
  },

  plugins: [
    new ExtractTextPlugin('styles.css', {
      allChunks: true
    })
  ]

};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"'
}),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Global Fishing Watch',
      filename: 'index.html',
      template: 'template.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    })
  );
} else {
  config.plugins.push(
    new webpack.NoErrorsPlugin()
  );
  config.devtool = 'source-map';
}

module.exports = config;
