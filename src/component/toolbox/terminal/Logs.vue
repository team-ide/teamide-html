<template>
  <el-dialog
    ref="modal"
    title="终端执行记录"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :show-close="true"
    :append-to-body="true"
    :visible="showDialog"
    :before-close="hide"
    :destroy-on-close="true"
    :fullscreen="true"
    class="app-dialog"
  >
    <div class="pd-10" style="height: calc(100% - 0px)">
      <el-table
        :data="dataList"
        :border="true"
        height="100%"
        style="width: 100%"
        size="mini"
      >
        <!-- @row-dblclick="rowDblClick" -->
        <el-table-column width="100" label="workerId">
          <template slot-scope="scope">
            <span>{{ scope.row.workerId }}</span>

            <span
              class="color-green mgl-5"
              v-if="scope.row.workerId == worker.workerId"
              >是当前</span
            >
          </template>
        </el-table-column>
        <el-table-column label="路径">
          <template slot-scope="scope">
            <span>{{ scope.row.path }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="大小">
          <template slot-scope="scope">
            <span>{{ scope.row.unitSize }}</span>
            <span>{{ scope.row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="时间">
          <template slot-scope="scope">
            <span>
              {{
                tool.formatDate(
                  new Date(scope.row.modTime),
                  "yyyy-MM-dd hh:mm:ss"
                )
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="操作" fixed="right">
          <template slot-scope="scope">
            <div
              class="tm-btn color-green tm-btn-xs"
              @click="toDownload(scope.row)"
            >
              下载
            </div>
            <div
              class="tm-btn color-grey tm-btn-xs"
              @click="toClean(scope.row)"
            >
              清理
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
  </el-dialog>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "worker"],
  data() {
    return {
      showDialog: false,
      dataList: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    show(onClose) {
      this.showDialog = true;
      this.onClose = onClose;
      this.loadLogs();
    },
    hide() {
      this.showDialog = false;
      this.onClose && this.onClose();
    },
    async loadLogs() {
      this.dataList = null;
      let dataList = await this.worker.getLogs();
      dataList = dataList || [];
      dataList.forEach((one) => {
        this.tool.formatSize(one, "size", "unitSize", "unit");
      });
      this.dataList = dataList;
    },
    toDownload(data) {
      let param = this.worker.getParam();
      let url = this.source.api + "terminal/downloadLog?";
      url = this.tool.appendUrlBaseParam(url);
      url += "&place=" + encodeURIComponent(param.place);
      url += "&placeId=" + encodeURIComponent(param.placeId);
      url += "&workerId=" + encodeURIComponent(data.workerId);
      if (this.toolboxWorker.extend) {
        url +=
          "&fileName=" + encodeURIComponent(this.toolboxWorker.extend.title);
      }
      window.location.href = url;
    },
    toClean(data) {
      let msg = "清理日志后无法恢复，确认清理？";
      this.tool
        .confirm(msg)
        .then(async () => {
          let param = this.worker.getParam();
          param.workerId = data.workerId;
          let res = await this.server.terminal.cleanLog(param);
          if (res.code != 0) {
            this.tool.error(res.msg);
          } else {
            this.tool.success("清理成功");
            this.loadLogs();
          }
        })
        .catch((e) => {});
    },
    toDelete(data) {
      let msg = "删除日志后无法恢复，确认清理？";
      this.tool
        .confirm(msg)
        .then(async () => {
          let param = this.worker.getParam();
          param.workerId = data.workerId;
          let res = await this.server.terminal.deleteLog(param);
          if (res.code != 0) {
            this.tool.error(res.msg);
          } else {
            this.tool.success("删除成功");
            this.loadLogs();
          }
        })
        .catch((e) => {});
    },
  },
  created() {},
  mounted() {},
};
</script>

<style>
</style>
