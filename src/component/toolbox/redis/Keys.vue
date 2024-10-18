<template>
  <div class="toolbox-redis-keys">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout height="100px">
          <el-form class="pdt-5 pdlr-10" size="mini" inline>
            <el-form-item label="Database" class="mgb-5" label-width="75px">
              <el-input v-model="searchForm.database" style="width: 80px" />
            </el-form-item>
            <el-form-item
              label="匹配数量"
              class="mgb-5"
              title="查询到一定数量后停止查询"
            >
              <el-input v-model="searchForm.size" style="width: 70px" />
            </el-form-item>
            <el-form-item label="" class="mgb-5" title="Scan 轮询 每次查询数量">
              <el-input v-model="searchForm.count" style="width: 70px" />
            </el-form-item>
          </el-form>
          <el-form class="pdlr-10" size="mini" label-width="75px">
            <el-form-item label="模糊搜索" class="mgb-5">
              <el-input v-model="searchForm.pattern">
                <div
                  slot="append"
                  class="tm-btn tm-btn-sm bg-teal-8"
                  @click="toSearch"
                >
                  搜索
                </div>
              </el-input>
            </el-form-item>
          </el-form>
          <div class="pdlr-10">
            <div class="tm-btn tm-btn-xs bg-green" @click="toInsert">新增</div>
            <div class="tm-btn tm-btn-xs bg-grey" @click="toImport()">导入</div>
            <div class="tm-btn tm-btn-xs bg-grey" @click="toExport()">导出</div>
            <div
              class="tm-btn tm-btn-xs bg-grey"
              @click="toolboxWorker.showInfo()"
            >
              信息
            </div>
            <div
              class="tm-btn tm-btn-xs bg-orange"
              @click="toDeletePattern(searchForm.database, searchForm.pattern)"
            >
              删除
            </div>
          </div>
        </tm-layout>
        <tm-layout height="auto">
          <template v-if="searchResult == null">
            <div class="text-center ft-13 pdtb-10">数据加载中，请稍后!</div>
          </template>
          <template v-else>
            <div class="text-center ft-12 pdtb-8">
              查询
              <span class="color-green-2 pdlr-3">
                {{ searchResult.count }}</span
              >
              个 Keys
              <el-radio-group v-model="viewModel">
                <el-radio
                  label="list"
                  class="mglr-0 mgl-10"
                  v-remove-aria-hidden
                  >列表</el-radio
                >
                <el-radio
                  label="tree"
                  class="mglr-0 mgl-10"
                  v-remove-aria-hidden
                >
                  树形 ( 分割符号 )
                </el-radio>
              </el-radio-group>
            </div>

            <el-form class="pdlr-10" size="mini" inline>
              <el-form-item label="分割符号" class="mgb-5">
                <el-input
                  v-model="splitChars"
                  @change="initData()"
                  style="letter-spacing: 2px; width: 100px"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="过滤" class="mgb-5 mgr-0">
                <el-input
                  placeholder="输入关键字进行过滤"
                  v-model="filterText"
                  style="width: 210px"
                >
                </el-input>
              </el-form-item>
            </el-form>

            <div
              class="app-scroll-bar"
              style="height: calc(100% - 70px); overflow: auto"
            >
              <div class="pdlr-10">
                <el-tree
                  ref="tree"
                  :props="defaultProps"
                  node-key="key"
                  :expand-on-click-node="false"
                  :data="
                    viewModel == 'list'
                      ? searchResult.keyList
                      : searchResult.treeDatas
                  "
                  :filter-node-method="filterNode"
                  @node-click="nodeClick"
                  @node-contextmenu="nodeContextmenu"
                  empty-text="暂无匹配数据"
                  style="user-select: text"
                >
                  <span
                    class="toolbox-editor-tree-span"
                    slot-scope="{ node, data }"
                  >
                    <span>
                      {{ node.label }}
                      <span v-if="data.splits" class="color-grey pdlr-10">
                        (
                        <span class="pdlr-2">{{
                          data.splits.join(" , ")
                        }}</span>
                        )
                      </span>
                    </span>
                    <template v-if="data.isData">
                      <div class="toolbox-editor-tree-btn-group">
                        <div
                          class="tm-link color-green ft-15 mgr-2"
                          @click="toUpdate(data)"
                        >
                          <i class="mdi mdi-text-box-edit-outline"></i>
                        </div>
                        <div
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
            </div>
          </template>
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
      searchForm: {
        database: 0,
        pattern: "xx*",
        size: 200,
        count: 10000,
      },
      splitChars: ": - / _ #",
      searchResult: null,
      viewModel: "list",
      filterText: "",
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: "leaf",
      },
    };
  },
  computed: {},
  watch: {
    filterText(val) {
      if (this.$refs.tree == null) {
        return;
      }
      this.$refs.tree.filter(val);
      if (this.tool.isEmpty(this.filterText)) {
        this.$nextTick(() => {
          let root = this.$refs.tree.root;
          root.childNodes.forEach((one) => {
            one.expanded = false;
          });
        });
      }
    },
    viewModel() {
      if (this.$refs.tree == null) {
        return;
      }
      this.initData();
      this.$nextTick(() => {
        this.$refs.tree.filter(this.filterText);
      });
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return (
        data.key && data.key.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    },
    init() {
      this.ready = true;
      if (this.extend && this.extend.search) {
        if (this.extend.search.pattern) {
          this.searchForm.pattern = this.extend.search.pattern;
        }
        if (this.extend.search.database >= 0) {
          this.searchForm.database = this.extend.search.database;
        }
        if (this.extend.search.size >= 0) {
          this.searchForm.size = this.extend.search.size;
        }
        if (this.extend.search.count >= 0) {
          this.searchForm.count = this.extend.search.count;
        }
        if (this.tool.isNotEmpty(this.extend.search.viewModel)) {
          this.viewModel = this.extend.search.viewModel;
        }
        if (this.tool.isNotEmpty(this.extend.search.filterText)) {
          this.filterText = this.extend.search.filterText;
        }
      }
      this.toolboxWorker.loadKeys = this.loadKeys;
      this.loadKeys();
    },
    refresh() {
      this.toSearch();
    },
    toSearch() {
      this.loadKeys();
      this.toolboxWorker.updateExtend({
        search: {
          pattern: this.searchForm.pattern,
          database: Number(this.searchForm.database),
          size: Number(this.searchForm.size),
          count: Number(this.searchForm.count),
          viewModel: this.viewModel,
          filterText: this.filterText,
        },
      });
    },
    initData() {
      if (this.searchResult == null) {
        return;
      }
      if (this.viewModel == "tree") {
        this.initTreeData(this.searchResult);
      }
    },
    async loadKeys() {
      this.searchResult = null;
      this.searchForm.database = Number(this.searchForm.database);

      let param = this.toolboxWorker.getWorkParam(
        Object.assign({}, this.searchForm)
      );
      Object.assign(param, this.searchForm);
      if (this.tool.isEmpty(param.size)) {
        param.size = 50;
      }
      param.size = Number(param.size);
      if (this.tool.isEmpty(param.count)) {
        param.count = 10000;
      }
      param.count = Number(param.count);
      if (this.tool.isEmpty(param.pattern)) {
        this.tool.warn("请输入“*”或“user*”等关键字模糊搜索");
        return;
      }
      let res = await this.server.redis.scan(param);
      if (res.code == 0) {
        let keysData = res.data || {};
        this.formatData(keysData);
        this.searchResult = keysData;
      } else {
        this.tool.error(res.msg);
      }
    },
    formatData(keysData) {
      keysData.keyList = keysData.keyList || [];

      keysData.keyList.forEach((data) => {
        data.database = keysData.database;
        data.isData = true;
        data.name = data.key;
      });
      keysData.treeDatas = [];
      if (this.viewModel == "tree") {
        this.initTreeData(keysData);
      }
    },
    initTreeData(keysData) {
      keysData.treeDatas = [];
      var treeDataCache = {};
      let splitChars = [];
      if (this.tool.isNotEmpty(this.splitChars)) {
        splitChars = this.splitChars.split(" ");
      }
      keysData.keyList.forEach((data) => {
        let treeData = {
          database: data.database,
          key: data.key,
          name: data.key,
          isData: true,
          children: [],
        };
        let lastFind = null;
        let dataKey = data.key;
        var ss = [dataKey];
        var spSS = [""];
        splitChars.forEach((splitChar) => {
          let newSS = [];
          let newSpSS = [];
          ss.forEach((s, i) => {
            if (s.indexOf(splitChar) >= 0) {
              let ss_ = s.split(splitChar);
              ss_.forEach((s_) => {
                newSS.push(s_);
                newSpSS.push(splitChar);
              });
            } else {
              newSS.push(s);
              newSpSS.push(spSS[i]);
            }
          });
          ss = newSS;
          spSS = newSpSS;
        });
        let lastK = "";
        ss.forEach((s, i) => {
          treeData.name = s;
          if (i >= ss.length - 1) {
            return;
          }
          // if (i > 0) {
          lastK += spSS[i];
          // }
          lastK += s;
          let find = treeDataCache[lastK];
          if (find == null) {
            find = {
              database: data.database,
              key: lastK,
              name: s,
              splits: [spSS[i]],
              isData: false,
              children: [],
            };
            treeDataCache[lastK] = find;
            if (lastFind != null) {
              lastFind.children.push(find);
            } else {
              keysData.treeDatas.push(find);
            }
          } else {
            if (find.splits.indexOf(spSS[i]) < 0) {
              find.splits.push(spSS[i]);
            }
          }
          lastFind = find;
        });

        if (lastFind != null) {
          lastFind.children.push(treeData);
        } else {
          keysData.treeDatas.push(treeData);
        }
      });
    },
    rowClick(data) {
      this.rowClickTimeCache = this.rowClickTimeCache || {};
      let nowTime = new Date().getTime();
      let clickTime = this.rowClickTimeCache[data];
      this.rowClickTimeCache[data] = nowTime;
      if (clickTime) {
        let timeout = nowTime - clickTime;
        if (timeout < 300) {
          delete this.rowClickTimeCache[data];
          this.rowDbClick(data);
        }
      }
    },
    rowDbClick(data) {
      this.toUpdate(data);
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
    nodeDbClick(node) {
      if (node.data.isData) {
        this.toUpdate(node.data);
        return;
      }
      if (node.expanded) {
        node.expanded = false;
      } else {
        node.loaded = false;
        node.expand();
      }
    },
    nodeContextmenu(event, data, node, nodeView) {
      if (data.isData) {
        this.dataContextmenu(data);
      }
    },
    dataContextmenu(data) {
      let menus = [];
      menus.push({
        header: data.key,
      });
      menus.push({
        text: "修改",
        onClick: () => {
          this.toUpdate(data);
        },
      });
      menus.push({
        text: "新增",
        onClick: () => {
          this.toInsert();
        },
      });
      menus.push({
        text: "导入",
        onClick: () => {
          this.toImport(data);
        },
      });
      menus.push({
        text: "导出",
        onClick: () => {
          this.toExport(data);
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
    async toExport(data) {
      let extend = {
        options: {
          from: {
            type: "redis",
            toolboxId: this.toolboxWorker.toolboxId,
          },
        },
      };
      let title = "[导出]";
      extend.type = "datamove";
      extend.name = title;
      extend.title = title;
      this.toolboxWorker.openTabByExtend(extend);
    },
    async toImport(data) {
      let extend = {
        options: {
          to: {
            type: "redis",
            toolboxId: this.toolboxWorker.toolboxId,
          },
        },
      };
      let title = "[导入]";
      extend.type = "datamove";
      extend.name = title;
      extend.title = title;
      this.toolboxWorker.openTabByExtend(extend);
    },
    toInsert() {
      let extend = {
        name: "新增数据",
        title: "新增数据",
        type: "data",
        database: this.searchForm.database,
      };
      this.toolboxWorker.openTabByExtend(extend);
    },
    toUpdate(data) {
      let extend = {
        name: `编辑[${data.key}]数据`,
        title: `编辑[${data.key}]数据`,
        type: "data",
        key: data.key,
        keyBase64: data.keyBase64,
        database: data.database,
        onlyOpenOneKey: "redis:data:key" + data.key,
      };
      this.toolboxWorker.openTabByExtend(extend);
    },
    toDelete(data) {
      this.tool
        .confirm("确认删除[" + data.key + "]？")
        .then(async () => {
          this.doDelete(data.database, data.key, data.keyBase64);
        })
        .catch((e) => {});
    },
    toDeletePattern(database, pattern, keyBase64) {
      this.tool
        .confirm("将删除所有匹配[" + pattern + "]的Key，确定删除？")
        .then(async () => {
          this.doDeletePattern(database, pattern, keyBase64);
        })
        .catch((e) => {});
    },
    async doDelete(database, key, keyBase64) {
      let param = this.toolboxWorker.getWorkParam({
        database: Number(database),
        key: key,
        keyBase64: keyBase64,
      });
      let res = await this.server.redis.delete(param);
      if (res.code == 0) {
        this.tool.success("删除成功!");
        this.toSearch();
      } else {
        this.tool.error(res.msg);
      }
    },
    async doDeletePattern(database, pattern) {
      let param = this.toolboxWorker.getWorkParam({
        database: Number(database),
        pattern: pattern,
      });
      let res = await this.server.redis.deletePattern(param);
      if (res.code == 0) {
        this.tool.success("删除成功!");
        this.toSearch();
      } else {
        this.tool.error(res.msg);
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
.toolbox-redis-keys {
  width: 100%;
  height: 100%;
}
</style>
