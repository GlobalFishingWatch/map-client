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
      MAP_URL: JSON.stringify(envVariables.MAP_URL),
      V2_API_ENDPOINT: JSON.stringify(envVariables.V2_API_ENDPOINT),
      BLOG_URL: JSON.stringify(envVariables.BLOG_URL),
      SITE_URL: JSON.stringify(envVariables.SITE_URL),
      REQUIRE_MAP_LOGIN: envVariables.REQUIRE_MAP_LOGIN,
      DEFAULT_WORKSPACE: JSON.stringify(envVariables.DEFAULT_WORKSPACE),
      LOCAL_WORKSPACE: JSON.stringify(envVariables.LOCAL_WORKSPACE),
      GA_TRACKING_CODE: JSON.stringify(envVariables.GA_TRACKING_CODE),
      DISABLE_WELCOME_MODAL: envVariables.DISABLE_WELCOME_MODAL === 'true',
      WELCOME_MODAL_COOKIE_KEY: JSON.stringify(envVariables.WELCOME_MODAL_COOKIE_KEY),
      COMPLETE_MAP_RENDER: envVariables.COMPLETE_MAP_RENDER === 'true',
      TIMEBAR_DATA_URL: JSON.stringify(envVariables.TIMEBAR_DATA_URL),
      SHARE_BASE_URL: JSON.stringify(envVariables.SHARE_BASE_URL)
    })
  ],

  resolve: {
    root: `${process.cwd()}/app`,
    alias: {
      assets: 'assets',
      actions: 'src/actions',
      components: 'src/components',
      constants: 'src/constants.js',
      containers: 'src/containers',
      lib: 'src/lib',
      middleware: 'src/middleware',
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
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
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
