import request from 'umi-request';

export async function fetchShowroom() {
  return request('/api/spitfire/company/showroom/get');
}

export async function saveShowroom(params) {
  return request('/api/spitfire/company/showroom/save', {
    method: 'POST',
    data: params,
  });
}
