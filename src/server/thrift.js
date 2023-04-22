import http from '@/server/http';

let thrift = {
    context(param) {
        return http.post('api/thrift/context', param);
    },
    getMethodArgFields(param) {
        return http.post('api/thrift/getMethodArgFields', param);
    },
    invokeByServerAddress(param) {
        return http.post('api/thrift/invokeByServerAddress', param);
    },
    close(param) {
        return http.post('api/thrift/close', param);
    },
};


export default thrift;