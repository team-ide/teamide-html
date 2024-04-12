<template>
  <div class="toolbox-maker-modelers">
    <template v-if="ready">
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
            <span class="toolbox-editor-tree-span" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <div class="toolbox-editor-tree-btn-group">
                <div
                  v-if="data.hasChildren"
                  class="tm-link color-grey ft-14 mgr-4"
                  @click="toReloadChildren(data)"
                >
                  <i class="mdi mdi-reload"></i>
                </div>
              </div>
            </span>
          </el-tree>
        </div>
      </div>
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
    refresh() {
      this.reloadChildren(this.$refs.tree.root);
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
      if (data.hasChildren) {
        this.expands.forEach((one) => {
          if (("" + one).startsWith("" + data.key + ":")) {
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
    nodeContextmenu(event, data, node, nodeView) {
      let menus = [];

      if (menus.length > 0) {
        this.tool.showContextmenu(menus);
      }
    },
    toOpen(data) {
      let extend = {
        name: data.owner.ownerName + "." + data.tableName,
        title: data.owner.ownerName + "." + data.tableName,
        type: "data",
        ownerName: data.owner.ownerName,
        tableName: data.tableName,
      };
      this.toolboxWorker.openTabByExtend(extend);
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        let context = await this.toolboxWorker.loadContext();
        console.log(context);
        let list = [];
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
