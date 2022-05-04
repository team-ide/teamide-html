import http from './http'
import util from 'util'
import { Source, Toolbox, HttpResponse } from 'type'
import { Service } from 'service'

/**
 * @description ToolboxService 工具箱接口
 */
export class ToolboxService {

    /**
     * @description 初始化服务信息
     * 
     * @param source 数据源
     */
    static async init(source: Source) {
        if (source.toolbox != null) {
            return
        }
        if (source.toolboxLoading) {
            return
        }
        let startTime = new Date().getTime()
        source.toolboxLoading = true;

        try {

            let responseData = await this.load()
            if (responseData.code != 0) {
                throw new Error(responseData.msg || responseData.error.message)
            }

            let responseContext = await this.loadContext()
            if (responseContext.code != 0) {
                throw new Error(responseContext.msg || responseContext.error.message)
            }

            let responsOpens = await this.queryOpens()
            if (responsOpens.code != 0) {
                throw new Error(responsOpens.msg || responsOpens.error.message)
            }
            let toolbox: Toolbox = {
                types: responseData.data.types || [],
                sqlConditionalOperations: responseData.data.sqlConditionalOperations || [],
                context: responseContext.data.context || {},
                opens: responsOpens.data.opens || {},
            }

            let endTime = new Date().getTime()
            let waitTime = 500 - (endTime - startTime)
            if (waitTime > 0) {
                await Service.sleep(waitTime)
            }
            source.toolbox = toolbox;
        } catch (error) {
            source.toolboxError = error;
        }
        source.toolboxLoading = false;
    }

    /**
     * @description 查询服务器信息
     * 
     * @param source 数据源
     * @param toolboxId 数据源
     */
    static getModel(source: any, toolboxId: any) {
        let res = null;
        if (!toolboxId) {
            return res
        }
        let context = source.toolbox.context;
        for (let type in context) {
            if (context[type] == null) {
                continue;
            }
            context[type].forEach((one: any) => {
                if (
                    one == toolboxId ||
                    one.toolboxId == toolboxId ||
                    one.toolboxId == toolboxId.toolboxId
                ) {
                    res = one;
                }
            });
        }
        return res;
    }

    /**
     * @description 查询服务器信息
     * 
     * @param source 数据源
     * @param type 数据源
     */
    static getType(source: any, type: any) {
        let res = null;
        if (!type) {
            return res
        }
        source.toolbox.types.forEach((one: any) => {
            if (one == type || one.name == type || one.name == type.name) {
                res = one;
            }
        });
        return res;
    }
    /**
     * @description 查询服务器信息
     * 
     */
    static async load() {
        let params = {
        };
        let response: HttpResponse<any> = await http.post('toolbox', params)
        return response;
    }

    /**
     * @description 查询服务器信息
     * 
     */
    static async loadContext() {
        let params = {
        };
        let response: HttpResponse<any> = await http.post('toolbox/context', params)
        return response;
    }

    /**
     * @description 查询服务器信息
     * 
     */
    static async work(params: any) {
        let response: HttpResponse<any> = await http.post('toolbox/work', params)
        return response;
    }

    /**
     * @description 查询服务器信息
     * 
     */
    static async queryOpens() {
        let params = {
        };
        let response: HttpResponse<any> = await http.post('toolbox/queryOpens', params)
        return response;
    }

    /**
     * @description 查询服务器信息
     * 
     */
    static async open(params: any) {
        let response: HttpResponse<any> = await http.post('toolbox/open', params)
        return response;
    }

    /**
     * @description 查询服务器信息
     * 
     */
    static async close(openId: any) {
        let params = {
            openId: openId,
        };
        let response: HttpResponse<any> = await http.post('toolbox/close', params)
        return response;
    }

    /**
     * @description 查询服务器信息
     * 
     */
    static async updateOpenExtend(openId: any, extend: any) {
        let params = {
            openId: openId,
            extend: JSON.stringify(extend),
        };
        let response: HttpResponse<any> = await http.post('toolbox/updateOpenExtend', params)
        return response;
    }

}
