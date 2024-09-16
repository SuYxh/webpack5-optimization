
const baseConfig = require('./webpack.base.js')
const { merge } = require('webpack-merge')

/**
 * @type {import('webpack').Configuration}
 */

const prodConfig = {
  mode: 'production',
  optimization: {
    // 用文件的名字作为chunk的名字
    chunkIds: 'named',
  },
}

module.exports = merge(baseConfig, prodConfig)


