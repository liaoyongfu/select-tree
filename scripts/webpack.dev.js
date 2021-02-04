const { merge } = require('webpack-merge');
const Html = require('html-webpack-plugin');
const base = require('./webpack.base');

module.exports = merge(base, {
  entry: './examples/index.tsx',
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
    hot: true,
    open: true
  },
  plugins: [
    new Html({
      template: './examples/index.html'
    })
  ]
});
