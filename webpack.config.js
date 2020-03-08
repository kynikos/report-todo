/* eslint-env node */
const path = require('path')
const webpack = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')


module.exports = function ({production}) {
  return {
    entry: {
      index: path.resolve(__dirname, 'src', 'index.js'),
      'report-todo': path.resolve(__dirname, 'aux', 'report-todo.js'),
    },
    target: 'node',
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      library: 'report-todo',
      libraryTarget: 'umd',
    },
    // Defining 'externals' prevents the 'report-todo' library from being
    // bundled directly also with the report-todo.js script
    externals: {
      'report-todo': 'commonjs2 report-todo',
    },
    // 'mode' also sets NODE_ENV through DefinePlugin
    mode: production ? 'production' : 'development',
    // TODO[setup]: Use a proper devtool in production
    //   https://webpack.js.org/configuration/devtool/#production
    devtool: production ? false : 'eval-source-map',
    resolve: {
      alias: {
        // Keep in sync with Jest's moduleNameMapper
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        // NODE_ENV is automatically set by 'mode', however DefinePlugin must be
        // instantiated here
      }),
      new webpack.BannerPlugin({
        banner: '#!/usr/bin/env node\n',
        raw: true,
        include: 'report-todo.js',
      }),
    ],
  }
}
