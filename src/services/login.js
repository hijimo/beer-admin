import request from 'umi-request';

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function login(data) {
  return request('/api/anton/user/login', {
    method: 'POST',
    data,
  });
}

export async function logout() {
  return request('/api/spitfire/user/logout');
}
