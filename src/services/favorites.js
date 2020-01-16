import request from 'umi-request';

export const queryProducts = params => request('/api/spitfire/product_fav/page/query', { params });

export const queryBuyers = params =>
  request('/api/spitfire/company/favorite/page/list', { params });

export const deleteFavoritePro = params =>
  request('/api/spitfire/product_fav/batch_remove', { method: 'POST', data: params });

export const deleteFavoriteBuyer = params =>
  request('/api/spitfire/company/favorite/delete', { method: 'POST', data: params });
