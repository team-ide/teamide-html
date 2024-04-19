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
                <span
                  class="toolbox-editor-tree-span"
                  slot-scope="{ node, data }"
                >
                  <template v-if="data.isModel">
                    <i
                      class="mdi mdi-file"
                      style="vertical-align: 0px; margin-right: 5px"
                    >
                    </i>
                  </template>
                  <template v-else-if="data.isType">
                    <i
                      class="mdi mdi-apps-box color-orange"
                      style="vertical-align: 0px; margin-right: 5px"
                    >
                    </i>
                  </template>
                  <template v-else-if="data.isPack">
                    <i
                      class="mdi mdi-folder color-orange-3"
                      style="vertical-align: 0px; margin-right: 5px"
                    >
                    </i>
                  </template>
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
      if (data.key == "config") {
        return;
      }
      console.log(data);
      let modelType = data.modelType;
      let modelName = data.key.substring(data.modelType.length + 1);
      let parentModelName = "";
      if (data.isType) {
        modelType = data.key;
      }
      if (data.isPack) {
        parentModelName = data.key.substring(modelType.length + 1);
      }
      if (data.isModel) {
        menus.push({
          text: "打开模型",
          onClick: () => {
            this.toOpen(data);
          },
        });
      } else {
        let newModelName = "xxx";
        if (this.tool.isNotEmpty(parentModelName)) {
          newModelName = parentModelName + "/" + newModelName;
        }
        menus.push({
          text: "新建模型",
          onClick: () => {
            this.worker.showModelForm({
              title: "新建模型",
              isPack: false,
              modelName: newModelName,
              modelType: modelType,
            });
          },
        });
        menus.push({
          text: "新建包",
          onClick: () => {
            this.worker.showModelForm({
              title: "新建包",
              isPack: true,
              modelName: newModelName,
              modelType: modelType,
            });
          },
        });
      }
      if (!data.isType) {
        menus.push({
          text: "重命名",
          onClick: () => {
            this.worker.showModelForm({
              title: "重命名" + modelName,
              isPack: data.isPack,
              modelName: modelName,
              modelType: modelType,
              isUpdate: true,
            });
          },
        });
        menus.push({
          text: "删除",
          onClick: () => {
            this.tool
              .confirm("删除路径[" + modelName + "]后将无法恢复，确定删除？")
              .then(async () => {
                await this.worker.remove(modelType, modelName, data.isPack);
              })
              .catch((e) => {});
          },
        });
      }
      if (menus.length > 0) {
        this.tool.showContextmenu(menus);
      }
    },
    async toOpen(data) {
      if (
        data == null ||
        this.tool.isEmpty(data.modelType) ||
        this.tool.isEmpty(data.key)
      ) {
        return;
      }
      if (!data.isModel) {
        return;
      }
      let modelName = data.key.substring(data.modelType.length + 1);
      let name = data.modelTypeText + "/" + modelName;
      let title = data.modelTypeText + "/" + modelName;
      if (data.isType) {
        title = "";
        if (data.parent) {
          title += data.parent.text + "/";
        }
        title += data.modelTypeText;
        name = title;
        modelName = data.text;
      }
      let extend = {
        name: name,
        title: title,
        type: "model-editor",
        modelName: modelName,
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
