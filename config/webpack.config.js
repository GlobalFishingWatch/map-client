require('dotenv').config({ silent: true });

process.env.BROWSERSLIST_CONFIG = 'browserslist';

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const packageJSON = require('../package.json');

const rootPath = process.cwd();
const envVariables = process.env;


const webpackConfig = {

  entry: [
    'whatwg-fetch',
    path.join(rootPath, 'app/src/util/assignPolyfill.js'),
    path.join(rootPath, 'app/src/index.jsx')
  ],

  output: {
    path: path.join(rootPath, 'dist/'),
    filename: '[name]-[hash].js',
    publicPath: '/'
  },

  plugins: [
    new ExtractTextPlugin('styles.css', {
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      inject: 'body',
      filename: 'index.html',
      key: envVariables.GOOGLE_API_KEY
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify(process.env.NODE_ENV || 'development'),
      VERSION: JSON.stringify(packageJSON.version),
      EMBED_MAP_URL: JSON.stringify(envVariables.EMBED_MAP_URL),
      MAP_API_ENDPOINT: JSON.stringify(envVariables.MAP_API_ENDPOINT),
      BLOG_URL: JSON.stringify(envVariables.BLOG_URL),
      FAQ_JSON_URL: JSON.stringify(envVariables.FAQ_JSON_URL),
      DEFINITIONS_JSON_URL: JSON.stringify(envVariables.DEFINITIONS_JSON_URL),
      ART_PUB_JSON_URL: JSON.stringify(envVariables.ART_PUB_JSON_URL),
      REQUIRE_MAP_LOGIN: envVariables.REQUIRE_MAP_LOGIN,
      DEFAULT_WORKSPACE: JSON.stringify(envVariables.DEFAULT_WORKSPACE),
      USE_LOCAL_WORKSPACE: JSON.stringify(envVariables.USE_LOCAL_WORKSPACE),
      GA_TRACKING_CODE: JSON.stringify(envVariables.GA_TRACKING_CODE),
      HOME_SLIDER_JSON_URL: JSON.stringify(envVariables.HOME_SLIDER_JSON_URL)
    })
  ],

  resolve: {
    root: `${process.cwd()}/app`,
    alias: {
      assets: 'assets',
      actions: 'src/actions',
      components: 'src/components',
      containers: 'src/containers',
      reducers: 'src/reducers',
      styles: 'styles',
      util: 'src/util'
    },
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack'
        ]
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!resolve-url!postcss-loader!sass?sourceMap')
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      }
    ]
  },

  imageWebpackLoader: {
    optimizationLevel: (process.env.NODE_ENV === 'development' ? 0 : 7),
    bypassOnDebug: true,
    interlaced: false
  },
  postcss() {
    return [autoprefixer];
  }
};

// Environment configuration
if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      dead_code: true,
      drop_debugger: true,
      drop_console: true
    },
    comments: false
  }));
} else {
  webpackConfig.devtool = 'eval-source-map';
}

module.exports = webpackConfig;
