import axios from "axios";
import { Loading } from "element-ui";

// 保证只有一个loading实例(不然会有个坑，渲染多个loading)

let loading;
function openLoading() {
  loading = Loading.service({
    lock: true,
    text: "加载中",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  setTimeout(function () {
    // 设定定时器，超时2S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
    loading.close(); // 关闭遮罩层
  }, 2000);
  return loading;
}

function endLoading() {
  loading.close();
}

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, //基础路径,.env.development
  timeout: 15000, // 请求超时时间, 单位是 ms，
  // headers: { "content-type": "application/json;charset=UTF-8" },
});

// 拦截请求
instance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    if (config.isFormData) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    }
    // 请求头携带token

    // config.headers['AuthToken'] = 'your.token';
    // 保证每次都是最新的实例，这样，不管你页面一次调多少个接口，都只有一个loading（单例）
    openLoading();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 拦截响应
instance.interceptors.response.use((response) => {
  const { status, data } = response;
  if (Object.is(status, 200)) {
    endLoading();
    return Promise.resolve(data);
  } else {
    // return Promise.reject(new Error());
    return Promise.reject("失败了");
  }

  // return response;
});
export default instance;
