const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'build')
  },
  entry: {
    'index.js': [
      path.resolve(__dirname, './docs/index.ts')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name]'
  },
  plugins: [
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'docs', 'index.html'),
        to: path.resolve(__dirname, 'build')
      }
    ]),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'docs', 'style.css'),
        to: path.resolve(__dirname, 'build')
      }
    ]),
  ],
});