module.exports = {
  '/api': {
    target: 'http://172.31.197.101:32082/', // 信息港
    changeOrigin: true, //表示是否跨域
    logLevel: 'debug',
    pathRewrite: {
      '^/api/': '/',
    },
  },
};
