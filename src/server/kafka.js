import http from '@/server/http';

let kafka = {
    test(param) {
        return http.post('api/kafka/test', param);
    },
    info(param) {
        return http.post('api/kafka/info', param);
    },
    topics(param) {
        return http.post('api/kafka/topics', param);
    },
    topic(param) {
        return http.post('api/kafka/topic', param);
    },
    commit(param) {
        return http.post('api/kafka/commit', param);
    },
    pull(param) {
        return http.post('api/kafka/pull', param);
    },
    push(param) {
        return http.post('api/kafka/push', param);
    },
    reset(param) {
        return http.post('api/kafka/reset', param);
    },
    deleteTopic(param) {
        return http.post('api/kafka/deleteTopic', param);
    },
    createTopic(param) {
        return http.post('api/kafka/createTopic', param);
    },
    createPartitions(param) {
        return http.post('api/kafka/createPartitions', param);
    },
    deleteRecords(param) {
        return http.post('api/kafka/deleteRecords', param);
    },
    close(param) {
        return http.post('api/kafka/close', param);
    },
    topicDescribe(param) {
        return http.post('api/kafka/topicDescribe', param);
    },
    group: {
        list(param) {
            return http.post('api/kafka/group/list', param);
        },
        describe(param) {
            return http.post('api/kafka/group/describe', param);
        },
        offsets(param) {
            return http.post('api/kafka/group/offsets', param);
        },
        deleteOffsets(param) {
            return http.post('api/kafka/group/deleteOffsets', param);
        },
        delete(param) {
            return http.post('api/kafka/group/delete', param);
        },
    },
};


export default kafka;