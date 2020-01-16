import request from 'umi-request';

/**
 * 获取用户列表
 */
export async function getUserList(params) {
  return request('/api/hera/user/user_list/query', {
    method: 'POST',
    data: params,
  });
}

/**
 * 添加用户
 */
export async function addUser(params) {
  return request('/api/hera/user/add', {
    method: 'POST',
    data: params,
  });
}

/**
 * 删除用户
 */
export async function deleteUser(params) {
  return request('/api/hera/user/delete', {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取子用户信息
 */
export async function getChildrenInfo(params) {
  return request('/api/hera/user/sub_user_info/query', {
    method: 'GET',
    params,
  });
}

/**
 * 获取子用户信息
 */
export async function updateUserStatus(params) {
  return request('/api/hera/user/user_status/update', {
    method: 'POST',
    data: params,
  });
}
