<template>
  <div class="toolbox-thrift-invoke-reports">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout height="80px">
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
            </el-form-item>
          </el-form>
        </tm-layout>
        <tm-layout-bar bottom></tm-layout-bar>
        <tm-layout height="auto">
          <el-table
            :data="reports"
            :border="true"
            style="width: 100%"
            height="100%"
            size="mini"
          >
            <el-table-column label="任务时间" prop="startTime">
              <template slot-scope="scope">
                <div class="">
                  <div>
                    开始时间:
                    <span class="color-green pdlr-5">
                      {{
                        tool.formatDate(
                          new Date(scope.row.startTime),
                          "yyyy-MM-dd hh:mm:ss.S"
                        )
                      }}
                    </span>
                  </div>
                  <div>
                    结束时间:
                    <span class="color-green pdlr-5">
                      {{
                        tool.formatDate(
                          new Date(scope.row.endTime),
                          "yyyy-MM-dd hh:mm:ss.S"
                        )
                      }}
                    </span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="总记录" prop="count"> </el-table-column>
            <el-table-column label="成功" prop="successCount">
            </el-table-column>
            <el-table-column label="失败" prop="errorCount"> </el-table-column>
            <el-table-column label="执行时长(毫秒)" prop="total">
            </el-table-column>
            <el-table-column label="总用时(毫秒)" prop="use"> </el-table-column>
            <el-table-column label="平均(毫秒)" prop="avg"> </el-table-column>
            <el-table-column label="Min(毫秒)" prop="min"> </el-table-column>
            <el-table-column label="Max(毫秒)" prop="max"> </el-table-column>
            <el-table-column label="TPS" prop="tps"> </el-table-column>
            <el-table-column label="T50(毫秒)" prop="t50"> </el-table-column>
            <el-table-column label="T80(毫秒)" prop="t80"> </el-table-column>
            <el-table-column label="T90(毫秒)" prop="t90"> </el-table-column>
            <el-table-column label="T99(毫秒)" prop="t99"> </el-table-column>
          </el-table>
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
      relativePath: null,
      serviceName: null,
      methodName: null,
      reports: [],
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
      let reports = [];
      list.forEach((one, index) => {
        if (one["metric"] == null) {
          return;
        }
        let report = Object.assign({}, one["metric"]);
        report.task = one["task"];
        report.taskKey = one["taskKey"];
        reports.push(report);
      });
      this.reports = reports;
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
