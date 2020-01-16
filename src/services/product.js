import request from 'umi-request';

export const poductSubmit = data =>
  request('/api/spitfire/product/save_and_submit', {
    method: 'post',
    data,
  });

export const poductSave = data =>
  request('/api/spitfire/product/save', {
    method: 'post',
    data,
  });

export function fetchProductList(params) {
  return request('/api/spitfire/product/page/query', { params });
}

export function upadateSaleStatus(data) {
  return request('/api/spitfire/product/sale_status/update', {
    method: 'POST',
    data,
  });
}

export function deleteProduct(data) {
  return request('/api/spitfire/product/delete', {
    method: 'POST',
    data,
  });
}

export function queryProductDetail(data) {
  return request('/api/spitfire/product/detail/query', {
    method: 'get',
    params: data,
  });
}

export function fetchCategoryGroup(params) {
  return request('/api/spitfire/group/tree/query', { params });
}

export function addGroupLeaf(params) {
  return request('/api/spitfire/group/add', {
    method: 'POST',
    data: params,
  });
}

export function rmGroupLeaf(params) {
  return request('/api/spitfire/group/delete', {
    method: 'POST',
    data: params,
  });
}

export function updateGroupLeaf(params) {
  return request('/api/spitfire/group/update', {
    method: 'POST',
    data: params,
  });
}

export function queryProductGroup(params) {
  return request('/api/spitfire/group/tree/query', { params });
}

export const queryStatistics = () => request('/api/spitfire/product/statistics/query');
