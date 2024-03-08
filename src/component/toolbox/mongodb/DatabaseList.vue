<template>
  <div class="toolbox-mongodb-database">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout height="60px">
          <div class="pdlr-10 pdt-10 toolbox-mongodb-database-btns">
            <div class="tm-btn tm-btn-xs bg-grey-6" @click="refresh">刷新</div>
            <div
              class="tm-btn tm-btn-xs bg-teal-8"
              @click="toCollectionCreate()"
            >
              新建集合
            </div>
            <div
              class="tm-btn tm-btn-xs bg-teal-6"
              @click="toolboxWorker.showInfo()"
            >
              信息
            </div>
          </div>
        </tm-layout>
        <tm-layout height="auto">
          <div class="pd-10" style="height: 100%">
            <div style="height: 36px">
              <el-input
                placeholder="输入关键字进行过滤"
                size="mini"
                v-model="filterText"
              >
              </el-input>
            </div>
            <div
              style="height: calc(100% - 36px)"
              class="app-scroll-bar"
              ref="treeBox"
            >
              <el-tree
                ref="tree"
                :load="loadNode"
                lazy
                :props="defaultProps"
                :default-expanded-keys="expands"
                node-key="key"
                :expand-on-click-node="false"
                @node-click="nodeClick"
                @node-contextmenu="nodeContextmenu"
                @node-expand="nodeExpand"
                @node-collapse="nodeCollapse"
                :filter-node-method="filterNode"
              >
                <span class="toolbox-editor-tree-span" slot-scope="{ node }">
                  <span>{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </div>
        </tm-layout>
      </tm-layout>
    </template>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      ready: false,
      expands: [],
      defaultProps: {
        children: "children",
        label: "text",
        isLeaf: "leaf",
      },
      filterText: "",
    };
  },
  computed: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    init() {
      if (this.extend && this.extend.expands) {
        this.expands = this.extend.expands;
      }
      this.ready = true;
    },
    filterNode(value, data) {
      if (!value) return true;
      return (
        data.text && data.text.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    },
    nodeExpand(data) {
      let index = this.expands.indexOf(data.key);
      if (index < 0) {
        this.expands.push(data.key);
        this.toolboxWorker.updateExtend({
          expands: this.expands,
        });
      }
    },
    nodeCollapse(data) {
      let needDeletes = [];
      needDeletes.push(data.key);
      if (data.isDatabase) {
        this.expands.forEach((one) => {
          if (one == "database:" + data.ownerName) {
            needDeletes.push(one);
          } else if (
            ("" + one).startsWith("database:" + data.ownerName + ":")
          ) {
            needDeletes.push(one);
          }
        });
      }
      if (needDeletes.length > 0) {
        needDeletes.forEach((one) => {
          let index = this.expands.indexOf(one);
          if (index >= 0) {
            this.expands.splice(index, 1);
          }
        });
        this.toolboxWorker.updateExtend({
          expands: this.expands,
        });
      }
    },
    refresh() {
      this.reloadChildren(this.$refs.tree.root);
    },
    toReloadChildren(data) {
      this.tool.stopEvent();
      this.reloadChildren(data);
    },
    reloadChildren(key) {
      this.tool.stopEvent();
      let node = this.$refs.tree.getNode(key);
      if (node) {
        node.loaded = false;
        node.expand();
      }
    },
    nodeClick(data, node, nodeView) {
      let nowTime = new Date().getTime();
      let clickTime = node.clickTime;
      node.clickTime = nowTime;
      if (clickTime) {
        let timeout = nowTime - clickTime;
        if (timeout < 300) {
          node.clickTime = null;
          this.nodeDbClick(data, node, nodeView);
        }
      }
    },
    nodeDbClick(data, node, nodeView) {
      if (data.isDatabase) {
        if (node.expanded) {
          node.collapse();
        } else {
          node.expand();
        }
      } else if (data.isCollection) {
        this.toCollectionOpen(data);
      }
    },
    nodeContextmenu(event, data, node, nodeView) {
      let menus = [];
      if (data.isDatabase) {
        menus.push({
          text: "刷新",
          onClick: () => {
            this.toReloadChildren(data);
          },
        });
        menus.push({
          text: "新增集合",
          onClick: () => {
            this.toCollectionCreate(data);
          },
        });
      }
      if (data.isCollection) {
        menus.push({
          text: "查看数据",
          onClick: () => {
            this.toCollectionOpen(data);
          },
        });
        menus.push({
          text: "编辑索引",
          onClick: () => {
            this.toCollectionUpdateIndex(data);
          },
        });
      }
      menus.push({
        text: "复制名称",
        onClick: async () => {
          let res = await this.tool.clipboardWrite(data.name);
          if (res.success) {
            this.tool.success("复制成功");
          } else {
            this.tool.warn("复制失败，请允许访问剪贴板！");
          }
        },
      });
      menus.push({
        text: "清空数据",
        onClick: () => {
          this.toDataTrim(data);
        },
      });
      menus.push({
        text: "删除",
        onClick: () => {
          this.toDelete(data);
        },
      });

      if (menus.length > 0) {
        this.tool.showContextmenu(menus);
      }
    },
    toCollectionOpen(data) {
      let extend = {
        name: data.database.name + "." + data.name,
        title: data.database.name + "." + data.name,
        type: "data",
        databaseName: data.database.name,
        collectionName: data.name,
      };
      this.toolboxWorker.openTabByExtend(extend);
    },
    toDelete(data) {
      this.tool.stopEvent();
      let msg = "确认删除";
      if (data.isDatabase) {
        msg += "库[" + data.name + "]";
      } else if (data.isCollection) {
        msg += "库[" + data.database.name + "]" + "集合[" + data.name + "]";
      }
      msg += "?";
      this.tool
        .confirm(msg)
        .then(async () => {
          if (data.isDatabase) {
            await this.doDatabaseDelete(data.name);
            this.refresh();
          } else if (data.isCollection) {
            await this.doCollectionDelete(data.database.name, data.name);
            this.reloadChildren(data.database);
          }
        })
        .catch((e) => {});
    },
    toDataTrim(data) {
      this.tool.stopEvent();
      let msg = "清空";
      if (data.isDatabase) {
        msg += "库[" + data.name + "]";
      } else if (data.isCollection) {
        msg += "库[" + data.database.name + "]" + "集合[" + data.name + "]";
      }
      msg += "数据，将无法恢复，确认清空?";
      this.tool
        .confirm(msg)
        .then(async () => {
          if (data.isDatabase) {
            await this.doDatabaseDataTrim(data.name);
          } else if (data.isCollection) {
            await this.doCollectionDataTrim(data.database.name, data.name);
          }
        })
        .catch((e) => {});
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        let dataList = await this.toolboxWorker.loadDatabases();

        let list = [];
        dataList.forEach((one) => {
          let d = {};
          d.name = one.name;
          d.text = one.name;
          d.isDatabase = true;
          d.key = "owner:" + d.name;
          d.leaf = false;

          list.push(d);
        });
        resolve(list);
        this.initTreeWidth();
        return;
      }
      if (node.data.isDatabase) {
        let database = node.data;
        let ds = await this.toolboxWorker.loadCollections(database.name);
        let list = [];
        ds.forEach((one) => {
          let d = {};
          d.name = one.name;
          d.text = one.name;
          d.database = database;
          d.isCollection = true;
          d.key = "database:" + database.name + ":" + d.name;
          d.leaf = true;

          list.push(d);
        });
        resolve(list);
        this.initTreeWidth();
      }
    },
    initTreeWidth() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.tool.initTreeWidth(this.$refs.tree, this.$refs.treeBox);
        });
      }, 100);
    },
    toCollectionCreate(database) {
      let data = {};
      if (database && database.name) {
        data.databaseName = database.name;
      } else {
        data.databaseName = "db_xx";
      }

      this.tool.showForm({
        formType: "mongodb-collection",
        param: this.toolboxWorker.getWorkParam(),
        title: `新建集合`,
        data: [data],
        onSave: (res) => {
          if (res) {
            this.tool.success("新建集合成功");
            if (database && database.name) {
              this.reloadChildren(database);
            } else {
              this.refresh();
            }
          }
        },
      });
    },
    async toCollectionUpdateIndex(collection) {
      let databaseName = collection.database.name;
      let extend = {
        name: "编辑[" + databaseName + "]库集合[" + collection.name + "]索引",
        title: "编辑[" + databaseName + "]库集合[" + collection.name + "]索引",
        type: "index",
        databaseName: databaseName,
        collectionName: collection.name,
      };
      this.toolboxWorker.openTabByExtend(extend);
    },
    async doDatabaseDelete(databaseName) {
      let param = this.toolboxWorker.getWorkParam({
        databaseName: databaseName,
      });
      let res = await this.server.mongodb.database.delete(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
        return false;
      }
      this.tool.success("删除成功");
      return true;
    },
    async doCollectionDelete(databaseName, collectionName) {
      let param = this.toolboxWorker.getWorkParam({
        databaseName: databaseName,
        collectionName: collectionName,
      });
      let res = await this.server.mongodb.collection.delete(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
        return false;
      }
      this.tool.success("删除成功");
      return true;
    },
    async doDatabaseDataTrim(databaseName) {
      let param = this.toolboxWorker.getWorkParam({
        databaseName: databaseName,
      });
      let res = await this.server.mongodb.database.dataTrim(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
        return false;
      }
      this.tool.success("清空成功");
      return true;
    },
    async doCollectionDataTrim(databaseName, collectionName) {
      let param = this.toolboxWorker.getWorkParam({
        databaseName: databaseName,
        collectionName: collectionName,
      });
      let res = await this.server.mongodb.collection.dataTrim(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
        return false;
      }
      this.tool.success("清空成功");
      return true;
    },
  },
  updated() {},
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-mongodb-database {
  width: 100%;
  height: 100%;
}
.toolbox-mongodb-database-btns .tm-btn + .tm-btn {
  margin-left: 0px;
}
.toolbox-mongodb-database-btns .tm-btn {
  margin-right: 10px;
}
</style>
