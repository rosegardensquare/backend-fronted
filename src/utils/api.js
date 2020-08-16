import http from "./http";

let resquest = process.env.VUE_APP_BASEURL;


// get请求
export function xxx(params) {
  return http.get(`${resquest}/getList`, params);
}
// post请求
export function login(params) {
  return http.post(`/login`, params);
}
// put 请求
export function putSomeAPI(params) {
  return http.put(`${resquest}/putSome.json`, params);
}
// delete 请求
export function deleteListAPI(params) {
  return http.delete(`${resquest}/deleteList.json`, params);
}

export function logins(params) {
  return http.get(`/data/home.json`, params);
}
export function getUserList(params) {
  return http.get(`/data/user.json`, params);
}
export function getUserList1(params) {
  return http.get(`/data/user1.json`, params);
}







