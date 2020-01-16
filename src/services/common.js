import request from 'umi-request';

export async function fetchCategory(params) {
  return request('/api/spitfire/category/tree/query', {
    method: 'GET',
    params,
  });
}

export async function uploadFile(params) {
  const formData = new FormData();
  formData.append('file', params.file);
  return request('https://buyer.test.yeeorder.com.cn/api/file/upload', {
    method: 'POST',
    // data: params,
    body: formData,
  });
}

export async function queryDict(params) {
  return request('/api/spitfire/common/dict_list/query', {
    method: 'GET',
    params,
  });
}

export async function queryCategoryAttribute(params) {
  return request('/api/spitfire/product/attribute_info/query', {
    method: 'GET',
    params,
  });
}

export async function addCategoryAttributeOption(params) {
  return request('/api/spitfire/product/option/add', {
    method: 'POST',
    data: params,
  });
}

export async function queryAddress(params) {
  return request('/api/anton/common/nation_region_tree/query', {
    method: 'GET',
    params,
  });
}

export async function queryAddressLeaf(params) {
  return request('/api/anton/common/region_list/query', {
    method: 'GET',
    params,
  });
}

export const queryCountry = params =>
  request('/api/anton/common/foreign_region_tree/query', { params });

export const queryNotice = () => request('/api/spitfire/common/msg_unread_num/count');
