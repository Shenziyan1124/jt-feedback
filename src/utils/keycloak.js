/**
 * keycloak配置文件
 * @module Axios 封装后的axios模块，这里指向axios.create后的对象
 * @module configJson 配置文件
 * @module keycloak keycloak模块
 */
import Vue from 'vue';
import { Axios } from '@/request/axios';
import config from '../config';
const Keycloak = require('keycloak-js');

export function getKeycloakUrl() {
  const keycloakUrl = document.getElementsByTagName('body')[0].getAttribute('keycloakurl') || config.keycloakUrl;
  return keycloakUrl;
}

const initOptions = {
  onLoad: 'login-required',
  realm: 'TechnicalMiddlePlatform',
  url: getKeycloakUrl(),
  clientId: 'dlp-train-front',
  'ssl-required': 'external',
  resource: 'dlp-train-front',
  'public-client': true,
  'confidential-port': 0,
};
var keycloak = Keycloak(initOptions);
Vue.prototype.$keycloak = keycloak;
window.$keycloak = keycloak;
Vue.prototype.$preview_auth = () => keycloak.authenticated && keycloak.idTokenParsed.DLP_USER_ALLOW_PREVIEW_FEATURE == '1';
Vue.prototype.$UPGRADING = () => !keycloak.authenticated || (keycloak.authenticated && keycloak.idTokenParsed.DLP_USER_ALLOW_ENTER_DURING_UPGRADING == '1');

/**
 * 使用export将keycloakDone方法暴露出去，return一个promise对象
 *
 * 这样在引用处就可以使用import()配合.then的方法在下面的else处执行想要执行的代码
 * 防止有接口返回时出现异步的错误
 * @returns promise
 */
export function keycloakDone() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false, // 检测登陆状态
    });
    if (!authenticated) {
      // window.location.reload();
      reject();
    } else {
      Axios.interceptors.request.use((config) => {
        config.headers.Authorization = 'Bearer ' + keycloak.token;
        return config;
      });
      resolve();
    }
    // 检测token是否刷新
    setInterval(() => {
      keycloak.updateToken();
    }, 60000);
  });
}
