import http from '@/server/http';

let zookeeper = {
    test(param) {
        return http.post('api/zookeeper/test', param);
    },
    info(param) {
        return http.post('api/zookeeper/info', param);
    },
    get(param) {
        return http.post('api/zookeeper/get', param);
    },
    save(param) {
        return http.post('api/zookeeper/save', param);
    },
    getChildren(param) {
        return http.post('api/zookeeper/getChildren', param);
    },
    delete(param) {
        return http.post('api/zookeeper/delete', param);
    },
    close(param) {
        return http.post('api/zookeeper/close', param);
    },
};


export default zookeeper;