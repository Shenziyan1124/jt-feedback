// const path = require('path');
// const NODE_ENV = process.env.NODE_ENV;
// module.exports = {
//   // 根据不同的执行环境配置不同的入口
//   entry: NODE_ENV == 'development' ? './src/main.js' : './index.js',
//   output: {
//     path: path.resolve(__dirname, './dist'),
//     publicPath: '/dist/',
//     filename: 'feedback.js',
//     library: 'jt-feedback', // 指定的就是你使用require时的模块名
//     libraryTarget: 'umd', // 指定输出格式
//     umdNamedDefine: true, // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
//   },
// };
