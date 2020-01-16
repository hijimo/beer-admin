import request from 'umi-request';

export const queryRfqRecevied = params =>
  request('/api/spitfire/rfq/back/page/received', { params });

export const queryRfqQuote = params => request('/api/spitfire/rfq/back/page/quote', { params });

export const queryRfqDetail = params =>
  request('/api/spitfire/rfq/back/detail/received', { params });

export const queryRfqQuoteDetail = params =>
  request('/api/spitfire/rfq/back/detail/quote', { params });

export const fetchProductList = params => request('/api/spitfire/product/page/query', { params });

export const rfqQuote = params =>
  request('/api/spitfire/rfq/back/offer/insert', { method: 'POST', data: params });

export const checkRfqFlag = params => request('/api/spitfire/rfq/back/offer/flag', { params });
