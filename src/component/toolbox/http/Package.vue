<template>
  <div class="toolbox-thrift-services">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout height="80px">
          <div class="pdlr-10 pdt-5">
            <div class="tm-btn tm-btn-xs bg-grey-6" @click="reload">刷新</div>
            <div class="tm-btn tm-btn-xs bg-grey-6" @click="expandAll">
              展开
            </div>
            <div class="tm-btn tm-btn-xs bg-grey-6" @click="collapseAll">
              收起
            </div>
            <div class="tm-btn tm-btn-xs bg-grey" @click="toConfig()">配置</div>
          </div>
          <div class="pdlr-10 pdt-5">
            <div
              class="tm-btn tm-btn-xs bg-green"
              @click="toInsert({ isDir: true })"
            >
              新增目录
            </div>
            <div
              class="tm-btn tm-btn-xs bg-green"
              @click="toInsert({ isDir: false })"
            >
              新增接口
            </div>
            <div class="color-orange ft-12 pdt-5">`双击`展开目录或打开调用</div>
          </div>
        </tm-layout>
        <tm-layout height="40px">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
        </tm-layout>
        <tm-layout height="auto" class="app-scroll-bar">
          <div class="pd-10">
            <el-tree
              ref="tree"
              :data="packList"
              :props="defaultProps"
              node-key="key"
              @node-click="nodeClick"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              @node-expand="nodeExpand"
              @node-collapse="nodeCollapse"
              :default-expanded-keys="expands"
              @node-contextmenu="nodeContextmenu"
              empty-text="暂无数据"
            >
              <span class="toolbox-editor-tree-span" slot-scope="{ data }">
                <template v-if="data.isRename">
                  <input
                    class="toolbox-editor-tree-rename-input"
                    v-model="data.newname"
                    @blur="onRenameBlur(data, $event)"
                    @keyup="onRenameKeyup(data, $event)"
                  />
                </template>
                <template v-else>
                  <span class="mgr-5 ft-15" style="">
                    <i v-if="data.leaf" class="mdi mdi-file"></i>
                    <i v-else class="mdi mdi-folder color-orange-3"></i>
                  </span>
                  <span>{{ data.name }}</span>
                  <div class="toolbox-editor-tree-btn-group">
                    <div
                      class="tm-link color-blue ft-16 mgr-2"
                      @click="
                        toInsert({ isDir: false, parentId: data.id }, data)
                      "
                      v-if="!data.leaf && !data.isHistory"
                    >
                      <i class="mdi mdi-plus"></i>
                    </div>
                    <div
                      v-if="data.children == null || data.children.length == 0"
                      class="tm-link color-orange ft-15 mgr-2"
                      @click="toDelete(data)"
                    >
                      <i class="mdi mdi-delete-outline"></i>
                    </div>
                  </div>
                </template>
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
  props: ["source", "toolboxWorker", "extend", "config"],
  data() {
    return {
      ready: false,
      filterText: null,
      packList: [],
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: "leaf",
      },
      expands: [],
      dataListLoading: false,
    };
  },
  computed: {},
  watch: {
    filterText(val) {
      this.treeFilterIng = true;
      this.$refs.tree.filter(val);
      this.$nextTick(() => {
        this.treeFilterIng = false;
        if (this.tool.isEmpty(val)) {
          this.$refs.tree.$children.forEach((one) => {
            if (one.node.expanded && this.expands.indexOf(one.node.key) < 0) {
              one.node.expanded = false;
            }
          });
        }
      });
    },
  },
  methods: {
    init() {
      if (this.extend && this.extend.expands) {
        this.expands = this.extend.expands;
      }
      this.ready = true;
      this.load();
    },
    refresh() {
      this.load();
    },
    reload() {
      this.load();
    },
    filterNode(value, data) {
      if (!value) return true;
      return (
        data.name && data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
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
    nodeClick(data, node) {
      this.rowClickTimeCache = this.rowClickTimeCache || {};
      let nowTime = new Date().getTime();
      let clickTime = this.rowClickTimeCache[node];
      this.rowClickTimeCache[node] = nowTime;
      if (clickTime) {
        let timeout = nowTime - clickTime;
        if (timeout < 300) {
          delete this.rowClickTimeCache[node];
          this.nodeDbClick(node);
        }
      }
    },
    expandAll() {
      this.$refs.tree.$children.forEach((one) => {
        if (!one.node.expanded) {
          // one.node.expand();
          one.node.expanded = true;
          let index = this.expands.indexOf(one.node.data.key);
          if (index < 0) {
            this.expands.push(one.node.data.key);
          }
        }
      });
      this.toolboxWorker.updateExtend({
        expands: this.expands,
      });
    },
    collapseAll() {
      this.$refs.tree.$children.forEach((one) => {
        if (one.node.expanded) {
          one.node.expanded = false;
          let index = this.expands.indexOf(one.node.data.key);
          if (index >= 0) {
            this.expands.splice(index, 1);
          }
        }
      });
      this.toolboxWorker.updateExtend({
        expands: this.expands,
      });
    },
    nodeDbClick(node) {
      if (!node.data.leaf) {
        if (node.expanded) {
          node.expanded = false;
          this.nodeCollapse(node.data);
        } else {
          node.expanded = true;
          this.nodeExpand(node.data);
        }
        return;
      } else {
        this.toInvoke(node.data);
      }
    },
    nodeContextmenu(event, data, node, nodeView) {
      let menus = [];

      if (!data.leaf && !data.isHistory) {
        menus.push({
          text: "新增",
          onClick: () => {
            this.toInsert({ isDir: false, parentId: data.id }, data);
          },
        });
      }
      if (data.leaf) {
        menus.push({
          text: "打开",
          onClick: () => {
            this.toInvoke(data);
          },
        });
      }
      if (!data.isHistory) {
        menus.push({
          text: "重命名",
          onClick: () => {
            this.toRename(data);
          },
        });

        if (data.leaf || data.children.length == 0) {
          menus.push({
            text: "删除",
            onClick: () => {
              this.toDelete(data);
            },
          });
        }
      } else {
        if (data.leaf) {
          menus.push({
            text: "删除",
            onClick: () => {
              this.toDelete(data);
            },
          });
        }
      }

      if (menus.length > 0) {
        this.tool.showContextmenu(menus);
      }
    },
    toRename(data) {
      this.lastRenameData = data;
      data.isRename = true;
      this.$nextTick(() => {
        this.$el
          .getElementsByClassName("toolbox-editor-tree-rename-input")[0]
          .focus();
      });
    },
    async doRename(data) {
      if (this.tool.isEmpty(data.newname) && !data.id) {
        this.$refs.tree.remove(this.$refs.tree.getNode(data));
        return;
      }
      if (this.tool.isEmpty(data.newname) || data.name == data.newname) {
        if (data.id) {
          data.newname = data.name;
          data.isRename = false;
          return;
        }
      }
      let res = null;
      if (!data.id) {
        res = await this.toolboxWorker.saveExtend({
          name: data.newname,
          extendType: "http-api",
          extend: {
            isDir: data.isDir,
            parentId: data.parentId,
          },
        });
      } else {
        res = await this.toolboxWorker.saveExtend({
          name: data.newname,
          extendId: data.id,
        });
      }
      if (res.data == null) {
        this.toFocusFile(data);
      } else {
        data.id = res.data.extendId;
        data.name = data.newname;
        data.isRename = false;
        let node = this.$refs.tree.getNode(data);
        if (node.parent) {
          node.parent.childNodes.sort(
            (a, b) =>
              !a.data.isEmpty &&
              a.data.name &&
              a.data.name.localeCompare(b.data.name)
          );
        }
      }
    },
    toBlurData(data) {
      this.$nextTick(() => {
        if (
          this.$el.getElementsByClassName("toolbox-editor-tree-rename-input")[0]
        ) {
          this.$el
            .getElementsByClassName("toolbox-editor-tree-rename-input")[0]
            .blur();
        }
      });
    },
    onRenameBlur(data, event) {
      this.doRename(data);
    },
    onRenameKeyup(data, event) {
      event = event || window.event;
      if (event.keyCode == 13 || event.keyCode == 27) {
        this.toBlurData(data);
      }
    },
    toInsert(data, parent) {
      if (parent) {
        this.$refs.tree.getNode(parent).expanded = true;
      }
      data.leaf = !data.isDir;
      data.name = "";
      data.newname = "default";
      data.isRename = false;
      data.key = this.tool.getNumber();
      data.children = [];
      let node = this.$refs.tree.root;
      if (parent) {
        data.parentId = parent.id;
        node = this.$refs.tree.getNode(parent);
      }
      this.$refs.tree.append(data, node);
      this.$nextTick(() => {
        this.toRename(data);
      });
      // this.$refs.tree.remove(this.$refs.tree.getNode(data));
    },
    toConfig() {
      let extend = {
        name: "配置",
        title: "配置",
        type: "config",
        onlyOpenOneKey: "config",
      };
      this.toolboxWorker.openTabByExtend(extend);
    },
    toInvoke(data) {
      if (data == null) {
        return;
      }
      if (data.executeId) {
        let extend = {
          name: data.name,
          title: data.name,
          type: "invoke",
          extendId: data.extendId,
          executeId: data.executeId,
        };
        this.toolboxWorker.openTabByExtend(extend);
        return;
      }
      if (data.id) {
        let extend = {
          name: data.name,
          title: data.name,
          type: "invoke",
          extendId: data.id,
        };
        this.toolboxWorker.openTabByExtend(extend);
        return;
      }
    },

    async load() {
      this.dataListLoading = true;
      let packList = [];
      let res = await this.server.http.history(
        this.toolboxWorker.getWorkParam({})
      );
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let history = {
        key: "0",
        name: "历史执行记录",
        children: [],
        isHistory: true,
      };
      packList.push(history);
      if (res.data) {
        res.data.forEach((one) => {
          if (one.request == null) {
            return;
          }
          let data = {
            extendId: one.request.extendId,
            executeId: one.request.executeId,
            key: one.request.executeId,
            name: one.request.name,
            isHistory: true,
            leaf: true,
          };
          history.children.push(data);
        });
      }
      let param = this.toolboxWorker.getWorkParam({
        extendType: "http-api",
      });
      res = await this.server.toolbox.extend.query(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let dataList = res.data || [];
      let childrenCache = {};
      dataList.sort((a, b) => a.name && a.name.localeCompare(b.name));
      dataList.forEach((one) => {
        one.extend = one.extend || {};
        let parentChildren = null;
        childrenCache[one.extendId] = childrenCache[one.extendId] || [];
        if (this.tool.isNotEmpty(one.extend.parentId)) {
          childrenCache[one.extend.parentId] =
            childrenCache[one.extend.parentId] || [];
          parentChildren = childrenCache[one.extend.parentId];
        }
        let data = {
          id: one.extendId,
          key: one.extendId,
          name: one.name,
          parentId: one.extend.parentId,
          children: childrenCache[one.extendId],
          leaf: !one.extend.isDir,
          isRename: false,
          newname: one.name,
        };
        if (parentChildren) {
          parentChildren.push(data);
        } else {
          packList.push(data);
        }
      });
      this.packList = packList;
      this.dataListLoading = false;
    },
    toDelete(data) {
      this.tool.stopEvent();
      let msg = "确认删除 [" + data.name + "] ?";
      this.tool
        .confirm(msg)
        .then(async () => {
          this.doDelete(data);
        })
        .catch((e) => {});
    },
    async doDelete(data) {
      if (data.executeId) {
        let param = this.toolboxWorker.getWorkParam({
          executeId: data.executeId,
        });
        let res = await this.server.http.deleteExecute(param);
        if (res.code != 0) {
          this.tool.error(res.msg);
        } else {
          this.$refs.tree.remove(this.$refs.tree.getNode(data));
        }
        return;
      }
      let param = this.toolboxWorker.getWorkParam({
        extendId: data.id,
      });
      let res = await this.server.toolbox.extend.delete(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.$refs.tree.remove(this.$refs.tree.getNode(data));
      }
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-thrift-services {
  width: 100%;
  height: 100%;
}
</style>
