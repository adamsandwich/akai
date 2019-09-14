const path = require('path');
const webpack = require('webpack');
const commonConf = require('./webpack.config.common'); // webpack通用配置
const merge = require("webpack-merge"); // webpack配置合并 可简单的理解为与Object.assign()功能类似
const TerserPlugin = require('terser-webpack-plugin'); // 压缩js文件

const prod = merge(commonConf, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'), // Build后所有文件存放的位置
    publicPath: '/', // html引用资源路径,可在此配置cdn引用地址！
    filename: '[name].[hash].js', // 文件名
    chunkFilename: '[name].[hash].js', // 用于打包require.ensure(代码分割)方法中引入的模块
  },
  devtool: 'source-map',
  module: {

  },
  plugins: [
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      cache: true,
      test: /\.js(\?.*)?$/i,
    }),],
    splitChunks: {
      chunks: 'all',
      minChunks: 3, // 共享最少的chunk数，使用次数超过这个值才会被提取
      name: true,
      cacheGroups: { // 声明的公共chunk
        vendor: {
          // 过滤需要打入的模块
          test: module => {
            if (module.resource) {
              const include = [/[\\/]node_modules[\\/]/].every(reg => {
                return reg.test(module.resource);
              });
              const exclude = [/[\\/]node_modules[\\/](react|redux|antd)/].some(reg => {
                return reg.test(module.resource);
              });
              return include && !exclude;
            }
            return false;
          },
          name: 'vendor',
          priority: 50, // 确定模块打入的优先级
          reuseExistingChunk: true, // 使用复用已经存在的模块
        },
        react: {
          test: ({
            resource
          }) => {
            return /[\\/]node_modules[\\/](react|redux)/.test(resource);
          },
          name: 'react',
          priority: 20,
          reuseExistingChunk: true,
        },
        antd: {
          test: /[\\/]node_modules[\\/]@material-ui/,
          name: 'material-ui',
          priority: 15,
          reuseExistingChunk: true,
        }
      }
    }
  }
})

if (process.env.analyz_npm_config_report) { // 输出文件大小分析
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  prod.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = prod;
