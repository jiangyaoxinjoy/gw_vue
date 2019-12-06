const plugins = [
  "@babel/plugin-transform-runtime",
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-object-rest-spread",
  "transform-vue-jsx",
  // "transform-remove-console"
  // ["import", {
  //   "libraryName": "iview",
  //   "libraryDirectory": "src/components"
  // }]
]
// 生产环境移除console
if (process.env.NODE_ENV === 'production') {
  plugins.push("transform-remove-console")
}
// plugins.push("transform-remove-console")
module.exports = {
  plugins: [...plugins],
  // 下面指的是在生成的文件中，不产生注释
  "comments": false,
  presets: [
    [
      "@vue/app",
      // {"useBuiltIns": "entry"},
      // "@babel/preset-env",
      // {
      //   "targets": {
      //     "node": "4"
      //   }
      // }
    ],
    [
      "@babel/preset-env", {
        "useBuiltIns": "entry"
      }
    ]
  ]
};