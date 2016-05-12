const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const webpackUtils = require('./webpack/webpack_utils');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  style: [
    path.join(__dirname, 'node_modules', 'purecss'),
    path.join(__dirname, 'app', 'main.css')
  ]
};

const common = {
  entry: {
    app: PATHS.app,
    vendor: ['react'],
    style: PATHS.style
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo'
    })
  ]
};

var config;
switch (process.env.npm_lifecycle_event) {
  case 'build':
  case 'stats':
    config = merge(
      common, {
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          // This is used for require.ensure. The setup
          // will work without but this is useful to set.
          chunkFilename: '[chunkhash].js'
        }
      },
      webpackUtils.clean(PATHS.build),
      webpackUtils.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      // webpackUtils.extractBundle({
      //   name: 'vendor',
      //   entries: ['react']
      // }),
      webpackUtils.minify(),
      webpackUtils.extractCSS(PATHS.style),
      webpackUtils.purifyCSS([PATHS.app])
    );
    break;
  default:
    config = merge(
      common,
      webpackUtils.setupCss(PATHS.style),
      {
        devtool: 'inline-source-map'
      },
      webpackUtils.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

module.exports = validate(config);
