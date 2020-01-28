const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');


const libConfig = merge(common, {
  mode: 'production',
  name: 'lib',
  devtool: 'source-map',
  entry: {
    'index.js': [
      path.resolve(__dirname, 'src', 'index.ts')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]',
    library: "vect-js",
    libraryTarget: "umd",
  },
});

const docsConfig = merge(common, {
  mode: 'production',
  name: 'docs',
  devtool: 'source-map',
  entry: {
    'index.js': [
      path.resolve(__dirname, 'docs', 'index.ts')
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
    ])
  ],
});

module.exports = [libConfig, docsConfig];