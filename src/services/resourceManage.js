import request from 'umi-request';

/**
 * 获取当前用户的资源
 */
export async function getUserResource(params) {
  return request('/api/hera/resource/role_resource/query', {
    method: 'GET',
    params,
  });
}
