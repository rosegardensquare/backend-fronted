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
  return http.get(`/sys/permission/getMenus`, params);
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


// Role 
export function getSysRoleList(params) {
  return http.get(`/sys/role/getRolePage`, params);
}
export function addSysRole(params) {
  return http.post(`/sys/role/addRole`, params);
}

export function deleteSysRole(params) {
  return http.get(`/sys/role/deleteRole`, params);
}

export function updateSysRoleStatus(params) {
  return http.get(`/sys/role/updateRoleStatus`, params);
}


// Permis
export function getSysPermiList(params) {
  return http.get(`/sys/permission/getPermiPage`, params);
}

export function getMenusByParentId(params) {
  return http.get(`/sys/permission/getMenusByParentId`, params);
}
export function getRoles(params) {
  return http.get(`/sys/role/getRoles`, params);
}
export function addPermi(params) {
  return http.post(`/sys/permission/addPermi`, params);
}

// upload
export function uploadPic(params) {
  return http.post(`/pic/upload`, params);
}


