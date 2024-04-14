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
        appendTypeModels(modelType, app) {
            let children = [];
            let models = app[modelType.name] || []
            let packCache = {};
            models.forEach(model => {
                model.modelType = modelType.name;
                model.modelTypeText = modelType.text;
                model.text = model.name;
                model.key = modelType.name + ":" + model.name;

                let packNames = model.name.split('/');
                if (packNames.length == 1) {
                    children.push(model);
                } else {
                    let parentPack = null
                    for (let i = 0; i < packNames.length; i++) {
                        let packName = packNames[i];
                        if (i == packNames.length - 1) {
                            model.key = parentPack.key + ":" + packName;
                            model.text = packName;
                            parentPack.children.push(model);
                        } else {
                            let packKey = parentPack ? (parentPack.key + ":" + packName) : modelType.key + ":" + packName;
                            let pack = packCache[packKey]
                            if (pack == null) {
                                pack = {
                                    key: packKey,
                                    text: packName,
                                    children: [],
                                    isPack: true,
                                    modelType: modelType.name,
                                    path: parentPack ? (parentPack.path + "/" + packName) : packName,
                                }
                                packCache[packKey] = pack
                                if (parentPack != null) {
                                    parentPack.children.push(pack);
                                } else {
                                    children.push(pack);
                                }
                            }
                            parentPack = pack
                        }
                    }

                }
            })
            modelType.children = children;
        },
        appendType(treeData, modelType, app, parentKey) {
            modelType.text = modelType.comment || modelType.name
            modelType.key = modelType.name
            modelType.modelType = modelType.name;
            modelType.modelTypeText = modelType.text;
            if (tool.isNotEmpty(parentKey)) {
                modelType.key = parentKey + ":" + modelType.key
            }
            if (tool.isEmpty(parentKey)) {
                treeData.push(modelType);
            }
            if (modelType.children && modelType.children.length > 0) {
                modelType.children.forEach(one => {
                    worker.appendType(modelType.children, one, app, modelType.key)
                })
                return
            }
            if (tool.isNotEmpty(modelType.fileName)) {
                return
            }
            worker.appendTypeModels(modelType, app)

            console.log(modelType);
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
                let typeList = context.types || []
                let treeData = [];
                typeList.forEach(modelType => {
                    worker.appendType(treeData, modelType, app)
                })
                // console.log(context);
                worker.treeData = treeData
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
    };


    return worker
};
export default {
    newWorker
}