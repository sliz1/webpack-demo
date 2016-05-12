const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const webpackUtils = require('./webpack/webpack_utils');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const common = {
  entry: {
    app: PATHS.app
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
    config = merge(
      common, {
        devtool: 'source-map'
      },
      webpackUtils.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      webpackUtils.extractBundle({
        name: 'vendor',
        entries: ['react']
      }),
      webpackUtils.minify(),
      webpackUtils.setupCss(PATHS.app)
    );
    break;
  default:
    config = merge(
      common,
      webpackUtils.setupCss(PATHS.app),
      {
        devtool: 'cheap-module-source-map'
      },
      webpackUtils.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

module.exports = validate(config);
