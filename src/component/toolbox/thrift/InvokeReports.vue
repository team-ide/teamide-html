<template>
  <div class="toolbox-thrift-invoke-reports">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout height="160px">
          <div class="pdlr-10 pdtb-5">
            文件:
            <span class="color-green pdr-10">
              {{ relativePath }}
            </span>
            服务:
            <span class="color-green pdr-10">
              {{ serviceName }}
            </span>
            方法:
            <span class="color-green pdr-10">
              {{ methodName }}
            </span>
          </div>
          <el-form class="pdt-10 pdlr-10" size="mini" inline>
            <el-form-item label="" class="mgb-5">
              <div class="tm-btn tm-btn-sm bg-green-6" @click="refresh">
                刷新
              </div>
              <div class="tm-btn tm-btn-sm bg-grey-6" @click="toShowMarkdown">
                导出Markdown
              </div>
            </el-form-item>
          </el-form>
          <div class="ft-12 color-orange pdlr-10">
            <div>任务用时：任务的开始时间~结束时间耗时；</div>
            <div>
              执行用时：单个线程执行用时累计，取最大；（这里的用时是调用接口耗时，去除了额外开销，所以执行用时小于任务执行时间，两者相差越大，则表示额外开销越多）
            </div>
            <div>累计用时：所有执行用时累计</div>
            <div>TPS：总 / 执行用时</div>
            <div></div>
          </div>
        </tm-layout>
        <tm-layout-bar bottom></tm-layout-bar>
        <tm-layout height="auto">
          <template v-for="(group, index) in groupList">
            <div :key="index">
              <div v-if="group.request != null" class="pd-10 ft-12">
                <div>
                  并发线程:
                  <span class="color-green pdlr-5">
                    {{ group.request.worker }}
                  </span>
                  执行时间(分钟):
                  <span class="color-green pdlr-5">
                    {{ group.request.duration }}
                  </span>
                  执行次数:
                  <span class="color-green pdlr-5">
                    {{ group.request.frequency }}
                  </span>
                  服务地址:
                  <span class="color-green pdlr-5">
                    {{ group.request.serverAddress }}
                  </span>
                  ProtocolFactory类型:
                  <span class="color-green pdlr-5">
                    {{ group.request.protocolFactory || "binary" }}
                  </span>
                  Buffered:
                  <span class="color-green pdlr-5">
                    {{ tool.isTrue(group.request.buffered) }}
                  </span>
                  Framed:
                  <span class="color-green pdlr-5">
                    {{ tool.isTrue(group.request.framed) }}
                  </span>
                  接和响应超时时间(毫秒):
                  <span class="color-green pdlr-5">
                    {{ group.request.timeout }}
                  </span>
                  保存执行记录:
                  <span class="color-green pdlr-5">
                    {{ tool.isTrue(group.request.saveRecords) }}
                  </span>
                  统计T99:
                  <span class="color-green pdlr-5">
                    {{ tool.isTrue(group.request.countTop) }}
                  </span>
                </div>
                <div
                  v-for="(arg, index) in group.request.args"
                  :key="'arg-' + index"
                >
                  入参 {{ index + 1 }}:
                  <span class="color-green pdl-5">
                    {{ arg }}
                  </span>
                </div>
              </div>
              <el-table
                :data="group.reports"
                style="width: 100%"
                :border="true"
                size="mini"
              >
                <el-table-column label="" width="40px">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="任务时间"
                  prop="startTime"
                  width="160px"
                >
                  <template slot-scope="scope">
                    <div class="">
                      <div>
                        <span class="color-green pdl-5">
                          {{
                            tool.formatDate(
                              new Date(scope.row.startTime / 1000000),
                              "yyyy-MM-dd hh:mm:ss.S"
                            )
                          }}
                        </span>
                      </div>
                      -
                      <div>
                        <span class="color-green pdl-5" v-if="scope.row.isEnd">
                          {{
                            tool.formatDate(
                              new Date(scope.row.endTime / 1000000),
                              "yyyy-MM-dd hh:mm:ss.S"
                            )
                          }}
                        </span>
                        <span class="color-green pdl-5" v-else> 执行中 </span>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="总/成功/失败"
                  prop="count"
                  width="120px"
                >
                  <template slot-scope="scope">
                    <div class="">
                      {{ scope.row.count }}
                      <br />
                      <span class="color-green">
                        {{ scope.row.successCount }}
                      </span>
                      <br />
                      <span class="color-red">
                        {{ scope.row.errorCount }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="任务用时" prop="total">
                  <template slot-scope="scope">
                    {{ tool.formatTimeStr(Number(scope.row.total)) }}
                  </template>
                </el-table-column>
                <el-table-column label="执行用时" prop="total">
                  <template slot-scope="scope">
                    {{ tool.formatTimeStr(Number(scope.row.execute)) }}
                  </template>
                </el-table-column>
                <el-table-column label="累计用时" prop="use">
                  <template slot-scope="scope">
                    {{ tool.formatTimeStr(Number(scope.row.use)) }}
                  </template>
                </el-table-column>
                <el-table-column label="TPS" prop="tps" width="60px">
                </el-table-column>
                <el-table-column label="Avg" prop="avg" width="60px">
                </el-table-column>
                <el-table-column label="Min" prop="min" width="60px">
                </el-table-column>
                <el-table-column label="Max" prop="max" width="60px">
                </el-table-column>
                <el-table-column label="T50" prop="t50" width="60px">
                </el-table-column>
                <el-table-column label="T90" prop="t90" width="60px">
                </el-table-column>
                <el-table-column label="T99" prop="t99" width="60px">
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="120px">
                  <template slot-scope="scope">
                    <div
                      class="tm-link color-grey mglr-5"
                      @click="tool.showJSONData(scope.row)"
                    >
                      元数据
                    </div>
                    <div
                      class="tm-link color-green mglr-5"
                      @click="toShowChart(scope.row)"
                    >
                      图表
                    </div>
                    <br />
                    <div
                      class="tm-link color-grey mglr-5"
                      @click="toDownloadInvokeRecords(scope.row)"
                    >
                      下载执行记录
                    </div>
                    <br />
                    <div
                      class="tm-link color-orange mglr-5"
                      v-if="!scope.row.isEnd"
                      @click="toStop(scope.row)"
                    >
                      停止
                    </div>
                    <div
                      class="tm-link color-red mglr-5"
                      @click="toDelete(scope.row)"
                    >
                      删除
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </tm-layout>
      </tm-layout>
    </template>
    <ReportChartDialog
      ref="ReportChartDialog"
      :source="source"
      :toolboxWorker="toolboxWorker"
    ></ReportChartDialog>
  </div>
</template>


<script>
import ReportChartDialog from "./ReportChartDialog";

export default {
  components: { ReportChartDialog },
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      ready: false,
      relativePath: null,
      serviceName: null,
      methodName: null,
      groupList: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.ready = true;
      await this.refresh();
    },
    async refresh() {
      let extend = this.extend || {};
      this.relativePath = extend.relativePath;
      this.serviceName = extend.serviceName;
      this.methodName = extend.methodName;
      await this.loadData();
    },
    toShowChart(data) {
      let param = Object.assign(
        {
          relativePath: this.relativePath,
          serviceName: this.serviceName,
          methodName: this.methodName,
        },
        data
      );

      this.$refs.ReportChartDialog.show(param);
    },
    toDownloadInvokeRecords(data) {
      let url = this.source.api + "thrift/downloadRecords?";
      url = this.tool.appendUrlBaseParam(url);
      url += "&taskRelativePath=" + encodeURIComponent(data.taskRelativePath);
      url += "&serviceName=" + encodeURIComponent(this.serviceName);
      url += "&methodName=" + encodeURIComponent(this.methodName);
      window.location.href = url;
    },
    async toStop(data) {
      this.tool.warn("任务停止中");
      let param = this.toolboxWorker.getWorkParam({
        relativePath: this.relativePath,
        serviceName: this.serviceName,
        methodName: this.methodName,
        taskKey: data.taskKey,
      });
      let res = await this.server.thrift.invokeStop(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.tool.success("停止成功");
        this.refresh();
      }
    },
    toDelete(data) {
      let msg = "删除该记录将无法恢复，确认删除？";
      this.tool
        .confirm(msg)
        .then(async () => {
          let param = this.toolboxWorker.getWorkParam({
            relativePath: this.relativePath,
            serviceName: this.serviceName,
            methodName: this.methodName,
            taskKey: data.taskKey,
          });
          let res = await this.server.thrift.invokeReportDelete(param);
          if (res.code != 0) {
            this.tool.error(res.msg);
          } else {
            this.tool.success("删除成功");
            this.refresh();
          }
        })
        .catch((e) => {});
    },
    async toShowMarkdown() {
      let param = this.toolboxWorker.getWorkParam({
        relativePath: this.relativePath,
        serviceName: this.serviceName,
        methodName: this.methodName,
      });

      let res = await this.server.thrift.invokeMarkdown(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.tool.showMarkdown(res.data);
      }
    },
    async loadData() {
      let param = this.toolboxWorker.getWorkParam({
        relativePath: this.relativePath,
        serviceName: this.serviceName,
        methodName: this.methodName,
      });

      let res = await this.server.thrift.invokeReports(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || [];
      let groupList = [];
      let groupCache = {};

      list.forEach((one, index) => {
        if (one["metric"] == null) {
          return;
        }
        let group = groupCache[one.requestMd5];

        if (group == null) {
          group = {
            reports: [],
            request: one.request,
          };
          groupCache[one.requestMd5] = group;
          groupList.push(group);
        }
        let report = Object.assign(one, one["metric"]);
        delete report["metric"];
        group.reports.push(report);
      });
      this.groupList = groupList;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-thrift-invoke-reports {
  width: 100%;
  height: 100%;
}
</style>
