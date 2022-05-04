import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import util from 'util'

const errorStatusMsg = (status: number) => {
    let message = ''
    switch (status) {
        case 400:
            message = '请求错误(400)'
            break
        case 401:
            message = '未授权，请重新登录(401)'
            break
        case 403:
            message = '拒绝访问(403)'
            break
        case 404:
            message = '请求出错(404)'
            break
        case 408:
            message = '请求超时(408)'
            break
        case 500:
            message = '服务器错误(500)'
            break
        case 501:
            message = '服务未实现(501)'
            break
        case 502:
            message = '网络错误(502)'
            break
        case 503:
            message = '服务不可用(503)'
            break
        case 504:
            message = '网络超时(504)'
            break
        case 505:
            message = 'HTTP版本不受支持(505)'
            break
        default:
            message = `连接出错(${status})!`
    }
    return `${message}，请检查网络或联系管理员！`
}

const http = axios.create({
    // 联调
    // baseURL: process.env.NODE_ENV === 'production' ? `/` : '/api',
    baseURL: "/api/",
    // 是否跨站点访问控制请求
    withCredentials: true,
    timeout: 10 * 60 * 1000, // 10 * 60 * 1000
    validateStatus() {
        // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
        return true
    },

})

// 请求拦截器
http.interceptors.request.use((config: AxiosRequestConfig) => {
    //获取jwt，并将其添加至请求头中
    let jwt = util.getJWT()
    if (jwt) {
        config.headers.jwt = `${jwt}`;
    }
    return config
}, (error) => {
    // 错误抛到业务代码
    let response = {
        code: "-1",
        msg: '服务器异常，请检查网络或联系管理员！',
        error: error,
    };
    return response
})

// 响应拦截器
http.interceptors.response.use((axiosResponse: AxiosResponse) => {
    const status = axiosResponse.status
    let response = {
        code: "",
        msg: "",
        data: null
    };
    if (status < 200 || status >= 300) {
        // 处理http错误，抛到业务代码
        response = {
            code: "" + status,
            msg: errorStatusMsg(status),
            data: null,
        };
    } else {
        if (typeof axiosResponse.data === 'string') {
            response = {
                code: "0",
                msg: null,
                data: axiosResponse.data,
            };
        } else {
            response = axiosResponse.data
            if (response.code == null) {
                response.code = "0";
            }
        }
    }
    return response
}, (error) => {
    if (axios.isCancel(error)) {
        console.log('repeated request: ' + error.message)
    }
    let response = {
        code: "-1",
        msg: '请求超时或服务器异常，请检查网络或联系管理员！',
        error: error,
    };
    return response
})

export default http