const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  },
  entry: {
    'bundle.js': [
      path.resolve(__dirname, './src/test/index.ts')
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'src', 'test', 'index.html'),
        to: path.resolve(__dirname, 'dist')
      }
    ]),
  ],
});