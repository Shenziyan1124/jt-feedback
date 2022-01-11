import Vue from 'vue';
import router from './router';
import VueRouter from 'vue-router';
import store from './store';
import { keycloakDone } from './utils/keycloak';
import 'ant-design-vue/dist/antd.css';
import './theme.less'; // 用于覆盖上面定义的变量
import antd from 'ant-design-vue';
import jtIcon from './lib/jtIcon';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(jtIcon);
Vue.use(antd);

keycloakDone().finally(() => {
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
});
