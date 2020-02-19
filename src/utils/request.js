/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */

import request from '@common/utils/request';
import qs from 'qs';
import { Modal } from 'antd';
import moment from 'moment';
import { clearLocalStorage, getExpireTime, getToken } from './ls';
// import config from '@common/config';

// const { mallHost } = config;

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? // ? 'http://47.111.80.10:9527'
      // 'http://45.40.205.143:9527/'
      'http://118.31.74.75:9527/'
    : //  : 'http://45.40.205.143:9527/',
      // 'http://127.0.0.1:9527';
      'http://118.31.74.75:9527';

const listInFormEncode = ['/user/password/reset', '/login', '/user', '/user/password'];

request.interceptors.request.use((url, options) => {
  const now = parseInt(moment().format('YYYYMMDDHHmmss'));
  const expireTime = getExpireTime() || now;

  if (now - expireTime >= -10 && url !== '/login') {
    Modal.error({
      title: '登录已过期',
      content: '很抱歉，登录已过期，请重新登录',
      okText: '重新登录',
      mask: false,
      onOk: () => {
        return new Promise((resolve, reject) => {
          clearLocalStorage();
          location = '/user/login';
        });
      },
    });
  }

  const token = getToken();

  const headers = {
    'Content-Type': listInFormEncode.includes(url)
      ? 'application/x-www-form-urlencoded'
      : 'application/json',
    Authentication: token || '',
  };
  return {
    url: `${baseUrl}${url}`,
    options: {
      ...options,
      headers,
    },
  };
});

export default request;
