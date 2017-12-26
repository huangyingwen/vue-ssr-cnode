const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const utils = require('./utils')
const loadMinified = require('./load-minified')
const config = require('../config')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
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
    new VueSSRServerPlugin()
  ].concat(
    process.env.NODE_ENV === 'production'
      ? [
          new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css')
          }),
          // generate dist index.html with correct asset hash for caching.
          // you can customize output by editing /index.html
          // see https://github.com/ampedandwired/html-webpack-plugin
          new HtmlWebpackPlugin({
            filename: config.build.index,
            template: './src/index.template.html',
            inject: false,
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeAttributeQuotes: true,
              ignoreCustomComments: [/vue-ssr-outlet/]
              // more options:
              // https://github.com/kangax/html-minifier#options-quick-reference
            },
            serviceWorkerLoader: `<script>${loadMinified(
              path.join(__dirname, './service-worker-prod.js')
            )}</script>`
          })
        ]
      : [
          new HtmlWebpackPlugin({
            filename: config.build.index,
            template: './src/index.template.html',
            inject: false,
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            serviceWorkerLoader: `<script>${fs.readFileSync(
              path.join(__dirname, './service-worker-dev.js'),
              'utf-8'
            )}</script>`
          })
        ]
  )
})
