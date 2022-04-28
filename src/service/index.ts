import http from './http'
import util from 'util'
import { Source, Session } from 'type'


/**
 * @description formatSourceData
 */
let formatSourceData = (source: Source, data: Source) => {
    if (data != null) {
        source.api = data.api;
        source.filesUrl = data.filesUrl;

        source.columnTypes = data.columnTypes;
        source.dataTypes = data.dataTypes;
        source.indexTypes = data.indexTypes;
        source.modelTypes = data.modelTypes;
        source.dataPlaces = data.dataPlaces;
        source.databaseTypes = data.databaseTypes;
        source.sqlConditionalOperations = data.sqlConditionalOperations;

        // source.toolboxTypes = data.toolboxTypes;
    } else {
        source.status = "error";
        source.ready = false;
    }
}

/**
 * @description formatSourceSession
 */
let formatSourceSession = (source: Source, sessionData: string) => {

    let session: Session
    if (util.isNotEmpty(sessionData)) {
        try {
            sessionData = util.aesDecrypt(sessionData);
            session = JSON.parse(sessionData)
        } catch (error) {
            session = null;
        }
    }
    if (session != null) {
        source.session.user = session.user;
        source.session.powers = session.powers || [];
        source.session.JWT = session.JWT;
        util.setJWT(session.JWT);
    } else {
        source.session.user = null;
        source.session.powers = [];
    }
    refreshPowers(source);

    source.status = "connected";
    source.ready = true;
}

let refreshPowers = (source: Source) => {
}

// sessionLoadding
var sessionLoadding = false;

/**
 * @description refreshSession
 */
let refreshSession = async (loadSession: Function) => {
    if (sessionLoadding) {
        return
    }
    sessionLoadding = true
    await loadSession();
    sessionLoadding = false
    setTimeout(() => {
        refreshSession(loadSession);
    }, 1000 * 60 * 10);
}


/**
 * @description Service基础接口
 */
export class Service {
    /**
     * @description 初始化服务信息
     * 
     * @param source 数据源
     */
    static async initServer(source: Source) {
        await this.data(source)
        await this.session(source)
    }

    /**
     * @description 查询服务器信息
     * 
     * @param source 数据源
     */
    static async data(source: Source) {
        let params = {
            origin: location.origin,
            pathname: location.pathname,
        };
        let response = await http.post('data', params)
        formatSourceData(source, response.data)
    }

    /**
     * @description 查询会话信息
     * 
     * @param source 数据源
     */
    static async session(source: Source) {
        let params: {};
        let response = await http.post('session', params)
        formatSourceSession(source, response.data)
    }

}