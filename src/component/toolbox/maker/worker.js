import server from "@/server/index.js";
import tool from "@/tool/index.js";
import source from "@/source/index.js";

const newWorker = function (workerOption) {
    workerOption = workerOption || {};
    const worker = {
        toolboxWorker: workerOption.toolboxWorker,
        treeData: null,
        init() {
            this.build()
        },
        refresh() {
            this.build()
        },
        async build() {
            if (this.build_ing) {
                return
            }
            this.build_ing = true;
            try {
                let context = await worker.loadContext();
                context = context || {}
                let app = context.app || {}
                let children = app.children || []
                worker.treeData = children
            } catch (error) {
                console.error("build error:", error);
            } finally {
                this.build_ing = false;
            }
        },
        async loadContext() {
            let param = worker.getParam({});
            let res = await server.maker.loadContext(param);
            if (res.code != 0) {
                tool.error(res.msg);
            }
            let context = res.data;
            return context;
        },
        getParam(data) {
            let param = worker.toolboxWorker.getWorkParam(data)
            return param;
        },
        async close() {

            let param = worker.getParam();
            let res = await server.maker.close(param);
            if (res.code != 0) {
                // tool.error(res.msg);
            }
            return res.data;
        },
        async get(modelType, modelName) {

            let param = worker.getParam({
                modelType: modelType,
                modelName: modelName,
            });
            let res = await server.maker.get(param);
            if (res.code != 0) {
                tool.error(res.msg);
            }
            return res.data;
        },
        async getList(modelType) {

            let param = worker.getParam({
                modelType: modelType,
            });
            let res = await server.maker.save(param);
            if (res.code != 0) {
                tool.error(res.msg);
            }
            return res.data;
        },
        async insert(modelType, modelName, model) {

            let param = worker.getParam({
                modelType: modelType,
                modelName: modelName,
                model: model,
            });
            let res = await server.maker.insert(param);
            if (res.code != 0) {
                tool.error(res.msg);
            } else {
                tool.success("新增成功");
            }
            return res.data;
        },
        async save(modelType, modelName, model) {

            let param = worker.getParam({
                modelType: modelType,
                modelName: modelName,
                model: model,
            });
            let res = await server.maker.save(param);
            if (res.code != 0) {
                tool.error(res.msg);
            } else {
                tool.success("保存成功");
            }
            return res.data;
        },
        async delete(modelType, modelName) {

            let param = worker.getParam({
                modelType: modelType,
                modelName: modelName,
            });
            let res = await server.maker.delete(param);
            if (res.code != 0) {
                tool.error(res.msg);
            } else {
                tool.success("删除成功");
            }
            return res.data;
        },
    };


    return worker
};
export default {
    newWorker
}