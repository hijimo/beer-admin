import request from '@/utils/request';

const modul = '/price';

export function getDetail(id) {
  return request(modul + `/detail/${id}`);
}
export function getList(params) {
  return request(modul, { params });
}
export function postCreate(data) {
  return request(modul, {
    method: 'POST',
    data,
  });
}
export function putUpdate(data) {
  return request(modul, {
    method: 'PUT',
    data,
  });
}
export function deleteByIds(ids) {
  return request(`${modul}/${ids}`, {
    method: 'DELETE',
  });
}
