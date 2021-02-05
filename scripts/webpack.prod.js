const { merge } = require('webpack-merge');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const base = require('./webpack.base');
const pkg = require('../package.json');

module.exports = merge(base, {
  entry: './src',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: `${pkg.name}.js`,
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                strictMath: true,
              },
            },
          },
        ],
      },
    ]
  },
  externals: [nodeExternals()],
  plugins: [new MiniCssExtractPlugin({
    filename: `${pkg.name}.css`
  })],
});
