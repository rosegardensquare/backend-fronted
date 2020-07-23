import axios from "axios";
import { Loading } from "element-ui";

// 保证只有一个loading实例(不然会有个坑，渲染多个loading)
let loading; // eslint-disable-line no-unused-vars
const instance = axios.create({
  baseURL: process.env.VUE_APP_URL, // api的base_url
  timeout: 15000, // 请求超时时间, 单位是 ms，
  headers: { "content-type": "application/json;charset=UTF-8" },
});

// 拦截请求
instance.interceptors.request.use(
  (config) => {
    //  可以在此处添加 token
    console.log("adaddadadadad:");
    // 请求头携带token

    // config.headers['AuthToken'] = 'your.token';
    // 保证每次都是最新的实例，这样，不管你页面一次调多少个接口，都只有一个loading（单例）
    loading = Loading.service({
      lock: true,
      text: "加载中",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 拦截响应
instance.interceptors.response.use((response) => {
  console.log("response : ", response);
  const { status, data } = response;
  if (Object.is(status, 200)) {
    loading.close();
    const { status } = data;
    if (Object.is(status, "success")) {
      console.log("data : ", data);
      console.log("Promise.resolve(data) : ", Promise.resolve(data));
      return Promise.resolve(data);
    }

    /*
      const { code, msg } = data;
      switch (code) {
        case 200:
          msg && console.log("msg --" + msg);
          console.log("data.data : " + data.data)
         return Promise.resolve(data.data);
        case 304:
          // 请求过期
          console.log('跳转到首页');
          break;
        case 500:
          return Promise.reject('失败了');
        default:
          return;
      }
    */

  }else {
    return Promise.reject(new Error());
  }

  // return response;
});
export default instance;
