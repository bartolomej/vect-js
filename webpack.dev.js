const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');


const commonDev = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'build')
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name]'
  },
};

const docsConfig = merge(common, commonDev, {
  name: 'docs',
  entry: {
    'index.js': [
      path.resolve(__dirname, 'docs', 'index.ts')
    ]
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

const examplesConfig = merge(common, commonDev, {
  name: 'examples',
  entry: {
    'index.js': [
      path.resolve(__dirname, 'examples', 'index.ts')
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'examples', 'index.html'),
        to: path.resolve(__dirname, 'build')
      }
    ])
  ],
});

module.exports = [ docsConfig, examplesConfig ];