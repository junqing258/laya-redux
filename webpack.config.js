var path = require('path');
var webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var WebpackNotifierPlugin = require('webpack-notifier');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var env = process.env.NODE_ENV || 'development';

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
})

module.exports = {
  entry: {
    app: [
      // 'babel-polyfill',
      path.resolve(__dirname, 'script/app.js')
    ]
  },
  devtool: 'source-map', //cheap-source-map
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'bin'),
    publicPath: './bin/',
    filename: 'js/bundle.js'
  },
  watch: true,
  plugins: [
    definePlugin,
    new WebpackNotifierPlugin( {
      excludeWarnings: true // alwaysNotify: false
    }),
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'index.html',
      title: 'H5 Game',
      template: 'src/index.jade'
    }),
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      server: {
        baseDir: ['./', './bin']
      }
    })
  ],
  module: {
    rules: [
      { test: /\.js|jsx$/, use: ['babel-loader'], include: path.join(__dirname, 'script') },
      { test: /\.(jade|pug)$/, use: ['pug-loader?pretty=true'] }
    ]
  },
  resolve: {
    alias: {

    }
  }
}
