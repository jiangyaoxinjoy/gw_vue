const path = require('path')
var webpack = require('webpack');
const resolve = dir => {
  return path.join(__dirname, dir)
}
const BASE_URL = process.env.NODE_ENV === 'production' ?
  '/' :
  '/'
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
// const uglifyjs = require('uglifyjs-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const merge = require("webpack-merge");
module.exports = {
  runtimeCompiler: true, //是否使用包含运行时编译器的 Vue 构建版本
  configureWebpack: config => {
    config.externals = {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'axios': 'axios',
      'vuex': 'Vuex'
    }
    if (isProduction) {
      //开启gzip压缩
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }))
    }
  },
  publicPath: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.entry.app = ["babel-polyfill", resolve('src/main.js')], //让ie打开页面
      config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
    // //为了补删除换行而加的配置
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        // modify the options...
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    // config.module
    //   .rule('js')
    //   // .test(/\.js$/)
    //   .pre()
    //   .include
    //   .add(resolve('node_modules/vue-baidu-map/components/'))
    //   .end()
    //   .use('babel')
    //   .loader('babel-loader')
    //   // .tap(options => {
    //   //     // modify the options...
    //   //     options.presets = [
    //   //       ['@babel/preset-env', {
    //   //         modules: false
    //   //       }]
    //   //       return options;
    //   //     })
    //   .options({
    //     presets: [
    //       ['@babel/preset-env', {
    //         modules: false
    //       }]
    //     ]
    //   });
    // .test(/\.js$/)
    // .use('babel-loader')
    // .loader('babel-loader')
    // .include
    // .add(resolve('node_modules/vue-baidu-map/components/')) // 要处理的模块
    // .end()
    //   // config.module
    //   //   .rule('js')
    //   //   // .test(/\.js$/)
    //   //   // .use('babel-loader')
    //   //   // .loader('babel-loader')
    //   //   .include
    //   //   .add('node_modules/vue-baidu-map/components/')
    //   // .tap(options => {
    //   //   merge(options, {
    //   //     presets: ['es2015'],
    //   //   })
    //   // })
    //   .end()
    // .use("iview-loader")
    // .loader("iview-loader")
    // .tap(options =>
    //   merge(options, {
    //     prefix: true,
    //    })
    //   )
    // // .tap(options => {
    // //   // modify the options...
    // //   options['prefix'] = false;
    // //   return options;
    // // })
    // .end();
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    proxy: {
      '/api': {
        target: 'https://console.guanweixiaofang.com', // 后台服务器的ip地址
        pathRewrite: {
          '^/api': '/'
        },
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