var path = require('path');
var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ImageminPlugin = require('imagemin-webpack-plugin').default;
var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpackDevServer = require('webpack-dev-server');

//var zconfig = require("./zconfig");

var env = process.env.NODE_ENV || 'development';

var definePlugin = new webpack.DefinePlugin({
    __DEV__: env!=="production"
});

var plugins = [
    definePlugin,
    new WebpackNotifierPlugin()
];


var plugins2 = [
    new webpack.optimize.UglifyJsPlugin({
        drop_console: true,
        compress: false,
        mangle: false,
        output: {
            comments: false,
        },
        beautify: false,
        sourceMap: true,
        test: /js\/.*\.js($|\?)/i
    }),
    new CopyWebpackPlugin([ {
        from: 'bin/',
        to: path.resolve("D:\\www\\files\\game\\byxxl"),
        ignore: ["bin/index.html"]
    } ]),
    new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        // pngquant: { quality: '15-40' },
        optipng: {
        	optimizationLevel: 3
      	} 
    })
];

/* if (process.env.NODE_ENV === 'devserver') {
    plugins.push(new webpack.HotModuleReplacementPlugin());
} */
if (process.env.NODE_ENV === 'production') {
    plugins = plugins.concat(plugins2);
}

/**************************************************************************************************************************
 **
 */
module.exports = {
    entry: {
        app: [  path.resolve(__dirname, 'src/app.js') ]
    },
    devtool: 'source-map',
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, './bin'), 
        //path: path.resolve(zconfig.hp+"\\www\\files\\game\\byxxl"),
        filename: 'js/bundle.js'
    },
    watch:  env!=="production",
    plugins: plugins,
    module: {
        rules: [ { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') } ]
    },
    devServer: {
        hot: false,
        contentBase: "./bin/",
        setup: function(app) {
            app.get("/test", (req,res)=> {
                res.json( require("bin/json/play.json") );
            });
        }
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