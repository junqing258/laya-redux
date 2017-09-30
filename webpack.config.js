var path = require('path');
var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ImageminPlugin = require('imagemin-webpack-plugin').default;
var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpackDevServer = require('webpack-dev-server');

var env = process.env.NODE_ENV || 'development';

console.log(env);

var definePlugin = new webpack.DefinePlugin({
  __DEV__: env==='development'? true: false
});

module.exports = {
  entry: {
    app: [
      // 'babel-polyfill',
      path.resolve(__dirname, 'src/app.js')
    ]
  },
  devtool: 'source-map', //cheap-source-map
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, './bin'),
    // publicPath: './bin/',
    filename: 'js/bundle.js'
  },
  watch: true,
  plugins: [
    definePlugin,
    new WebpackNotifierPlugin( {
      excludeWarnings: true // alwaysNotify: false
    }),
    /*new CopyWebpackPlugin([{
      from: 'laya/assets/', to:"assets/"
    }]),
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production', // Disable during development
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: {
        quality: '25-45'
      },
      optipng: {
        optimizationLevel: 1
      }
    }),*/
    // new webpack.HotModuleReplacementPlugin(),
    /*new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      server: {
        baseDir: ['./', './bin']
      }
    }),*/
    /*new webpack.optimize.UglifyJsPlugin({
      drop_console: true,
      minimize: true,
      output: {
        comments: false
      }
    }),*/
    // new webpack.optimize.CommonsChunkPlugin({ name: 'vendor'/* chunkName= */, filename: 'vendor.bundle.js'/* filename= */})
  ],
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') }
    ]
  },
  devServer:{
    hot: true,
    contentBase: "./bin/",
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ], 
    alias: {

    }
  }
};
