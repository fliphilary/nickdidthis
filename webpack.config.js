const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const AssetsPlugin = require('assets-webpack-plugin');
const webpack = require('webpack');

const extractSass = new ExtractTextPlugin({
  filename: "css/[name].css",
  disable: process.env.NODE_ENV === "development"
});

const assets = new AssetsPlugin({
  filename: 'manifest.json',
  path: path.resolve(`../dist/`),
  fullPath: false
});

module.exports = {
  entry: './src/index.js',
  devtool: "inline-sourcemap",
  output: {
    path: path.resolve('dist'),
    filename: 'js/app.js',
    publicPath: '/dist/',
  },
  module: {
    loaders: [
      { test: /\.json$/, loaders: ['json-loader'] },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets:['react', 'stage-0'],
          plugins:['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
        }
      },
      {
        test: /\.scss|.css$/,
        use: extractSass.extract({
          use: [
            {
              loader:"css-loader",
              options:{sourceMap: true}
            },
            {
              loader:"sass-loader",
              options:{sourceMap: true}
            }
          ],
          fallback: "style-loader"})
      },
      {
        test: /\.(jpg|jpeg|gif|png)(\?.*$|$)/,
        exclude: /node_modules/,
        loader:'url-loader?limit=1024&name=images/[name].[ext]',
      },
      {
        test: /\.(svg|woff|woff2|ttf|eot|otf)(\?.*$|$)/,
        loader: 'url-loader?limit=1024&name=fonts/[name].[ext]'
      }
    ]
  },
  plugins: [extractSass, assets ]
}