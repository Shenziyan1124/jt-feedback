/**
 * axios默认参数配置文件
 */
import axios from 'axios';
import Vue from 'vue';
import { notification } from 'ant-design-vue';
import { BrowserDetect } from './browserdetect';
// 线上环境关掉全局报错
const isDev = process.env.NODE_ENV === 'development';

//关闭H5页面的报错
const currentOs = BrowserDetect.init().OS;
const showDefaultError = currentOs === 'iPhone' || currentOs === 'Android' ? false : true;

export const Axios = axios.create({
  baseURL: isDev ? '/api' : '/', // 本地
  withCredentials: true, // set cross-origin
  headers: {
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err.response.status === 403 || err.response.status === 401) {
      // 经常容易导致重复跳转，所以先不要这个逻辑
      // return location.reload();
      return;
    }

    if (isDev && showDefaultError) {
      notification.error({
        message: '系统错误',
        description: err.response ? err.response.config.url : err,
      });
    }
    throw err;
  }
);

export function GET(url, params = {}, options = {}, paramsSerializerValue) {
  let paramsSerializerObj = {};
  if (paramsSerializerValue) {
    paramsSerializerObj = {
      paramsSerializer(params) {
        var yourNewParams = params[paramsSerializerValue]
          .map(function (_) {
            return `${paramsSerializerValue}=`.concat(_);
          })
          .join('&');
        return yourNewParams;
      },
    };
  }
  const { useError = true } = options;
  return new Promise((resolve, reject) => {
    Axios.get(
      url,
      {
        params,
        ...paramsSerializerObj,
      },
      { ...options }
    ).then((res) => {
      if (isDev && useError && res.data.errorCode && showDefaultError) {
        notification.error({
          message: '系统错误',
          description: res.data.errorMessage || '系统出错，请联系相应人员',
        });

        if (res.data.errorCode === '-500') {
          reject(res.data);
        }
      }
      resolve(res.data);
    });
  });
}

export function POST(url, data, options = {}, params = {}) {
  const { useError = true } = options;
  return new Promise((resolve, reject) => {
    Axios.post(url, data, params, { ...options }).then((res) => {
      if (isDev && useError && res.data.errorCode && showDefaultError) {
        notification.error({
          message: '系统错误',
          description: res.data.errorMessage || '系统出错，请联系相应人员',
        });
        if (res.data.errorCode === '-500') {
          reject(res.data);
        }
      }
      resolve(res.data);
    });
  });
}

Vue.prototype.$GET = GET;
Vue.prototype.$POST = POST;

export default { POST, GET };
