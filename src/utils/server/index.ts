import axios, { AxiosRequestHeaders } from 'axios';
import { TIMEOUT } from './config';
import { showMessage } from './status'; // 引入状态码文件
import { ElMessage } from 'element-plus'; // 引入el 提示框，这个项目里用什么组件库这里引什么
import { getToken, isExist } from '../auth';

const instance = axios.create({
  baseURL: <string>import.meta.env.VITE_APP_BASE_API,
  timeout: TIMEOUT,
});

instance.interceptors.request.use(
  (config) => {
    // 如果存在 token 则附带在 http header 中
    if (isExist()) {
      (config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${getToken()}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      showMessage(response.status); // 传入响应码，匹配响应码对应信息
      return Promise.reject(response.data);
    } else {
      ElMessage.warning('网络连接异常,请稍后再试!');
    }
  },
);

export default instance;
