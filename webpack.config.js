'use strict';

const webpack = require('webpack');
const path = require('path');

const config = {

  context: path.join(__dirname, 'app'),

  entry: [
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
    }]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  plugins: []

};

if (!process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
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
