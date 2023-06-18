<template>
  <el-dialog
    ref="modal"
    title="图表"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    :append-to-body="true"
    :visible="showDialog"
    :before-close="hide"
    width="98%"
    top="30px"
  >
    <div class="mgt--20">
      <div class="" v-if="report != null">
        <div class="pdb-10">
          <div class="pdlr-10 pdtb-5">
            文件:
            <span class="color-green pdr-10">
              {{ report.relativePath }}
            </span>
            服务:
            <span class="color-green pdr-10">
              {{ report.serviceName }}
            </span>
            方法:
            <span class="color-green pdr-10">
              {{ report.methodName }}
            </span>
          </div>
          <div class="pd-10 ft-12">
            <div>
              并发线程:
              <span class="color-green pdlr-5">
                {{ report.request.worker }}
              </span>
              执行时间(分钟):
              <span class="color-green pdlr-5">
                {{ report.request.duration }}
              </span>
              执行次数:
              <span class="color-green pdlr-5">
                {{ report.request.frequency }}
              </span>
              接和响应超时时间(毫秒):
              <span class="color-green pdlr-5">
                {{ report.request.timeout }}
              </span>
            </div>
            <div
              v-for="(arg, index) in report.request.args"
              :key="'arg-' + index"
            >
              入参 {{ index + 1 }}:
              <span class="color-green pdl-5">
                {{ arg }}
              </span>
            </div>
          </div>
        </div>
        <!-- <div class="ft-600 ft-14 color-orange">点击查看耗时较高的调用</div> -->
        <div style="width: 100%; height: 700px">
          <ReportChart
            :source="source"
            :toolboxWorker="toolboxWorker"
            :report="report"
            :dataList="dataList"
            :dataListVersion="dataListVersion"
          ></ReportChart>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import ReportChart from "./ReportChart";

export default {
  components: { ReportChart },
  props: ["source", "toolboxWorker"],
  data() {
    return {
      loading: false,
      dataList: [],
      showDialog: false,
      report: null,
      dataListVersion: 0,
    };
  },
  watch: {},
  methods: {
    init() {},
    show(report) {
      this.showDialog = true;
      this.report = report;
      this.$nextTick(() => {
        this.loadList();
      });
    },
    hide() {
      this.showDialog = false;
    },
    async loadList() {
      if (this.report == null) {
        return;
      }
      let param = this.toolboxWorker.getWorkParam({
        relativePath: this.report.relativePath,
        serviceName: this.report.serviceName,
        methodName: this.report.methodName,
        taskKey: this.report.taskKey,
      });

      let res = await this.server.thrift.invokeMetric(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || [];

      this.dataList = list;
      this.dataListVersion = this.dataListVersion + 1;
    },
  },
  mounted() {
    this.init();
  },
  beforeCreate() {},
};
</script>

<style >
</style>
