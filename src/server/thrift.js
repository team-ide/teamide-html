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
    invokeReports(param) {
        return http.post('api/thrift/invokeReports', param);
    },
    invokeStop(param) {
        return http.post('api/thrift/invokeStop', param);
    },
    invokeInfo(param) {
        return http.post('api/thrift/invokeInfo', param);
    },
    invokeReportDelete(param) {
        return http.post('api/thrift/invokeReportDelete', param);
    },
    invokeMetric(param) {
        return http.post('api/thrift/invokeMetric', param);
    },
    invokeMarkdown(param) {
        return http.post('api/thrift/invokeMarkdown', param);
    },
    close(param) {
        return http.post('api/thrift/close', param);
    },
};


export default thrift;