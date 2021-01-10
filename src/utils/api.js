import http from "./http";

let resquest = process.env.VUE_APP_BASEURL;


export function xxx(params) {
  return http.get(`${resquest}/getList`, params);
}

export function login(params) {
  return http.post(`/login`, params);
}

export function loginkv(params) {
  return http.postkv(`/login`, params);
}
// put 请求
export function putSomeAPI(params) {
  return http.put(`data/putSome.json`, params);
}
// delete 请求
export function deleteListAPI(params) {
  return http.delete(`data/deleteList.json`, params);
}

export function getUserList(params) {
  return http.get(`/user/getUserPage`, params);
}
export function addUser(params) {
  return http.post(`/user/addUser`, params);
}
export function deleteUser(params) {
  return http.get(`/user/deleteUser`, params);
}

export function updateUserStatus(params) {
  return http.get(`/user/updateUserStatus`, params);
}

export function getMenuList(params) {
  return http.get(`/menu/getMenus`, params);
}

// sys
export function getSysUserList(params) {
  return http.get(`/sys/user/getUserPage`, params);
}
export function addSysUser(params) {
  return http.post(`/sys/user/addUser`, params);
}

export function deleteSysUser(params) {
  return http.get(`/sys/user/deleteUser`, params);
}

export function updateSysUserStatus(params) {
  return http.get(`/sys/user/updateUserStatus`, params);
}




