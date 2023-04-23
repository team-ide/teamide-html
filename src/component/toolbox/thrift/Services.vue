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
            <div class="color-orange ft-12 pdt-5">双击展开目录或打开方法</div>
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
              :data="serviceList"
              :props="defaultProps"
              node-key="key"
              @node-click="nodeClick"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
            >
              <span
                class="toolbox-editor-tree-span"
                slot-scope="{ data }"
                :title="data.searchText"
              >
                <span>{{ data.name }}</span>
                <div class="toolbox-editor-tree-btn-group"></div>
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
      serviceList: null,
      defaultProps: {
        children: "methods",
        label: "name",
        isLeaf: "leaf",
      },
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
      this.toolboxWorker.getMethod = this.getMethod;
      this.ready = true;
      this.loadContext();
    },
    refresh() {
      this.loadContext();
    },
    reload() {
      this.loadContext(true);
    },
    filterNode(value, data) {
      if (!value) return true;
      return (
        data.name && data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
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
        }
      });
    },
    collapseAll() {
      this.$refs.tree.$children.forEach((one) => {
        if (one.node.expanded) {
          one.node.expanded = false;
        }
      });
    },
    nodeDbClick(node) {
      if (!node.isLeaf) {
        if (node.expanded) {
          node.expanded = false;
        } else {
          node.expanded = true;
        }
        return;
      } else {
        this.toMethodInvoke(node.data);
      }
    },
    toMethodInvoke(data) {
      let extend = {
        name: data.serviceName + "." + data.name,
        title: data.serviceName + "." + data.name,
        type: "invoke",
        relativePath: data.relativePath,
        serviceName: data.serviceName,
        methodName: data.name,
      };
      this.toolboxWorker.openTabByExtend(extend);
    },

    async loadContext(reload) {
      let param = this.toolboxWorker.getWorkParam({
        reload: reload,
      });
      let res = await this.server.thrift.context(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      res.data = res.data || {};
      let serviceList = res.data.serviceList || [];
      serviceList.forEach((one) => {
        one.key = one.relativePath + "-" + one.name;
        one.methods = one.methods || [];
        one.leaf = false;
        one.searchText = one.name;
        one.methods.forEach((method) => {
          method.key = one.key + "-" + method.name;
          method.relativePath = one.relativePath;
          method.serviceName = one.name;
          method.searchText = one.name + "." + method.name;
          method.leaf = true;
        });
      });
      this.serviceList = serviceList;
    },
    async getMethod(indexName) {
      let param = this.toolboxWorker.getWorkParam({
        indexName: indexName,
      });
      let res = await this.server.elasticsearch.getMapping(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      return res.data || {};
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
