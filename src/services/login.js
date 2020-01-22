import request from 'umi-request';



export async function login(data) {
  return request('login', {
    method: 'POST',
    data,
  });
}

export async function logout(userId) {
  return request(`logout/${userId}`);
}
