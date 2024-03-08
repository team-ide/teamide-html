import http from '@/server/http';

let mongodb = {
    check(param) {
        return http.post('api/mongodb/check', param);
    },
    info(param) {
        return http.post('api/mongodb/info', param);
    },
    close(param) {
        return http.post('api/mongodb/close', param);
    },
    database: {
        list(param) {
            return http.post('api/mongodb/database/list', param);
        },
        delete(param) {
            return http.post('api/mongodb/database/delete', param);
        },
        dataTrim(param) {
            return http.post('api/mongodb/database/dataTrim', param);
        },

    },
    collection: {
        list(param) {
            return http.post('api/mongodb/collection/list', param);
        },
        delete(param) {
            return http.post('api/mongodb/collection/delete', param);
        },
        create(param) {
            return http.post('api/mongodb/collection/create', param);
        },
        dataTrim(param) {
            return http.post('api/mongodb/collection/dataTrim', param);
        },
    },
    index: {
        list(param) {
            return http.post('api/mongodb/index/list', param);
        },
        delete(param) {
            return http.post('api/mongodb/index/delete', param);
        },
        create(param) {
            return http.post('api/mongodb/index/create', param);
        },
    },
    insert(param) {
        return http.post('api/mongodb/insert', param);
    },
    update(param) {
        return http.post('api/mongodb/update', param);
    },
    delete(param) {
        return http.post('api/mongodb/delete', param);
    },
    deleteById(param) {
        return http.post('api/mongodb/deleteById', param);
    },
    queryPage(param) {
        return http.post('api/mongodb/queryPage', param);
    },
};


export default mongodb;