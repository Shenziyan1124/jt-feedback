import { Icon } from 'ant-design-vue';

export default {
  // eslint-disable-next-line no-unused-vars
  install: (app, options) => {
    // Plugin code goes here
    // 注册iconfont
    const JtIcon = Icon.createFromIconfontCN({
      scriptUrl: '//at.alicdn.com/t/font_1758873_sa8nvi9jinm.js', // 在 iconfont.cn 上生成
    });
    app.component('JtIcon', JtIcon);
  },
};
