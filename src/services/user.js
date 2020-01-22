import request from '@/utils/request';
import qs from 'qs';


export async function login(data) {
  return request('/login', {
    method: 'POST',
    data: qs.stringify(data),
    
  });
}
export async function logout(userId) {
  return request(`/logout/${userId}`);
}
export async function deleteUserById(userId) {
  return request(`/user/${userId}`, {
    method:'DELETE'
  });
}

export async function postAddUser(data) {
  return request('/user', {
    method:'POST',
    data:qs.stringify(data)
  });
}


export async function putEditUser(data) {
  return request('/user', {
    method:'PUT',
    data:qs.stringify(data)
  });
}

export async function putResetPwd(data) {
  return request('/user/password/reset', {
    method:'PUT',
    data:qs.stringify(data)
  });
}
export async function putEditPwd(data) {
  return request('/user/password', {
    method:'PUT',
    data:qs.stringify(data)
  });
}




export async function getUserList(params) {
  return request('/user', {
    params
  });
}

export async function getCurrentUser(username) {
  return request(`/user/${username}`);
}
export async function queryNotices() {
  return request('/api/notices');
}
