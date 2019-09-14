const path = require('path');
const webpack = require('webpack');

const devMode = process.env.NODE_ENV !== 'production'; // 是否为开发模式

const HtmlWebpackPlugin = require("html-webpack-plugin"); // 创建html入口文件的
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 抽离css文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清空dist文件夹
const CopyWebpackPlugin = require("copy-webpack-plugin"); // 拷贝文件

module.exports = { // webpack 基本设置
  entry: { // 项目入口文件->webpack从此处开始构建！
    app: './src/index.jsx'
  },
  resolve: { // 配置模块如何被解析
    extensions: [".jsx", ".js", ".json"], // 自动解析文件扩展名(补全文件后缀)(从左->右) import hello from './hello'  （!hello.jsx? -> !hello.js? -> !hello.json）
    //alias: { // 引入别名简化引入 views: path.resolve(__dirname, '../src/views'),

    //}
  },
  module: { // 处理模块的规则 (可在此处使用不同的loader来处理模块!)
    rules: [{
      test: /\.(jsx|js)$/, // 资源路径
      loader: 'babel-loader', // 该路径执行的loader
      // include: path.resolve(__dirname, '../src') // 指定哪个文件loader
    }, {
      test: /\.(le|c)ss$/,
      use: [
        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true
          }
        }
      ],
      // include: path.resolve(__dirname, '../src')
    }, {
      test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'img/[name].[hash:8].[ext]'
      }
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'media/[name].[hash:8].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'fonts/[name].[hash:8].[ext]'
      }
    }]
  },
  plugins: [
    new CleanWebpackPlugin(), // 清空dist文件夹
    new HtmlWebpackPlugin({ // html配置
      filename: 'popup.html',
      template: 'popup.html',
      // favicon: path.resolve(__dirname, '../public', 'favicon.ico'),
      inject: true,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
      chunkFilename: "[id].[hash].css",
    }),
    new CopyWebpackPlugin([{ // 拷贝文件
      from: 'public',
      to: ''
    }]),
  ]
}
