<template>
  <div class="toolbox-elasticsearch-index">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout height="80px">
          <el-form class="pdt-10 pdlr-10" size="mini" inline>
            <el-form-item label="" class="mgb-5">
              <div class="tm-btn tm-btn-xs bg-grey-6" @click="loadIndexes">
                刷新
              </div>
              <div class="tm-btn tm-btn-xs bg-teal-8" @click="toInsert">
                新建索引
              </div>
              <div class="tm-btn tm-btn-xs bg-teal-8" @click="toOpenRequest()">
                Http请求
              </div>

              <div class="tm-btn tm-btn-xs bg-grey" @click="toImport()">
                导入
              </div>
              <div class="tm-btn tm-btn-xs bg-grey" @click="toExport()">
                导出
              </div>
              <div
                class="tm-btn tm-btn-xs bg-grey"
                @click="toolboxWorker.showInfo()"
              >
                信息
              </div>
            </el-form-item>
            <el-form-item label="搜索" class="mgb-5">
              <el-input v-model="searchForm.pattern" style="width: 300px" />
            </el-form-item>
          </el-form>
        </tm-layout>
        <tm-layout height="auto">
          <template v-if="indexes == null">
            <div class="text-center ft-13 pdtb-10">数据加载中，请稍后!</div>
          </template>
          <template v-else-if="indexes.length == 0">
            <div class="text-center ft-13 pdtb-10">暂无匹配数据!</div>
          </template>
          <template v-else>
            <div class="text-center ft-13 pdtb-10" style="height: 40px">
              Indexes （{{ indexes.length }}）
              <span class="color-orange">双击查看Index数据</span>
            </div>
            <div
              class="data-list-box app-scroll-bar"
              style="height: calc(100% - 40px); user-select: text"
            >
              <template v-for="(one, index) in indexes">
                <div
                  :key="index"
                  v-if="
                    tool.isEmpty(searchForm.pattern) ||
                    one.indexName
                      .toLowerCase()
                      .indexOf(searchForm.pattern.toLowerCase()) >= 0
                  "
                  class="data-list-one"
                  @click="rowClick(one)"
                  @contextmenu="dataContextmenu(one)"
                >
                  <div class="data-list-one-text">
                    {{ one.indexName }}
                  </div>
                </div>
              </template>
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
  props: ["source", "toolboxWorker", "extend", "indexesChange"],
  data() {
    return {
      ready: false,
      searchForm: {
        pattern: null,
      },
      indexes: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {
      this.toolboxWorker.getMapping = this.getMapping;
      this.ready = true;
      this.loadIndexes();
    },
    refresh() {
      this.loadIndexes();
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
      this.toOpenIndexName(data);
    },
    toOpenIndexName(data) {
      let extend = {
        name: data.indexName,
        title: data.indexName,
        type: "data",
        indexName: data.indexName,
        onlyOpenOneKey: "elasticsearch:data:indexName" + data.indexName,
      };
      this.toolboxWorker.openTabByExtend(extend);
    },
    dataContextmenu(data) {
      let menus = [];
      menus.push({
        header: data.indexName,
      });

      menus.push({
        text: "Http请求",
        onClick: () => {
          this.toOpenRequest(data);
        },
      });
      menus.push({
        text: "数据",
        onClick: () => {
          this.toOpenIndexName(data);
        },
      });
      menus.push({
        text: "结构",
        onClick: () => {
          this.toUpdateMapping(data);
        },
      });
      menus.push({
        text: "索引状态",
        onClick: () => {
          this.toShowIndexStat(data);
        },
      });
      menus.push({
        text: "新增索引",
        onClick: () => {
          this.toInsert();
        },
      });
      menus.push({
        text: "迁移",
        onClick: () => {
          this.toReindex(data);
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
            type: "elasticsearch",
            toolboxId: this.toolboxWorker.toolboxId,
          },
        },
      };
      let title = "[导出]";
      if (data == null) {
      } else {
        extend.options.from.indexName = data.indexName;
      }
      if (extend.options.from.indexName) {
        title += "[" + extend.options.from.indexName + "]索引";
      }
      extend.type = "datamove";
      extend.name = title;
      extend.title = title;
      this.toolboxWorker.openTabByExtend(extend);
      return;
    },
    async toImport(data) {
      let extend = {
        options: {
          to: {
            type: "elasticsearch",
            toolboxId: this.toolboxWorker.toolboxId,
          },
        },
      };
      let title = "[导入]";
      if (data == null) {
      } else {
        extend.options.to.indexName = data.indexName;
      }
      if (extend.options.to.indexName) {
        title += "[" + extend.options.to.indexName + "]索引";
      }
      extend.type = "datamove";
      extend.name = title;
      extend.title = title;
      this.toolboxWorker.openTabByExtend(extend);
      return;
    },
    toOpenRequest(data, selectSql) {
      let extend = {
        name: "Http请求",
        title: "Http请求",
        type: "request",
      };
      if (data) {
        extend.name += "-" + data.indexName;
        extend.title += "-" + data.indexName;
        extend.indexName = data.indexName;
      }
      // this.toolboxWorker.showRequestRecords({
      //   indexName: extend.indexName,
      //   onOpen: (data) => {
      //     extend["extendId"] = data.extendId;
      this.toolboxWorker.openTabByExtend(extend);
      // },
      // });
    },
    toInsert() {
      let data = {};

      this.tool.showForm({
        formType: "es-index",
        param: this.toolboxWorker.getWorkParam(),
        title: `新增索引`,
        data: [data],
        onSave: (res) => {
          if (res) {
            this.tool.success("新增索引成功");
            this.loadIndexes();
          }
        },
      });
    },
    toReindex(data) {
      this.toolboxWorker.showReindexForm(
        {
          indexName: data.indexName,
        },
        async (m) => {
          let flag = await this.doReindex(m);
          return flag;
        }
      );
    },
    async doReindex(data) {
      let param = this.toolboxWorker.getWorkParam({
        sourceIndexName: data.sourceIndexName,
        destIndexName: data.destIndexName,
      });
      let res = await this.server.elasticsearch.reindex(param);
      if (res.code == 0) {
        await this.loadIndexes();
        return true;
      } else {
        this.tool.error(res.msg);
        return false;
      }
    },
    async toShowIndexStat(data) {
      let param = this.toolboxWorker.getWorkParam({
        indexName: data.indexName,
      });
      let res = await this.server.elasticsearch.indexStat(param);
      if (res.code == 0) {
        this.tool.showJSONData(res.data);
      } else {
        this.tool.error(res.msg);
      }
    },
    toDelete(data) {
      let msg = "确认删除";
      msg += "索引[" + data.indexName + "]";
      msg += "?";
      this.tool
        .confirm(msg)
        .then(async () => {
          this.doDelete(data.indexName);
        })
        .catch((e) => {});
    },
    async toUpdateMapping(data) {
      let indexName = data.indexName;
      let mapping = await this.getMapping(indexName);
      this.toolboxWorker.showMappingForm(
        {
          indexName: indexName,
          mapping: mapping,
        },
        async (m) => {
          let flag = await this.putMapping(m.indexName, m.mapping);
          return flag;
        }
      );
    },
    async doDelete(indexName) {
      let param = this.toolboxWorker.getWorkParam({
        indexName: indexName,
      });
      let res = await this.server.elasticsearch.deleteIndex(param);
      if (res.code == 0) {
        this.tool.success("删除成功!");
        this.loadIndexes();
      } else {
        this.tool.error(res.msg);
      }
    },
    async loadIndexes() {
      this.indexes = null;
      let param = this.toolboxWorker.getWorkParam({});
      let res = await this.server.elasticsearch.indexes(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      res.data = res.data || [];
      this.indexes = res.data || [];
      this.indexesChange && this.indexesChange(this.indexes);
    },
    async getMapping(indexName) {
      let param = this.toolboxWorker.getWorkParam({
        indexName: indexName,
      });
      let res = await this.server.elasticsearch.getMapping(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      return res.data || {};
    },
    async putMapping(indexName, mapping) {
      let param = this.toolboxWorker.getWorkParam({
        indexName: indexName,
        mapping: mapping,
      });
      let res = await this.server.elasticsearch.putMapping(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
        return false;
      }
      return true;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-elasticsearch-index {
  width: 100%;
  height: 100%;
}
</style>
