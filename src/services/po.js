import request from 'umi-request';

export const queryStatusStaic = () => request('/api/spitfire/order/query/init/status_staic');

export const fetchStatusEnums = () => request('/api/spitfire/order/query/status/enums');

export const queryPoList = params =>
  request('/api/spitfire/order/query/vendor/order', { method: 'POST', data: params });

export const deliver = params =>
  request('/api/spitfire/order/update/delivery/info', { method: 'POST', data: params });

export const confirmOrder = params =>
  request('/api/spitfire/order/update/order/confirm', { method: 'POST', data: params });

export const rejectOrder = params => request('/api/spitfire/order/update/order/reject', { params });

export const fetchPaymentInfo = params =>
  request('/api/spitfire/order/query/init/confirm_pay', { params });

export const paymentConfirm = params =>
  request('/api/spitfire/order/update/confirm/pay', { params });

export const queryPoDetail = params =>
  request('/api/spitfire/order/query/order/detail', { method: 'POST', data: params });
