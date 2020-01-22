import { get, set, clear } from '@common/utils/ls';


export const clearLocalStorage = ()=> {
  clear()
}


export const setToken = ( val) =>{
  set('USER_TOKEN', val)
}
export const getToken = () =>get('USER_TOKEN')

export const setExpireTime = ( val) =>{
  set('EXPIRE_TIME', val)
}
export const getExpireTime = () =>get('EXPIRE_TIME')

export const  setUser = ( val)=> {
  set('USER', val) 
}


export const  getUser = ( )=> get('USER' ) 

export const setPermissions =( val) =>{
  set('PERMISSIONS', val) 
}
export const getPermissions =( ) =>get('PERMISSIONS') 

export const setRoles =( val) =>{
  set('ROLES', val)
}
export const getRoles =( ) =>get('ROLES')
export const setUserInfo  = (data)=> {
  setToken(data.token);
  setExpireTime(data.exipreTime);
  setUser(data.user);
  setPermissions(data.permissions);
  setRoles(data.roles);
}