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
    remove(param) {
        return http.post('api/maker/remove', param);
    },
    rename(param) {
        return http.post('api/maker/rename', param);
    },
    gen(param) {
        return http.post('api/maker/gen', param);
    },
    invoke(param) {
        return http.post('api/maker/invoke', param);
    },
};


export default maker;