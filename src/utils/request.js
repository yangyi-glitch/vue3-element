import axios from 'axios'
import {useRouter} from "vue-router";
const baseURL = '/api';
const instance = axios.create({baseURL})
const router = useRouter();

//  请求拦截器：在发送请求前设置 headers
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Token'] = `${token}`;
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

    },
    err => {
        const { status } = err.response || {};
        if (status === 401) {
            console.log("errorororor",err.response)
            // 清除 token 或用户信息
            // localStorage.removeItem('token'); // 假设你使用 localStorage 存储 token

            // 跳转到登录页
            router.push("Login"); // 使用路由名称跳转
        }
        alert('服务异常');
        return Promise.reject(err);
    }
)
export default instance;
