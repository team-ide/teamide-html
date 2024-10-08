import http from '@/server/http';

let terminal = {
    close(param) {
        return http.post('api/terminal/close', param);
    },
    key(param) {
        return http.post('api/terminal/key', param);
    },
    check(param) {
        return http.post('api/terminal/check', param);
    },
    changeSize(param) {
        return http.post('api/terminal/changeSize', param);
    },
    getLogs(param) {
        return http.post('api/terminal/getLogs', param);
    },
    deleteLog(param) {
        return http.post('api/terminal/deleteLog', param);
    },
    cleanLog(param) {
        return http.post('api/terminal/cleanLog', param);
    },
    upload(param) {
        return http.post('api/terminal/upload', param);
    },
    downloadLog(param) {
        return http.post('api/terminal/downloadLog', param);
    },
    system: {
        monitor(param) {
            return http.post('api/terminal/system/monitor', param);
        },
        info(param) {
            return http.post('api/terminal/system/info', param);
        },
    },
    command: {
        save(param) {
            return http.post('api/terminal/command/save', param);
        },
        query(param) {
            return http.post('api/terminal/command/query', param);
        },
        count(param) {
            return http.post('api/terminal/command/count', param);
        },
        delete(param) {
            return http.post('api/terminal/command/delete', param);
        },
        clean(param) {
            return http.post('api/terminal/command/clean', param);
        },
    },
};


export default terminal;