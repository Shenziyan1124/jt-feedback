/**
 * axios默认参数配置文件
 */
import axios from 'axios';
import Vue from 'vue';
import { notification } from 'ant-design-vue';

// 线上环境关掉全局报错
const production = false;

export const Axios = axios.create({
  baseURL: '/', // 本地
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
      return location.reload();
    }

    if (!production ) {
      let description = '系统出错，请联系相应人员';
      if (err.response && err.response.data && typeof err.response.data == 'string') {
        description = err.response.data;
      }
      !production &&
        notification.error({
          message: '错误',
          description,
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
      if (!production && useError && res.data.errorCode) {
        notification.error({
          message: '错误',
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
      if (!production && useError && res.data.errorCode) {
        notification.error({
          message: '错误',
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
