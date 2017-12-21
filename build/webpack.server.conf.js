const webpack = require('webpack')
const merge = require('webpack-merge')
const utils = require('./utils')
const config = require('../config')
const baseWebpackConfig = require('./webpack.base.conf')
const nodeExternals = require('webpack-node-externals')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const env =
  process.env.NODE_ENV === 'testing'
    ? require('../config/test.env')
    : process.env.NODE_ENV === 'production' ? config.build.env : config.dev.env

module.exports = merge(baseWebpackConfig, {
  target: 'node',
  devtool: '#source-map',
  entry: './src/entry-server.js',
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  // https://webpack.js.org/configuration/externals/#externals
  // https://github.com/liady/webpack-node-externals
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /\.css$/
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': env,
      'process.env.VUE_ENV': '"server"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    new VueSSRServerPlugin()
  ]
})
