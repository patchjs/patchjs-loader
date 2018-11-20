var path = require('path');
var fs = require('fs');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var PatchjsWebpackPlugin = require('patchjs-webpack-plugin');
var nodeEnv = process.env.NODE_ENV;
var pkg = JSON.parse(fs.readFileSync('./package.json'));
var webpack = require('webpack');

var increment = true;
if (nodeEnv === 'dev') {
  increment = false;
}

module.exports = {
  entry: {
    index: './js/index.js',
    common: './js/common.js'
  },
  output: {
    path: path.join(__dirname, 'dist/' + pkg.name + '/' + pkg.version),
    chunkFilename: '[name].js',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new PatchjsWebpackPlugin({increment: increment, path: 'http://127.0.0.1:8080/dist/webpack4.x/'}),
    new MiniCssExtractPlugin('[name].css')
  ]
};
