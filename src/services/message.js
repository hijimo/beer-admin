import request from 'umi-request';

export const queryMessage = params => request('/api/spitfire/common/msg_page/list', { params });

export const deleteMessage = params =>
  request('/api/spitfire/common/msg_list/delete', { method: 'POST', data: params });

export const readMessage = params =>
  request('/api/spitfire/common/msg_read/update', { method: 'POST', data: params });
