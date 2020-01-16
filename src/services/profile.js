import request from 'umi-request';

// 检查认证状态
export async function verifiedCheck() {
  return request('/api/spitfire/company/verified/check');
}

// 检查品质中国认证状态
export async function verifiedQChinaCheck() {
  return request('/api/spitfire/qualityChina/status/check');
}

// 提交供应商认证信息
export async function submitVerification(params) {
  return request('/api/spitfire/company/supplier_verification/submit', {
    method: 'POST',
    data: params,
  });
}

// 获取字典数据
export async function fetchDictList(keys) {
  return request('/api/anton/common/dict_list/query', {
    // method: 'POST',
    params: { keys },
  });
}

// 获取公司信息
export async function fetchLastCompany(params) {
  return request('/api/spitfire/company/last/apply/no/get', { params });
}

// 获取公司信息
export async function fetchCompany(params) {
  return request('/api/spitfire/company/detail/no/get', { params });
}

// 获取类目树数据
export async function queryCategoryTree() {
  return request('/api/spitfire/category/tree/query', {
    params: { toLevel: 2 },
  });
}

// 编辑主要信息
export async function editVerification(params) {
  return request('/api/spitfire/company/supplier_main/edit', {
    method: 'POST',
    data: params,
  });
}

// 编辑Profile
export async function editProfile(params) {
  return request('/api/spitfire/company/supplier_basic/edit', {
    method: 'POST',
    data: params,
  });
}

// 获取品质中国信息详情
export async function fetchQualityChina(params) {
  return request('/api/spitfire/qualityChina/detail/no/get', {
    params,
  });
}

// 编辑品质中国(无牌照)
export async function editQChinaWithoutLicense(params) {
  return request('/api/spitfire/qualityChina/without_license/submit', {
    method: 'POST',
    data: params,
  });
}

// 编辑品质中国(有牌照)
export async function editQChinaWithLicense(params) {
  return request('/api/spitfire/qualityChina/with_license/submit', {
    method: 'POST',
    data: params,
  });
}

// 获取国家列表
export async function fetchCountry(params) {
  return request('/api/anton/common/foreign_region_tree/query', {
    params,
  });
}

export async function fetchRegion(params) {
  return request('/api/anton/common/region_list/query', {
    method: 'GET',
    params,
  });
}

export async function fetchProfile(params) {
  return request('/api/profile', {
    method: 'GET',
    data: params,
  });
}
