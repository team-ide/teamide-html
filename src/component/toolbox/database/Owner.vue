<template>
  <div class="toolbox-database-owner">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout height="80px">
          <div class="pdlr-10 pdt-10 toolbox-database-owner-btns">
            <div class="tm-btn tm-btn-xs bg-grey-6" @click="refresh">刷新</div>
            <div class="tm-btn tm-btn-xs bg-teal-8" @click="toOwnerCreate">
              新建库
            </div>
            <div class="tm-btn tm-btn-xs bg-green" @click="toOpenSql">
              新建查询
            </div>
            <div class="tm-btn tm-btn-xs bg-blue-8" @click="toTest()">
              性能测试
            </div>
            <div class="tm-btn tm-btn-xs bg-blue-8" @click="toExport()">
              导出
            </div>
            <div
              class="tm-btn tm-btn-xs bg-teal-6"
              @click="toolboxWorker.showInfo()"
            >
              信息
            </div>
            <template v-if="openDateFormat">
              <div
                class="tm-btn tm-btn-xs bg-orange"
                @click="changeOpenDateFormat(false)"
              >
                关闭日期识别
              </div>
            </template>
            <template v-else>
              <div
                class="tm-btn tm-btn-xs bg-green"
                @click="changeOpenDateFormat(true)"
              >
                开启日期识别
              </div>
            </template>
          </div>
        </tm-layout>
        <tm-layout height="auto" class="app-scroll-bar">
          <div class="pd-10">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText">
            </el-input>
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
              <span
                class="toolbox-editor-tree-span"
                slot-scope="{ node, data }"
              >
                <span>{{ node.label }}</span>
                <div class="toolbox-editor-tree-btn-group">
                  <div
                    v-if="data.isOwner || data.isOwnerTables"
                    class="tm-link color-grey ft-14 mgr-4"
                    @click="toReloadChildren(data)"
                  >
                    <i class="mdi mdi-reload"></i>
                  </div>
                  <div
                    v-if="data.isTable"
                    class="tm-link color-grey ft-14 mgr-4"
                    title="表数据"
                    @click="toTableOpen(data)"
                  >
                    <i class="mdi mdi-database-outline"></i>
                  </div>
                  <div
                    v-if="data.isOwner || data.isTable"
                    class="tm-link color-grey ft-13 mgr-4"
                    title="DDL"
                    @click="toShowDDL(data)"
                  >
                    <IconFont
                      class="teamide-suffix-sql"
                      style="vertical-align: -1px"
                    ></IconFont>
                  </div>
                  <div
                    v-if="data.isOwner || data.isTable"
                    class="tm-link color-orange ft-15 mgr-4"
                    @click="toDelete(data)"
                  >
                    <i class="mdi mdi-delete-outline"></i>
                  </div>
                </div>
              </span>
            </el-tree>
          </div>
        </tm-layout>
      </tm-layout>
    </template>
  </div>
</template>


<script>
export default {
  components: {},
  props: [
    "source",
    "toolboxWorker",
    "extend",
    "ownersChange",
    "openDateFormat",
    "changeOpenDateFormat",
  ],
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
      if (data.isOwner) {
        this.expands.forEach((one) => {
          if (one == "owner:tables:" + data.ownerName) {
            needDeletes.push(one);
          } else if (("" + one).startsWith("owner:" + data.ownerName + ":")) {
            needDeletes.push(one);
          }
        });
      } else if (data.isOwnerTables) {
        this.expands.forEach((one) => {
          if (one == "owner:tables:" + data.owner.ownerName) {
            needDeletes.push(one);
          } else if (
            ("" + one).startsWith("owner:" + data.owner.ownerName + ":")
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
        if (node.data && node.data.isOwner && node.loaded && node.childNodes) {
          node.childNodes.forEach((one) => {
            one.loaded = false;
            one.expand();
          });
          return;
        }
        node.loaded = false;
        node.expand();
      }
    },
    async toShowDDL(data) {
      if (data.isOwner) {
        let extend = {
          name: data.ownerName + ">DDL",
          title: data.ownerName + ">DDL",
          type: "ddl",
          ownerName: data.ownerName,
        };
        this.toolboxWorker.openTabByExtend(extend);
      } else if (data.isTable) {
        let extend = {
          name: data.owner.ownerName + "." + data.tableName + ">DDL",
          title: data.owner.ownerName + "." + data.tableName + ">DDL",
          type: "ddl",
          ownerName: data.owner.ownerName,
          tableName: data.tableName,
        };
        this.toolboxWorker.openTabByExtend(extend);
      }
    },
    async toShowModel(data) {
      if (data.isOwner) {
        let extend = {
          name: data.ownerName + ">Model",
          title: data.ownerName + ">Model",
          type: "model",
          ownerName: data.ownerName,
        };
        this.toolboxWorker.openTabByExtend(extend);
      } else if (data.isTable) {
        let extend = {
          name: data.owner.ownerName + "." + data.tableName + ">Model",
          title: data.owner.ownerName + "." + data.tableName + ">Model",
          type: "model",
          ownerName: data.owner.ownerName,
          tableName: data.tableName,
        };
        this.toolboxWorker.openTabByExtend(extend);
      }
    },
    toTest(data) {
      let extend = {
        name: "测试",
        title: "测试",
        type: "test",
      };
      if (data) {
        if (data.isOwner) {
          extend.ownerName = data.ownerName;
        } else if (data.isTable) {
          extend.ownerName = data.owner.ownerName;
          extend.tableName = data.tableName;
        }
      }
      this.toolboxWorker.openTabByExtend(extend);
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
      if (data.isOwner) {
        if (node.expanded) {
          node.collapse();
        } else {
          node.expand();
        }
      } else if (data.isOwnerTables) {
        if (node.expanded) {
          node.collapse();
        } else {
          node.expand();
        }
      } else if (data.isTable) {
        this.toTableOpen(data);
      }
    },
    toOpenSql(data, selectSql) {
      let extend = {
        name: "新建SQL",
        title: "新建SQL",
        type: "sql",
      };
      if (data) {
        let owner = data;
        if (data.isOwnerTables) {
          owner = data.owner;
        } else if (data.isTable) {
          owner = data.owner;
        }
        if (data.isOwner || data.isOwnerTables) {
          extend.name = "查询[" + owner.ownerName + "]库SQL";
          extend.title = "查询[" + owner.ownerName + "]库SQL";
          extend.ownerName = owner.ownerName;
          extend.executeSQL = "SHOW TABLES;";
        } else if (data.isTable) {
          extend.name =
            "查询[" + owner.ownerName + "]库[" + data.tableName + "]表SQL";
          extend.title =
            "查询[" + owner.ownerName + "]库[" + data.tableName + "]表SQL";
          extend.ownerName = owner.ownerName;
          extend.executeSQL =
            "SELECT * FROM " + owner.ownerName + "." + data.tableName + ";";
        }
      }
      this.toolboxWorker.showSqlFiles({
        executeSQL: extend.executeSQL,
        onOpen: (data) => {
          extend["extendId"] = data.extendId;
          this.toolboxWorker.openTabByExtend(extend);
        },
      });
    },
    nodeContextmenu(event, data, node, nodeView) {
      let menus = [];
      if (data.isOwner || data.isOwnerTables) {
        let owner = data;
        if (data.isOwnerTables) {
          owner = data.owner;
        }
        menus.push({
          text: "刷新",
          onClick: () => {
            this.toReloadChildren(data);
          },
        });
        menus.push({
          text: "新增表",
          onClick: () => {
            this.toTableCreate(owner);
          },
        });
        menus.push({
          text: "新建SQL查询",
          onClick: () => {
            this.toOpenSql(data);
          },
        });
      }
      if (data.isTable) {
        menus.push({
          text: "查看数据",
          onClick: () => {
            this.toTableOpen(data);
          },
        });
        menus.push({
          text: "新建SQL查询",
          onClick: () => {
            this.toOpenSql(data);
          },
        });
        menus.push({
          text: "编辑表",
          onClick: () => {
            this.toTableUpdate(data);
          },
        });
      }
      if (data.isOwner || data.isTable) {
        menus.push({
          text: "查看DDL",
          onClick: () => {
            this.toShowDDL(data);
          },
        });
        menus.push({
          text: "查看Model",
          onClick: () => {
            this.toShowModel(data);
          },
        });
        menus.push({
          text: "导出",
          onClick: () => {
            this.toExport(data);
          },
        });
        menus.push({
          text: "导入",
          onClick: () => {
            this.toImport(data);
          },
        });
        menus.push({
          text: "复制名称",
          onClick: async () => {
            let res = await this.tool.clipboardWrite(
              data.tableName || data.ownerName
            );
            if (res.success) {
              this.tool.success("复制成功");
            } else {
              this.tool.warn("复制失败，请允许访问剪贴板！");
            }
          },
        });
        menus.push({
          text: "性能测试",
          onClick: () => {
            this.toTest(data);
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
      }

      if (menus.length > 0) {
        this.tool.showContextmenu(menus);
      }
    },
    toTableOpen(data) {
      let extend = {
        name: data.owner.ownerName + "." + data.tableName,
        title: data.owner.ownerName + "." + data.tableName,
        type: "data",
        ownerName: data.owner.ownerName,
        tableName: data.tableName,
      };
      this.toolboxWorker.openTabByExtend(extend);
    },
    toDelete(data) {
      this.tool.stopEvent();
      let msg = "确认删除";
      if (data.isOwner) {
        msg += "库[" + data.ownerName + "]";
      } else if (data.isTable) {
        msg +=
          "库[" + data.owner.ownerName + "]" + "表[" + data.tableName + "]";
      }
      msg += "?";
      this.tool
        .confirm(msg)
        .then(async () => {
          if (data.isOwner) {
            await this.doOwnerDelete(data.ownerName);
            this.refresh();
          } else if (data.isTable) {
            await this.doTableDelete(data.owner.ownerName, data.tableName);
            this.reloadChildren(data.owner);
          }
        })
        .catch((e) => {});
    },
    toDataTrim(data) {
      this.tool.stopEvent();
      let msg = "清空";
      if (data.isOwner) {
        msg += "库[" + data.ownerName + "]";
      } else if (data.isTable) {
        msg +=
          "库[" + data.owner.ownerName + "]" + "表[" + data.tableName + "]";
      }
      msg += "数据，将无法恢复，确认清空?";
      this.tool
        .confirm(msg)
        .then(async () => {
          if (data.isOwner) {
            await this.doOwnerDataTrim(data.ownerName);
          } else if (data.isTable) {
            await this.doTableDataTrim(data.owner.ownerName, data.tableName);
          }
        })
        .catch((e) => {});
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        let owners = await this.toolboxWorker.loadOwners();

        let list = [];
        owners.forEach((one) => {
          let owner = {};
          owner.ownerName = one.ownerName;
          owner.text = one.ownerName;
          owner.isOwner = true;
          owner.key = "owner:" + owner.ownerName;
          owner.leaf = false;

          list.push(owner);
        });
        this.ownersChange(list);
        resolve(list);
        this.initTreeWidth();
        return;
      }
      if (node.data.isOwner) {
        let owner = node.data;
        resolve([
          {
            text: "Tables",
            isOwnerTables: true,
            key: "owner:tables:" + owner.ownerName,
            leaf: false,
            owner: owner,
          },
        ]);
        this.initTreeWidth();
        return;
      }
      if (node.data.isOwnerTables) {
        let owner = node.data.owner;
        let tables = await this.toolboxWorker.loadTables(owner.ownerName);
        let list = [];
        tables.forEach((one) => {
          let table = {};
          table.tableName = one.tableName;
          table.text = one.tableName;
          table.owner = owner;
          table.isTable = true;
          table.key = "owner:" + owner.ownerName + ":" + table.tableName;
          table.leaf = true;

          list.push(table);
        });
        resolve(list);
        this.initTreeWidth();
      }
    },
    initTreeWidth() {
      // setTimeout(() => {
      //   this.$nextTick(() => {
      //     this.tool.initTreeWidth(this.$refs.tree, this.$refs.treeBox);
      //   });
      // }, 100);
    },
    toOwnerCreate() {
      this.toolboxWorker.showOwnerCreate(() => {
        this.refresh();
      });
    },
    toTableCreate(owner) {
      if (owner.isOwnerTables) {
        owner = owner.owner;
      }
      let extend = {
        name: "新建[" + owner.ownerName + "]库表",
        title: "新建[" + owner.ownerName + "]库表",
        type: "table",
        ownerName: owner.ownerName,
      };
      this.toolboxWorker.openTabByExtend(extend);
    },
    async toTableUpdate(table) {
      let ownerName = table.owner.ownerName;
      let extend = {
        name: "编辑[" + ownerName + "]库表[" + table.tableName + "]",
        title: "编辑[" + ownerName + "]库表[" + table.tableName + "]",
        type: "table",
        ownerName: ownerName,
        tableName: table.tableName,
      };
      this.toolboxWorker.openTabByExtend(extend);
    },
    async toExport(data) {
      let extend = {
        options: {
          from: {
            type: "database",
            toolboxId: this.toolboxWorker.toolboxId,
          },
        },
      };
      let title = "[导出]";
      if (data == null) {
      } else if (data.isOwner) {
        extend.options.from.ownerName = data.ownerName;
      } else if (data.isTable) {
        extend.options.from.ownerName = data.owner.ownerName;
        extend.options.from.tableName = data.tableName;
      }
      if (extend.options.from.tableName) {
        title += "[" + extend.options.from.tableName + "]表";
      } else if (extend.options.from.ownerName) {
        title += "[" + extend.options.from.ownerName + "]库";
      }
      extend.type = "datamove";
      extend.name = title;
      extend.title = title;
      this.toolboxWorker.openTabByExtend(extend);
    },
    async toImport(data) {
      let extend = {
        options: {
          to: {
            type: "database",
            toolboxId: this.toolboxWorker.toolboxId,
          },
        },
      };
      let title = "[导入]";
      if (data == null) {
      } else if (data.isOwner) {
        extend.options.to.ownerName = data.ownerName;
      } else if (data.isTable) {
        extend.options.to.ownerName = data.owner.ownerName;
        extend.options.to.tableName = data.tableName;
      }
      if (extend.options.to.tableName) {
        title += "[" + extend.options.to.tableName + "]表";
      } else if (extend.options.to.ownerName) {
        title += "[" + extend.options.to.ownerName + "]库";
      }
      extend.type = "datamove";
      extend.name = title;
      extend.title = title;
      this.toolboxWorker.openTabByExtend(extend);
    },
    async doOwnerDelete(ownerName) {
      let param = this.toolboxWorker.getWorkParam({
        ownerName: ownerName,
      });
      let res = await this.server.database.ownerDelete(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
        return false;
      }
      this.tool.success("删除成功");
      return true;
    },
    async doTableDelete(ownerName, tableName) {
      let param = this.toolboxWorker.getWorkParam({
        ownerName: ownerName,
        tableName: tableName,
      });
      let res = await this.server.database.tableDelete(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
        return false;
      }
      this.tool.success("删除成功");
      return true;
    },
    async doOwnerDataTrim(ownerName) {
      let param = this.toolboxWorker.getWorkParam({
        ownerName: ownerName,
      });
      let res = await this.server.database.ownerDataTrim(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
        return false;
      }
      this.tool.success("清空成功");
      return true;
    },
    async doTableDataTrim(ownerName, tableName) {
      let param = this.toolboxWorker.getWorkParam({
        ownerName: ownerName,
        tableName: tableName,
      });
      let res = await this.server.database.tableDataTrim(param);
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
.toolbox-database-owner {
  width: 100%;
  height: 100%;
}
.toolbox-database-owner-btns .tm-btn + .tm-btn {
  margin-left: 0px;
}
.toolbox-database-owner-btns .tm-btn {
  margin-right: 10px;
}
</style>
