import http from '@/server/http';

let datamove = {
    start(param) {
        return http.post('api/datamove/start', param);
    },
    stop(param) {
        return http.post('api/datamove/stop', param);
    },
    get(param) {
        return http.post('api/datamove/get', param);
    },
    delete(param) {
        return http.post('api/datamove/delete', param);
    },
    list(param) {
        return http.post('api/datamove/list', param);
    },
};


export default datamove;