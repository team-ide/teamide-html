import http from '@/server/http';

let maker = {
    close(param) {
        return http.post('api/maker/close', param);
    },
    loadContext(param) {
        return http.post('api/maker/context', param);
    },
    get(param) {
        return http.post('api/maker/get', param);
    },
    getList(param) {
        return http.post('api/maker/getList', param);
    },
    save(param) {
        return http.post('api/maker/save', param);
    },
    insert(param) {
        return http.post('api/maker/insert', param);
    },
    delete(param) {
        return http.post('api/maker/delete', param);
    },
};


export default maker;