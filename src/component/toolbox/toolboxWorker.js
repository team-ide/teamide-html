import server from "@/server/index.js";
import tool from "@/tool/index.js";
const newToolboxWorker = function (workerOption) {
    workerOption = workerOption || {};
    let itemsWorker = tool.newItemsWorker({
        async onRemoveItem(item) {
            let res = await server.toolbox.closeTab({ tabId: item.tabId });
            if (res.code != 0) {
                tool.error(res.msg);
            }
        },
        async onActiveItem(item) {
            let res = await server.toolbox.openTab({ tabId: item.tabId });
            if (res.code != 0) {
                tool.error(res.msg);
            }
        },
        async toCopyItem(item) {
            worker.openTabByExtend(item.extend, item, item.createTime)
        },
    });
    let workerId = "";
    if (tool.isNotEmpty(workerOption.openId)) {
        workerId = "" + workerOption.openId;
    } else {
        workerId = tool.generatekey(30);
    }
    const worker = {
        toolboxId: workerOption.toolboxId,
        openId: workerOption.openId,
        toolboxType: workerOption.toolboxType,
        extend: workerOption.extend,
        workerId: workerId,
        itemsWorker: itemsWorker,

        async init() {
            await this.initOpenTabs()
        },
        getWorkParam(data) {
            data = data || {};
            data.workerId = worker.workerId
            data.toolboxId = worker.toolboxId
            data.toolboxType = worker.toolboxType
            return data;
        },
        async updateOpenTabExtend(tabId, keyValueMap) {
            if (keyValueMap == null) {
                return;
            }
            if (Object.keys(keyValueMap) == 0) {
                return;
            }
            let extend = {}
            itemsWorker.items.forEach(one => {
                if (one.tabId == tabId) {
                    extend = one.extend || {};
                }
            })
            let obj = extend;
            for (let key in keyValueMap) {
                let value = keyValueMap[key];
                let names = key.split(".");
                names.forEach((name, index) => {
                    if (index < names.length - 1) {
                        obj[name] = obj[name] || {};
                        obj = obj[name];
                    } else {
                        obj[name] = value;
                    }
                });
            }
            let param = {
                tabId: tabId,
                extend: JSON.stringify(extend),
            };
            let res = await server.toolbox.updateOpenTabExtend(param);
            if (res.code != 0) {
                tool.error(res.msg);
            }
        },
        async updateExtend(keyValueMap) {
            if (keyValueMap == null) {
                return;
            }
            if (Object.keys(keyValueMap) == 0) {
                return;
            }
            let obj = worker.extend;
            for (let key in keyValueMap) {
                let value = keyValueMap[key];
                let names = key.split(".");
                names.forEach((name, index) => {
                    if (index < names.length - 1) {
                        obj[name] = obj[name] || {};
                        obj = obj[name];
                    } else {
                        obj[name] = value;
                    }
                });
            }
            let param = {
                openId: worker.openId,
                extend: JSON.stringify(worker.extend),
            };
            let res = await server.toolbox.updateOpenExtend(param);
            if (res.code != 0) {
                tool.error(res.msg);
            }
        },
        async openTabByExtend(extend, fromItem, createTime) {


            if (extend && tool.isNotEmpty(extend.onlyOpenOneKey)) {
                let items = itemsWorker.items || [];
                let find = null;
                items.forEach((item) => {
                    if (
                        item &&
                        item.extend &&
                        item.extend.onlyOpenOneKey == extend.onlyOpenOneKey
                    ) {
                        find = item;
                    }
                });
                if (find != null) {
                    itemsWorker.toActiveItem(find);
                    return;
                }
            }

            let param = {
                openId: worker.openId,
                toolboxId: worker.toolboxId,
                extend: JSON.stringify(extend || {}),
            };
            if (createTime) {
                param.createTime = createTime;
            }
            let res = await server.toolbox.openTab(param);
            let openTab = null;
            if (res.code != 0) {
                tool.error(res.msg);
            } else {
                openTab = res.data.tab;
            }
            if (openTab == null) {
                return;
            }
            let item = await this.addOpenItem(openTab, fromItem);
            if (item != null) {
                itemsWorker.toActiveItem(item);
            }
        },
        async addOpenItem(data, fromItem) {
            let extend = tool.getOptionJSON(data.extend);

            let item = {
                key: data.tabId,
                title: extend.title,
                name: extend.name,
                extend: extend,
                tabId: data.tabId,
                openId: worker.openId,
                createTime: data.createTime,
                comment: "",
            };

            itemsWorker.addItem(item, fromItem);

            data.item = item;
            return item;
        },
        async initOpenTabs() {
            let openTabs = [];
            let res = await server.toolbox.queryOpenTabs({
                openId: worker.openId,
            });
            if (res.code != 0) {
                tool.error(res.msg);
            } else {
                openTabs = res.data.tabs || [];
            }

            await openTabs.forEach(async (one) => {
                await worker.addOpenItem(one);
            });

            // 激活最后
            let activeOne = null;
            openTabs.forEach(async (one) => {
                if (activeOne == null) {
                    activeOne = one;
                } else {
                    if (
                        new Date(one.openTime).getTime() >
                        new Date(activeOne.openTime).getTime()
                    ) {
                        activeOne = one;
                    }
                }
            });
            if (activeOne != null) {
                itemsWorker.toActiveItem(activeOne.item);
            }
        },
    };


    return worker
};
export default {
    newToolboxWorker
}