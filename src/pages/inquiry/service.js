import request from 'umi-request';

export const queryInquiryData = params => request('/api/spitfire/contact/page/list', { params });

export const fetchInquiryDetail = params =>
  request('/api/spitfire/contact/query/detail', { params });

export const fetchDialogue = params =>
  request('/api/spitfire/contact/query/info/detail', { params });

export const sendMessage = params =>
  request('/api/spitfire/contact/insert/info/detail', {
    method: 'POST',
    data: params,
  });
