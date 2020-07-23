import http from "./http";

let resquest = "/testIp/request/";

// get请求
export function xxx(params) {
  return http.get(`${resquest}/getList`, params);
}
// post请求
export function login(params) {
  return http.post(`/api/v1/attendances/test`, params);
}
// put 请求
export function putSomeAPI(params) {
  return http.put(`${resquest}/putSome.json`, params);
}
// delete 请求
export function deleteListAPI(params) {
  return http.delete(`${resquest}/deleteList.json`, params);
}
