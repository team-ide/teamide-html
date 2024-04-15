<template>
  <div class="toolbox-maker-modelers">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout height="60px">
          <div class="pdlr-10 pdt-10">
            <div class="tm-btn tm-btn-xs bg-grey-6" @click="refresh()">
              刷新
            </div>
            <div class="tm-btn tm-btn-xs bg-grey-6" @click="collapseAll()">
              收起所有
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
                :data="worker.treeData"
                :props="defaultProps"
                :default-expanded-keys="expands"
                node-key="key"
                :expand-on-click-node="true"
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
  props: ["source", "toolboxWorker", "extend", "worker"],
  data() {
    return {
      ready: false,
      expands: [],
      defaultProps: {
        children: "children",
        label: "text",
      },
      filterText: "",
    };
  },
  computed: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
      if (this.tool.isEmpty(val)) {
        this.$nextTick(() => {
          this.initDefaultExpands();
        });
      }
    },
  },
  methods: {
    init() {
      if (this.extend && this.extend.expands) {
        this.expands = this.extend.expands;
      }
      this.ready = true;
    },
    async refresh() {
      await this.worker.build();
    },
    collapseAll() {
      let children = this.$refs.tree.children || [];
      children.forEach((data) => {
        let node = this.$refs.tree.getNode(data.key);
        if (node == null || !node.expanded) {
          return;
        }
        node.collapse();
      });
      this.expands = [];
      this.toolboxWorker.updateExtend({
        expands: this.expands,
      });
    },
    initDefaultExpands() {
      this.is_initDefaultExpands = true;
      let expands = this.expands;
      let children = this.$refs.tree.children || [];
      children.forEach((data) => {
        let node = this.$refs.tree.getNode(data.key);
        if (node == null || !node.expanded) {
          return;
        }
        node.collapse();
      });
      expands.forEach((key) => {
        let node = this.$refs.tree.getNode(key);
        if (node == null || node.expanded) {
          return;
        }
        node.expand();
      });
      this.is_initDefaultExpands = false;
    },
    filterNode(value, data) {
      if (!value) return true;
      return (
        data.text && data.text.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    },
    nodeExpand(data) {
      if (this.is_initDefaultExpands) {
        return;
      }
      let index = this.expands.indexOf(data.key);
      if (index < 0) {
        this.expands.push(data.key);
        this.toolboxWorker.updateExtend({
          expands: this.expands,
        });
      }
      this.initTreeWidth();
    },
    nodeCollapse(data) {
      if (this.is_initDefaultExpands) {
        return;
      }
      let needDeletes = [];
      needDeletes.push(data.key);
      this.expands.forEach((one) => {
        if (("" + one).startsWith("" + data.key + "/")) {
          needDeletes.push(one);
        }
      });
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
      this.initTreeWidth();
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
      if (data.children && data.children.length > 0) {
        if (node.expanded) {
          node.collapse();
        } else {
          node.expand();
        }
      } else {
        this.toOpen(data);
      }
    },
    nodeContextmenu(event, data, node, nodeView) {
      let menus = [];

      if (menus.length > 0) {
        this.tool.showContextmenu(menus);
      }
    },
    async toOpen(data) {
      let name = data.modelName;
      let extend = {
        name: data.modelTypeText + "/" + name,
        title: data.modelTypeText + "/" + name,
        type: "model-editor",
        modelName: name,
        modelType: data.modelType,
      };
      this.toolboxWorker.openTabByExtend(extend);
    },
    initTreeWidth() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.tool.initTreeWidth(this.$refs.tree, this.$refs.treeBox);
        });
      }, 100);
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-maker-modelers {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
