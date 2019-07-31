const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : '/'

const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  configureWebpack: config => {
    // config.externals = {
    //     'vue': 'Vue',
    //     // 'vue-router': 'VueRouter',
    //     // 'moment': 'moment'
    // }
    if (isProduction) {
      //修改uglifyOptions去除console来减少文件大小
      // config.plugins.push(
      //   new UglifyJsPlugin({
      //     uglifyOptions: {
      //       compress: {
      //         warnings: false,
      //         drop_debugger: true,
      //         drop_console: true,
      //       },
      //     },
      //     sourceMap: false,
      //     parallel: true,
      //   })       
      // )
      //开启gzip压缩
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }))
    }
  },
  // pages: {
  //   index: {
  //     entry: '@/main.js',
  //     template: 'public/index.html',
  //     filename: 'index.html'
  //   },
    
  // }
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  // baseUrl: BASE_URL,
  publicPath: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.41:8087/', // 后台服务器的ip地址
        pathRewrite: { '^/api': '/' },
        changeOrigin: true,
        ws: false
      }
    }
  },
  css: {
    loaderOptions: { // 向 CSS 相关的 loader 传递选项
      less: {
        javascriptEnabled: true
      }
    }
  },
  // chainWebpack: config => {
  //   const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
  //   types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  // },

}

 
// function addStyleResource(rule) {
//     rule.use('style-resource')
//         .loader('style-resources-loader')
//         .options({
//             patterns: [
//                 resolve('src/assets/css/variable.less'), // 需要全局导入的less
//             ],
//         })
// }
