<template>
  <el-dialog
    ref="modal"
    title="Http请求记录"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :show-close="true"
    :append-to-body="true"
    :visible="showDialog"
    :before-close="hide"
    :destroy-on-close="true"
    class="app-dialog"
    :fullscreen="true"
  >
    <div class="pd-10 toolbox-editor" style="height: 100%">
      <tm-layout height="100%">
        <tm-layout height="110px">
          <el-form
            class="pdt-10 pdlr-10"
            size="mini"
            :inline="true"
            @submit.native.prevent
          >
            <el-form-item label="此工具保存的记录">
              <el-switch v-model="thisToolbox" />
            </el-form-item>
            <el-form-item label="">
              <div class="">
                <div
                  class="tm-btn tm-btn-sm bg-grey ft-13"
                  @click="load()"
                  :class="{ 'tm-disabled': dataListLoading }"
                >
                  刷新
                </div>
              </div>
            </el-form-item>
          </el-form>
        </tm-layout>
        <tm-layout height="auto" class="">
          <div style="height: 100%">
            <el-table
              :data="dataList"
              :border="true"
              height="100%"
              style="width: 100%"
              size="mini"
              v-loading="dataListLoading"
            >
              <el-table-column label="路径" width="200">
                <template slot-scope="scope">
                  {{ scope.row.extend && scope.row.extend.path }}
                </template>
              </el-table-column>
              <el-table-column label="方法" width="80">
                <template slot-scope="scope">
                  {{ scope.row.extend && scope.row.extend.method }}
                </template>
              </el-table-column>
              <el-table-column label="请求内容">
                <template slot-scope="scope">
                  {{ scope.row.extend && scope.row.extend.body }}
                </template>
              </el-table-column>
              <el-table-column width="140" label="创建时间">
                <template slot-scope="scope">
                  {{
                    tool.formatDate(
                      new Date(scope.row.createTime),
                      "yyyy-MM-dd hh:mm:ss"
                    )
                  }}
                </template>
              </el-table-column>
              <el-table-column width="140" label="更新时间">
                <template slot-scope="scope">
                  {{
                    tool.formatDate(
                      new Date(scope.row.updateTime || scope.row.createTime),
                      "yyyy-MM-dd hh:mm:ss"
                    )
                  }}
                </template>
              </el-table-column>
              <el-table-column width="150" label="操作" fixed="right">
                <template slot-scope="scope">
                  <div
                    v-if="onOpen != null"
                    class="tm-btn color-green tm-btn-xs"
                    @click="toOpen(scope.row)"
                  >
                    打开
                  </div>
                  <div
                    class="tm-btn color-orange tm-btn-xs"
                    @click="toDelete(scope.row)"
                  >
                    删除
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </tm-layout>
      </tm-layout>
    </div>
  </el-dialog>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker"],
  data() {
    return {
      showDialog: false,
      thisToolbox: true,
      dataList: [],
      dataListLoading: false,
      onOpen: null,
      uploadReady: true,
      extendType: "esReqeustRecords",
    };
  },
  computed: {},
  watch: {
    thisToolbox() {
      this.load();
    },
  },
  methods: {
    init() {},
    show(options) {
      this.showDialog = true;
      this.options = options || {};
      this.indexName = this.options.indexName;
      this.onOpen = this.options.onOpen;
      this.$nextTick(() => {
        this.load();
      });
    },
    hide() {
      this.showDialog = false;
    },
    async load() {
      this.dataListLoading = true;
      let param = this.toolboxWorker.getWorkParam({
        extendType: this.extendType,
      });
      if (!this.thisToolbox) {
        delete param.toolboxId;
      }
      let res = await this.server.toolbox.extend.query(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let dataList = res.data || [];
      this.dataList = dataList;
      this.dataListLoading = false;
    },
    toOpen(data) {
      this.onOpen && this.onOpen(data);
      this.hide();
    },

    async toDelete(data) {
      let param = this.toolboxWorker.getWorkParam({
        extendId: data.extendId,
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
    this.toolboxWorker.showRequestRecords = this.show;
    this.init();
  },
};
</script>

<style>
</style>
