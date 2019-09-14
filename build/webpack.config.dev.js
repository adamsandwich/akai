const path = require('path');
const webpack = require('webpack');

const commonConf = require('./webpack.config.common'); //webpack通用配置

const merge = require("webpack-merge"); // webpack配置合并 可简单的理解为与Object.assign()功能类似

module.exports = merge(commonConf, {
    mode: 'development',
    output: {
        filename: '[name]-[hash].js', // 文件名
        publicPath: '/', // html引用资源路径,在dev-server中,引用的是内存中文件！
    },
    module: {

    },
    devtool: false, // 生成sourceMaps(方便调试)
    devServer: { // 启动一个express服务器,使我们可以在本地进行开发！！！
        hot: true, // 热加载
        inline: true, // 自动刷新
        open: true, // 自动打开浏览器
        historyApiFallback: { // 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index
            index: '/dist/popup.html'
        },
        host: 'localhost', // 主机名
        port: '3000', // 端口号
        disableHostCheck: true, // 不检查主机
        proxy: { // 配置反向代理解决跨域
            "/api": {
                target: 'http://localhost:3001',
                changeOrigin: true
            }
        },
        compress: true, //为你的代码进行压缩。加快开发流程和优化的作用
        overlay: { // 在浏览器上全屏显示编译的errors或warnings。
            errors: true,
            warnings: false
        },
        quiet: false, // 终端输出的只有初始启动信息。 webpack 的警告和错误是不输出到终端的
        writeToDisk: true, // 写入文件系统
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // 开启HMR(热替换功能,替换更新部分,不重载页面！)
        new webpack.NamedModulesPlugin(), // 显示模块相对路径
    ]
})
