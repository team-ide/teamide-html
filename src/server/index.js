import http from '@/server/http';

import toolbox from "./toolbox.js";
import node from "./node.js";
import fileManager from "./fileManager.js";
import terminal from "./terminal.js";
import user from "./user.js";

import database from "./database.js";
import elasticsearch from "./elasticsearch.js";
import kafka from "./kafka.js";
import zookeeper from "./zookeeper.js";
import redis from "./redis.js";

import log from "./log.js";
import power from "./power.js";
import thrift from "./thrift.js";
import datamove from "./datamove.js";
import mongodb from "./mongodb.js";
import connection from "./connection.js";
import maker from "./maker.js";

import tool from '../tool/index.js';
import source from '../source/index.js';
let server = {
    toolbox,
    node,
    fileManager,
    terminal,
    user,
    database,
    elasticsearch,
    kafka,
    zookeeper,
    redis,
    log,
    power,
    thrift,
    datamove,
    mongodb,
    connection,
    maker,
    data(param) {
        param = param || {};
        param.origin = location.origin;
        param.pathname = location.pathname;
        return http.post('api/data', param,);
    },
    session(param) {
        return http.post('api/session', param);
    },
    showPlaintext(param) {
        return http.post('api/showPlaintext', param);
    },
    login(param) {
        return http.post('api/login', param,);
    },
    logout(param) {
        return http.post('api/logout', param,);
    },
    register(param) {
        return http.post('api/register', param,);
    },
    upload(param) {
        return http.post('api/upload', param, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    download(param) {
        return http.post('api/download', param, { responseType: "blob" });
    },
    updateCheck(param) {
        return http.post('api/updateCheck', param,);
    },
    listen(param) {
        return http.post('api/listen', param || {},);
    },
    addListenOnEvent(event, call) {
        if (call == null) { return }
        listenOnEventList[event] = listenOnEventList[event] || []
        listenOnEventList[event].push(call)
    },
    removeListenOnEvent(event, call) {
        if (call == null) { return }
        let list = listenOnEventList[event] || []
        let newList = [];
        list.forEach(one => {
            if (one != call) {
                newList.push(one)
            }
        })
        listenOnEventList[event] = newList
    },
    setting: {
        save(param) {
            return http.post('api/setting/save', param || {},);
        },
    },
    javascript: {
        getModules(param) {
            return http.post('api/javascript/getModules', param || {},);
        },
        run(param) {
            return http.post('api/javascript/run', param || {},);
        },
        load(param) {
            return http.post('api/javascript/load', param || {},);
        },
    },
    tools: {
        base64(param) {
            return http.post('api/tools/base64', param || {},);
        },
        urlEncode(param) {
            return http.post('api/tools/urlEncode', param || {},);
        },
        md5(param) {
            return http.post('api/tools/md5', param || {},);
        },
        fileSearch(param) {
            return http.post('api/tools/fileSearch', param || {},);
        },
    },
    sync: {
        checkFile(param) {
            return http.post('api/sync/checkFile', param || {},);
        },
        importFile(param) {
            return http.post('api/sync/importFile', param || {},);
        },
    },
    http: {
        execute(param) {
            return http.post('api/http/execute', param || {},);
        },
        history(param) {
            return http.post('api/http/history', param || {},);
        },
        getExecute(param) {
            return http.post('api/http/getExecute', param || {},);
        },
        deleteExecute(param) {
            return http.post('api/http/deleteExecute', param || {},);
        },
        close(param) {
            return http.post('api/http/close', param || {},);
        },
    },
    serial: {
        close(param) {
            return http.post('api/serial/close', param);
        },
        key(param) {
            return http.post('api/serial/key', param);
        },
        check(param) {
            return http.post('api/serial/check', param);
        },
    },
};
var listenStartInt = false
const listenStart = async (errorCount) => {
    if (listenStartInt) {
        return
    }
    listenStartInt = true
    var isError = false
    var isDataError = false
    try {
        let res = await server.listen({})
        if (res.code != 0) {
            isDataError = true
        } else {
            let data = res.data || {}
            let events = data.events || []
            try {
                listenOnEvents(events)
            } catch (error) {

            }
        }
    } catch (error) {
        isError = true
    }
    if (isError || isDataError) {
        errorCount = errorCount || 0
        errorCount++
        window.setTimeout(() => {
            listenStartInt = false
            listenStart(errorCount)
        }, errorCount * 1000 * 5)
    } else {
        listenStartInt = false
        listenStart()
    }
}
server.listenStart = listenStart;

const listenOnEventList = {}
const getListenOnEventList = (event) => {
    return listenOnEventList[event] || []
}

const listenOnEvents = (events) => {
    events = events || []
    events.forEach(event => {
        event = event || {}
        let list = getListenOnEventList(event.event,)
        list.forEach(one => {
            if (one == null) { return }
            one(event.data)
        })
    })
}

export default server;