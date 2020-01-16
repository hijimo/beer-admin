import request from 'umi-request';

// My Expo-获取我参展的商博会
export async function queryExpo(params) {
  return request('/api/back/expo/my_expo/query_all', {
    method: 'POST',
    data: params,
  });
}

// Application-获取我申请参展的商博会
export async function queryApplication(params) {
  return request('/api/back/expo/my_apply_expo/query_all', {
    method: 'POST',
    data: params,
  });
}

// Expo Products-获取参展商品-分页
export async function queryExpoProduct(params) {
  return request('/api/back/expo/goods/query_all', {
    method: 'POST',
    data: params,
  });
}

// Expo Products-重新申请商博会
export async function reApplyExpo(params) {
  return request('/api/back/expo/re_apply_expo', {
    method: 'POST',
    data: params,
  });
}

// Expo Products-Add-获取商品-分页
export async function queryProduct(params) {
  return request('/api/back/expo/queryActivityRegProductPage', {
    method: 'POST',
    data: params,
  });
}

// Expo Products-Add-搜索未结束的商博会
export async function queryExpoUnClose() {
  return request('/api/back/expo/my_expo/query_audit_success');
}

// Expo Products-Add-获取参展商品ID列表
export async function queryExpoGoodsIds(params) {
  return request('/api/back/expo/goods/ids_list', {
    params,
  });
}

// Expo Products-Add-添加商品
export async function addGoods(params) {
  return request('/api/back/expo/goods/insert_batch', {
    method: 'POST',
    data: params,
  });
}

// Expo Products-删除商品
export async function deleteGoods(params) {
  return request('/api/back/expo/goods/remove_batch', {
    method: 'POST',
    data: params,
  });
}
