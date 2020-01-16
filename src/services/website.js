import request from 'umi-request';

// 获取首页页面装修数据
export async function fetchWebsitDetail(params) {
  return request('/api/back/page/home/widget_data/query', {
    method: 'POST',
    data: params,
  });
}

export async function fetchWebsiteInfo(params) {
  return request('/api/back/page/home/query', {
    method: 'POST',
    data: params,
  });
}

// 保存页面装修
export async function websiteSave(data) {
  return request('/api/back/page/widget_data/save', {
    method: 'POST',
    data,
  });
}

// 页面提交审核
export async function websiteSubmit(data) {
  return request('/api/back/page/widget_data/submit', {
    method: 'POST',
    data,
  });
}
