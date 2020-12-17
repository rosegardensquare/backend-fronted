/****   http.js   ****/
// 导入封装好的axios实例
import instance from "./request";

const http = {
  /**
   * methods: 请求
   * @param url 请求地址
   * @param params 请求参数
   */
  get(url, params) {
    const config = {
      method: "get",
      url: url,
    };
    if (params) config.params = params;
    return instance(config);
  },
  post(url, params) {
    const config = {
      method: "post",
      url: url,
    };
    if (params) config.data = params;
    return instance(config);
  },
  postkv(url, params) {
    const config = {
      method: "post",
      url: url,
    };
    let ret = '';
    for (let i in params) {
      ret += encodeURIComponent(i) + '=' + encodeURIComponent(params[i]) + '&'
    }
    console.log("---------ret--------", ret);
    if (ret) config.data = ret;
    return instance(config);
  },
  put(url, params) {
    const config = {
      method: "put",
      url: url,
    };
    if (params) config.params = params;
    return instance(config);
  },
  delete(url, params) {
    const config = {
      method: "delete",
      url: url,
    };
    if (params) config.params = params;
    return instance(config);
  },
};
//导出
export default http;
