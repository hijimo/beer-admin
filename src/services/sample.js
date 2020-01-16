import request from 'umi-request';

// 获取样品list
export const querySample = params =>
  request('/api/spitfire/sample/back/supplier/page/query', { params });

// 获取样品状态字典
export const fetchSampleStatusList = () => request('/api/spitfire/sample/back/enums/query');

// 确认订单
export async function confirmOrder(params) {
  return request('/api/spitfire/sample/back/info/confirm', {
    method: 'POST',
    data: params,
  });
}

// 拒绝订单
export const rejectOrder = params => request('/api/spitfire/sample/back/info/reject', { params });

// 支付确认
export const paymentConfirmation = params =>
  request('/api/spitfire/sample/back/pay/confirm', { params });

// 订单发货
export async function deliverOrder(params) {
  return request('/api/spitfire/sample/back/info/deliver', {
    method: 'POST',
    data: params,
  });
}

// 获取sample detail
export const fetchSampleDetail = params =>
  request('/api/spitfire/sample/back/info/detail', { params });
