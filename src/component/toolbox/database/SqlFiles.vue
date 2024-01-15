<template>
  <el-dialog
    ref="modal"
    title="Sql Files"
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
            <el-form-item label="此工具保存的SQL">
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
                <div class="tm-btn tm-btn-sm bg-teal-8 ft-13">
                  <el-upload
                    v-if="uploadReady"
                    :action="source.api + 'upload'"
                    :limit="1"
                    :data="{ place: 'sql-files' }"
                    :headers="{ JWT: tool.getJWT() }"
                    name="file"
                    :on-success="onFileUpload"
                    :show-file-list="false"
                  >
                    <div class="tm-link color-white">点击上传</div>
                  </el-upload>
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
              <el-table-column label="名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" label="文件大小">
                <template slot-scope="scope">
                  {{
                    tool.getSizeText(
                      scope.row.extend ? scope.row.extend.fileSize : 0
                    )
                  }}
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
                  <a
                    v-if="
                      scope.row.extend != null &&
                      scope.row.extend.filePath != null
                    "
                    class="tm-btn color-blue tm-btn-xs"
                    :href="
                      source.filesUrl +
                      scope.row.extend.filePath +
                      '?isDownload=true'
                    "
                  >
                    下载
                  </a>
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
        extendType: "sqlFile",
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

    async onFileUpload(response) {
      this.uploadReady = false;
      this.$nextTick(() => {
        this.uploadReady = true;
      });
      if (response.code != 0) {
        this.tool.error(response.msg);
        return false;
      }
      let file = response.data.files[0];
      let param = this.toolboxWorker.getWorkParam({
        extendType: "sqlFile",
        name: file.name,
        extend: {
          filePath: file.path,
        },
      });
      let res = await this.server.toolbox.extend.save(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.load();
        if (this.onOpen) {
          this.onOpen(res.data);
          this.hide();
        }
      }
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
    this.toolboxWorker.showSqlFiles = this.show;
    this.init();
  },
};
</script>

<style>
</style>
