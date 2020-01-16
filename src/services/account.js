import request from 'umi-request';

// 获取个人信息
export async function fetchUserInfo() {
  return request('/api/anton/user/my_user_info/query');
}

// 更新头像
export async function updateUserPhoto(data) {
  return request('/api/hera/user/user_photo/update', {
    method: 'POST',
    data,
  });
}

// 更新电话号码
export async function updateUserPhone(data) {
  return request('/api/hera/user/user_mobile/update', {
    method: 'POST',
    data,
  });
}

// 更新用户姓名
export async function updateUserName(data) {
  return request('/api/hera/user/user_name/update', {
    method: 'POST',
    data,
  });
}

// 更新email
export async function updateUserEmail(data) {
  return request('/api/hera/user/email/update', {
    method: 'POST',
    data,
  });
}

// 更新密码
export async function updateUserPassword(data) {
  return request('/api/hera/user/password/update', {
    method: 'POST',
    data,
  });
}

/** 发送邮件验证码 */
export async function emailVerifyCode(data) {
  return request('/api/hera/user/email_verify_code/send', {
    method: 'POST',
    data,
  });
}

/** 发送手机验证码 */
export async function mobileVerifyCode(data) {
  return request('/api/hera/user/mobile_verify_code/send', {
    method: 'POST',
    data,
  });
}
