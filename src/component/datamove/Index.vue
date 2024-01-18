<template>
  <div class="datamove-box toolbox-editor" v-if="ready">
    <tm-layout height="100%">
      <tm-layout height="500px">
        <div v-show="step == 'config'">
          <tm-layout>
            <tm-layout width="50%" class="">
              <div class="pd-10 ft-14 ft-600 color-orange">
                源数据配置（将读取这里的数据）
              </div>
              <Config ref="From" :source="source" :config="from" :isFrom="true">
              </Config>
            </tm-layout>
            <tm-layout width="auto">
              <div class="pd-10 ft-14 ft-600 color-orange">
                目标数据配置（将数据写入到这里）
              </div>
              <Config ref="To" :source="source" :config="to" :isTo="true">
              </Config>
            </tm-layout>
          </tm-layout>
        </div>
        <template v-if="step == 'options'">
          <div class="pd-10 ft-14 ft-600 color-orange">详细配置</div>

          <div class="pdlr-10 pdb-10">
            <ScriptValueDescription :source="source"> </ScriptValueDescription>
          </div>
          <el-form class="pdlr-10" size="mini" inline>
            <el-form-item label="有错继续" class="mgb-5">
              <el-switch v-model="formData.errorContinue"> </el-switch>
            </el-form-item>
            <el-form-item label="批量处理" class="mgb-5">
              <el-input v-model="formData.batchNumber" style="width: 100px">
              </el-input> </el-form-item
          ></el-form>
          <template
            v-if="
              from.type == 'database' &&
              (to.type == 'database' ||
                to.type == 'txt' ||
                to.type == 'sql' ||
                to.type == 'excel')
            "
          >
            <DbToDbOrFile
              ref="Options"
              :source="source"
              :from="from"
              :to="to"
              :formData="formData"
            >
            </DbToDbOrFile>
          </template>
          <template
            v-if="
              to.type == 'database' &&
              (from.type == 'txt' ||
                from.type == 'sql' ||
                from.type == 'excel' ||
                from.type == 'data' ||
                from.type == 'script')
            "
          >
            <DataToDb
              ref="Options"
              :source="source"
              :from="from"
              :to="to"
              :formData="formData"
            >
            </DataToDb>
          </template>
          <template
            v-if="
              from.type == 'data' &&
              (to.type == 'sql' || to.type == 'txt' || to.type == 'excel')
            "
          >
            <DataToFile
              ref="Options"
              :source="source"
              :from="from"
              :to="to"
              :formData="formData"
            >
            </DataToFile>
          </template>
          <template
            v-if="
              to.type == 'elasticsearch' &&
              (from.type == 'txt' ||
                from.type == 'excel' ||
                from.type == 'data' ||
                from.type == 'script')
            "
          >
            <DataToEs
              ref="Options"
              :source="source"
              :from="from"
              :to="to"
              :formData="formData"
            >
            </DataToEs>
          </template>
          <template
            v-if="
              to.type == 'kafka' &&
              (from.type == 'txt' ||
                from.type == 'excel' ||
                from.type == 'data' ||
                from.type == 'script')
            "
          >
            <DataToKafka
              ref="Options"
              :source="source"
              :from="from"
              :to="to"
              :formData="formData"
            >
            </DataToKafka>
          </template>
          <template
            v-if="
              from.type == 'elasticsearch' &&
              (to.type == 'txt' || to.type == 'excel' || to.type == 'sql')
            "
          >
            <EsToFile
              ref="Options"
              :source="source"
              :from="from"
              :to="to"
              :formData="formData"
            >
            </EsToFile>
          </template>
          <template
            v-if="
              from.type == 'kafka' &&
              (to.type == 'txt' || to.type == 'excel' || to.type == 'sql')
            "
          >
            <KafkaToFile
              ref="Options"
              :source="source"
              :from="from"
              :to="to"
              :formData="formData"
            >
            </KafkaToFile>
          </template>
        </template>
      </tm-layout>
      <tm-layout-bar bottom></tm-layout-bar>
      <tm-layout height="auto">
        <div class="pdtb-10 ft-15">
          <template v-if="step == 'config'">
            <div class="tm-btn tm-btn-sm bg-teal mglr-10" @click="toNextStep()">
              下一步
            </div>
          </template>
          <template v-if="step == 'options'">
            <div class="tm-btn tm-btn-sm bg-grey mglr-10" @click="toBackStep()">
              上一步
            </div>
            <div class="tm-btn tm-btn-sm bg-green mglr-10" @click="toStart()">
              执行
            </div>
          </template>

          <span class="color-orange ft-12 mgl-10"> 任务列表 </span>
          <div class="tm-btn bg-blue mgl-20 tm-btn-sm" @click="loadList()">
            刷新
          </div>
          <span class="color-orange ft-12 mgl-10">
            未结束的任务会自动刷新
          </span>
        </div>
        <List ref="List" :source="source" style="height: calc(100% - 46px)">
        </List>
      </tm-layout>
    </tm-layout>
  </div>
</template>


<script>
import Config from "./Config";
import DbToDbOrFile from "./DbToDbOrFile";
import DataToDb from "./DataToDb";
import DataToEs from "./DataToEs";
import DataToFile from "./DataToFile";
import DataToKafka from "./DataToKafka";
import KafkaToFile from "./KafkaToFile";
import EsToFile from "./EsToFile";

import List from "./List";

export default {
  components: {
    Config,
    DbToDbOrFile,
    DataToDb,
    DataToEs,
    DataToFile,
    DataToKafka,
    KafkaToFile,
    EsToFile,
    List,
  },
  props: ["source", "options_"],
  data() {
    return {
      step: "config",
      ready: false,
      from: null,
      to: null,
      formData: {
        errorContinue: true,
        batchNumber: 100,
      },
      options: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {
      if (this.options_) {
        this.setOptions(this.options_);
      }
    },
    setOptions(options) {
      this.ready = false;
      this.$nextTick(() => {
        this.initOptions(options);
      });
    },
    checkStepData() {
      switch (this.step) {
        case "config":
          if (!this.$refs.From.checkData()) {
            return false;
          }
          if (!this.$refs.To.checkData()) {
            return false;
          }
          break;
        case "options":
          if (this.$refs.Options == null) {
            this.tool.warn("暂不支持该类型");
            return false;
          }
          if (!this.$refs.Options.checkData()) {
            return false;
          }
          break;
      }
      return true;
    },
    toBackStep() {
      switch (this.step) {
        case "options":
          this.step = "config";
          break;
        case "confirm":
          this.step = "options";
          break;
      }
    },
    toNextStep() {
      if (!this.checkStepData()) {
        return;
      }
      switch (this.step) {
        case "config":
          this.step = "options";
          break;
        case "options":
          this.step = "confirm";
          break;
      }
    },
    initConfig(config) {
      config.shouldOwner = true;
      config.colSeparator = ","; // 列分隔符号
      config.replaceCol = "|:-，-:|"; // 将值中的 ',' 替换为该字符串
      config.replaceLine = "|:-n-:|"; // 将值中的 '\n' 替换为该字符串
      config.txtFileType = "csv";
      config.shouldOwner = true;
      config.shouldTable = true;
      config.sqlFileMergeType = "owner";
      config.fileNameSplice = "/";
      config.fileName = "导出";
      config.allOwner = true;
      config.owners = [];
      config.rowNumber = 0;
      config.total = 1;
      config.bySql = false;
      if (this.tool.isNotEmpty(config.selectSql)) {
        config.bySql = true;
      } else {
        config.selectSql = null;
      }
      config.indexIdName = null;
      config.indexIdScript = null;
      config.topicKey = null;
      config.topicValue = null;
      config.topicGroupName = "kafka-group-from-datamove";
      config.filePath = null;

      if (this.tool.isEmpty(config.type)) {
        config.type = "excel";
        config.typeReadonly = false;
      } else {
        config.typeReadonly = true;
      }
      if (this.tool.isEmpty(config.toolboxId)) {
        config.toolboxId = null;
        config.toolboxIdReadonly = false;
      } else {
        config.toolboxIdReadonly = true;
      }
      if (this.tool.isEmpty(config.indexName)) {
        config.indexName = null;
      }
      if (this.tool.isEmpty(config.topicName)) {
        config.topicName = null;
      }
    },
    initOptions(opts) {
      let options = Object.assign({}, opts || {});
      options.from = Object.assign(options.from || {});
      this.initConfig(options.from);
      options.to = Object.assign(options.to || {});
      this.initConfig(options.to);

      this.from = options.from;
      this.to = options.to;
      if (this.from.type == "data" && this.from.dataList) {
        let columnList = this.from.columnList || [];
        if (columnList.length == 0) {
          let columnCache = {};
          this.from.dataList.forEach((one) => {
            for (let name in one) {
              if (columnCache[name]) {
                continue;
              }
              columnCache[name] = true;
              columnList.push({
                columnName: name,
              });
            }
          });
        }
        columnList.forEach((one) => {
          if (this.tool.isEmpty(one.columnName)) {
            one.columnName = one.name;
          }
        });
        this.from.columnList = columnList;
      }
      this.options = options;
      this.ready = true;
    },
    async toStart() {
      if (!this.checkStepData()) {
        return;
      }
      let param = Object.assign({}, this.formData);
      param.from = this.from;
      param.to = this.to;
      param.batchNumber = Number(param.batchNumber);
      param.rowNumber = Number(param.rowNumber);
      if (param.from.toolboxId) {
        param.fromToolboxId = param.from.toolboxId;
      }
      if (param.to.toolboxId) {
        param.toToolboxId = param.to.toolboxId;
      }
      let res = await this.server.datamove.start(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.tool.success("任务启动成功");
        this.loadList();
      }
    },
    loadList() {
      this.$refs.List.loadList();
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.datamove-box {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
