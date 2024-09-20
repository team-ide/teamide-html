<template>
  <div class="toolbox-thrift-services">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout height="50px">
          <div class="pdlr-10 pdt-5">
            <div class="tm-btn tm-btn-xs bg-grey-6" @click="reload">刷新</div>
            <div class="tm-btn tm-btn-xs bg-grey-6" @click="expandAll">
              展开所有
            </div>
            <div class="tm-btn tm-btn-xs bg-grey-6" @click="collapseAll">
              收起所有
            </div>
            <div class="tm-btn tm-btn-xs bg-green" @click="toInsert()">
              新增
            </div>
            <div class="color-orange ft-12 pdt-5">双击展开目录或打开调用</div>
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
            >
              <span
                class="toolbox-editor-tree-span"
                slot-scope="{ data }"
                :title="data.searchText"
              >
                <span>{{ data.name }}</span>
                <div class="toolbox-editor-tree-btn-group">
                  <div
                    class="tm-link color-blue ft-16 mgr-2"
                    @click="toInsert({ isDir: false, parentId: data.id })"
                    v-if="!data.leaf"
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
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      ready: false,
      filterText: null,
      packList: null,
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
      if (!node.isLeaf) {
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
    toInsert(data) {
      this.toolboxWorker.showPackCreate(data, () => {
        this.load();
      });
    },
    toInvoke(data) {
      let extend = {
        name: data.name,
        title: data.name,
        type: "invoke",
        extendId: data.id,
        parentId: data.parentId,
      };
      this.toolboxWorker.openTabByExtend(extend);
    },

    async load() {
      this.dataListLoading = true;
      let param = this.toolboxWorker.getWorkParam({
        extendType: "http-api",
      });
      let res = await this.server.toolbox.extend.query(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let dataList = res.data || [];
      let packList = [];
      let childrenCache = {};
      dataList.forEach((one) => {
        one.extend = one.extend || {};
        console.log(one);
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
      let param = this.toolboxWorker.getWorkParam({
        extendId: data.id,
      });
      let res = await this.server.toolbox.extend.delete(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.load();
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
