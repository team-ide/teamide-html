import http from '@/server/http';

let maker = {
    close(param) {
        return http.post('api/maker/close', param);
    },
    loadContext(param) {
        return http.post('api/maker/context', param);
    },
};


export default maker;