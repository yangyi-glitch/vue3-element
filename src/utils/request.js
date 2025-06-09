import axios from 'axios'

const baseURL = '/api';
const instance = axios.create({baseURL})

//  请求拦截器：在发送请求前设置 headers
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    err => {
        alert('请求异常');
        return Promise.reject(err);
    }
);

//  响应拦截器：在接收到响应数据并返回给调用者前对数据进行处理
instance.interceptors.response.use(
    result => {
        result.headers['Authorization'] = localStorage.getItem('token');
        return result.data;
    },
    err => {
        alert('服务异常');
        return Promise.reject(err);
    }
)
export default instance;
