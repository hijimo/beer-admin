import request from 'umi-request';

/**
 * 获取应用列表
 */
export async function getRoleList(params) {
  return request('/api/hera/role/role_list/query', {
    method: 'POST',
    data: params,
  });
}

/**
 * 添加角色
 */
export async function addRole(params) {
  return request('/api/hera/role/add', {
    method: 'POST',
    data: params,
  });
}

/**
 * 删除角色
 */
export async function deleteRole(params) {
  return request('/api/hera/role/delete', {
    method: 'POST',
    data: params,
  });
}
/**
 * 删除角色
 */
export async function updateStatus(params) {
  return request('/api/hera/role/role_status/update', {
    method: 'GET',
    params,
  });
}

/**
 * 获取角色信息
 */
export async function getRoleInfo(params) {
  return request('/api/hera/role/role_info/query', {
    method: 'GET',
    params,
  });
}

/**
 * 获取用户所有角色信息
 */
export async function getUserRoleList(params) {
  return request('/api/hera/role/user_role/query', {
    method: 'GET',
    params,
  });
}
