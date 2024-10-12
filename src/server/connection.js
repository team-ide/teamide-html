import http from '@/server/http';

let connection = {
    close(param) {
        return http.post('api/connection/close', param);
    },
    key(param) {
        return http.post('api/connection/key', param);
    },
    check(param) {
        return http.post('api/connection/check', param);
    },
    changeSetting(param) {
        return http.post('api/connection/changeSetting', param);
    },
};


export default connection;