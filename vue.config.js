// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const proxyTable = require('./proxyTable');

const IS_DEV = process.env.NODE_ENV === 'development';

module.exports = {
  publicPath: '/',

  configureWebpack: () => {
    const devPlugins = [
      /**
       * 缓存加速二次构建速度
       */
      new HardSourceWebpackPlugin(),
      new HardSourceWebpackPlugin.ExcludeModulePlugin([
        {
          test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
        },
      ]),
    ];
    if (IS_DEV) {
      return {
        plugins: devPlugins,
      };
    }

    // TODO: 先把console打出来，查看生产环境问题
    // if (process.env.NODE_ENV === 'production') {
    //   return {
    //     plugins: [
    //       //打包环境去掉console.log
    //       new UglifyJsPlugin({
    //         uglifyOptions: {
    //           compress: {
    //             drop_console: true, //注释console
    //             drop_debugger: true, //注释debugger
    //             pure_funcs: ['console.log'], //移除console.log
    //           },
    //         },
    //       }),
    //     ],
    //   };
    // }
  },
  devServer: {
    open: false,
    // port: "8080",
    proxy: proxyTable,
  },
  transpileDependencies: ['ant-design-vue'],
  lintOnSave: false,
};
