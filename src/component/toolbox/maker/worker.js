import server from "@/server/index.js";
import tool from "@/tool/index.js";
import source from "@/source/index.js";

const newWorker = function (workerOption) {
    workerOption = workerOption || {};
    const worker = {
        toolboxWorker: workerOption.toolboxWorker,
        treeData: null,
        valueTypeList: [],
        init() {
            this.build()
        },
        refresh() {
            this.build()
        },
        bindListen() {
            server.addListenOnEvent("maker-insert", worker.onInsert,);
            server.addListenOnEvent("maker-save", worker.onSave,);
            server.addListenOnEvent("maker-remove", worker.onRemove,);
            server.addListenOnEvent("maker-rename", worker.onRename,);
        },
        unbindListen() {
            server.removeListenOnEvent("maker-insert", worker.onInsert,);
            server.removeListenOnEvent("maker-save", worker.onSave,);
            server.removeListenOnEvent("maker-remove", worker.onRemove,);
            server.removeListenOnEvent("maker-rename", worker.onRename,);
        },
        onInsert(data) {
            if (worker.isDestroyed) {
                worker.unbindListen()
                return
            }
            if (data.element) {
                worker.addElement(data.element)
            }
        },
        onSave(data) {
            if (worker.isDestroyed) {
                worker.unbindListen()
                return
            }
        },
        onRemove(data) {
            if (worker.isDestroyed) {
                worker.unbindListen()
                return
            }
            if (data.element) {
                worker.removeElement(data.element)
            }
        },
        onRename(data) {
            if (worker.isDestroyed) {
                worker.unbindListen()
                return
            }
            if (data.oldElement) {
                worker.removeElement(data.oldElement)
            }
            if (data.newElement) {
                worker.addElement(data.newElement)
            }
        },
        addElement(element) {
            let names = element.key.split('/')
            let parent = worker.treeCache[names[0]];
            if (parent == null) {
                return
            }
            let key = names[0]
            for (let i = 1; i < names.length; i++) {
                key += "/" + names[i]
                let find = worker.treeCache[key]
                let isEnd = i == names.length - 1
                if (!find) {
                    if (isEnd) {
                        find = element
                    } else {
                        find = {
                            key: key,
                            text: names[i],
                            children: [],
                            isPack: true,
                        }
                    }
                    find.modelType = parent.modelType
                    find.modelTypeText = parent.modelTypeText
                    find.parent = parent
                    worker.treeCache[find.key] = find
                    parent.children = parent.children || []
                    parent.children.push(find)
                }
                parent = find
            }
        },
        removeElement(element) {
            let find = worker.treeCache[element.key]
            if (find == null) {
                return
            }
            if (find.parent) {
                find.parent.children.splice(find.parent.children.indexOf(find), 1)
            }
            worker.removeCache(find.key)
        },
        removeCache(key) {
            let find = worker.treeCache[key]
            if (find == null) {
                return
            }
            delete worker.treeCache[key]

            if (find.children && find.children.length > 0) {
                find.children.forEach(one => {
                    worker.removeCache(one.key)
                })
            }
        },
        formatTreeData(children, modelType, parent) {
            if (children == null || children.length == 0) {
                return
            }
            children.forEach(one => {
                if (one.isType) {
                    modelType = worker.typeCache[one.key]
                }
                worker.formatTreeData(one.children, modelType, one)
                if (modelType != null) {
                    one.modelType = modelType.name
                    one.modelTypeText = modelType.comment
                }
                one.parent = parent
                worker.treeCache[one.key] = one;
            })
        },
        getDataByKey(key) {
            return worker.treeCache[key]
        },
        async build() {
            if (worker.build_ing) {
                return
            }
            worker.build_ing = true;
            try {
                let context = await worker.loadContext();
                context = context || {}
                let app = context.app || {}

                let valueTypes = app.valueTypes || []

                worker.valueTypeList = valueTypes;

                worker.typeCache = context.typeCache || {}
                worker.treeCache = {}
                let children = app.children || []
                worker.formatTreeData(children)

                worker.treeData = children
            } catch (error) {
                console.error("build error:", error);
            } finally {
                worker.build_ing = false;
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
        async insert(modelType, modelName, isPack, model) {

            let param = worker.getParam({
                modelType: modelType,
                modelName: modelName,
                isPack: isPack,
                model: model,
            });
            let res = await server.maker.insert(param);
            if (res.code != 0) {
                tool.error(res.msg);
            } else {
                tool.success("新增成功");
            }
            return res;
        },
        async save(modelType, modelName, model, isPack) {

            let param = worker.getParam({
                modelType: modelType,
                modelName: modelName,
                model: model,
                isPack: isPack,
            });
            let res = await server.maker.save(param);
            if (res.code != 0) {
                tool.error(res.msg);
            } else {
                tool.success("保存成功");
            }
            return res.data;
        },
        async remove(modelType, modelName, isPack) {

            let param = worker.getParam({
                modelType: modelType,
                modelName: modelName,
                isPack: isPack,
            });
            let res = await server.maker.remove(param);
            if (res.code != 0) {
                tool.error(res.msg);
            } else {
                tool.success("删除成功");
            }
            return res.data;
        },
        async rename(modelType, oldModelName, newModelName, isPack) {

            let param = worker.getParam({
                modelType: modelType,
                oldModelName: oldModelName,
                newModelName: newModelName,
                isPack: isPack,
            });
            let res = await server.maker.rename(param);
            if (res.code != 0) {
                tool.error(res.msg);
            } else {
                tool.success("修改成功");
            }
            return res;
        },
    };


    return worker
};
export default {
    newWorker
}