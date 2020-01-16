/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */

import request from '@common/utils/request';
// import config from '@common/config';

// const { mallHost } = config;
request.interceptors.response.use(async response => {
  const data = await response.clone().json();
  if (data.retCode === '0001007') {
    const { loginUri, appNo } = data.data;

    // 登录过期后，重新登录回到当前页面。
    window.location.href = `${loginUri}?appNo=${appNo}&redirectUrl=${window.location.href}`;
    // window.location.href = `${mallHost}/user/login?redirectUrl=${window.location.href}`;
  }
  return response;
});
export default request;
