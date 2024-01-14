<template>
  <div class="datamove-box" v-if="ready">
    <tm-layout height="100%">
      <tm-layout height="80px">
        <el-form class="pdlr-10" size="mini" inline>
          <el-form-item label="有错继续" class="mgb-0">
            <el-switch v-model="formData.errorContinue"> </el-switch>
          </el-form-item>
          <el-form-item label="批量处理" class="mgb-0">
            <el-input v-model="formData.batchNumber" style="width: 100px">
            </el-input>
          </el-form-item>
        </el-form>
      </tm-layout>
      <tm-layout-bar bottom></tm-layout-bar>

      <tm-layout-bar bottom></tm-layout-bar>
      <tm-layout height="auto">
        <div class="pdtb-10 ft-15">
          <div class="tm-btn tm-btn-sm color-green mgl-10" @click="toStart">
            执行
          </div>
          任务列表
          <div class="tm-btn bg-blue mgl-20 tm-btn-sm" @click="loadList()">
            刷新
          </div>
          <span class="color-orange ft-12 mgl-10">
            请点击刷新来刷新列表任务状态
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
import FromOwners from "./FromOwners";
import List from "./List";

export default {
  components: { Config, FromOwners, List },
  props: ["source", "options"],
  data() {
    return {
      step: "from",
      ready: false,
      from: null,
      to: null,
      formData: {
        errorContinue: true,
        batchNumber: 100,
        shouldOwner: true,
        shouldTable: true,
        sqlFileMergeType: "owner",
        fileNameSplice: "/",
        allOwner: true,
        owners: [],
        rowNumber: 0,
        bySql: false,
        selectSql: "",
        indexName: "",
        indexIdName: "",
        indexIdScript: "",
        topicName: "",
        topicKey: "",
        topicValue: "",
        filePath: "",
      },
      sqlFileMergeTypes: [
        { text: "生成一个文件", value: "one" },
        { text: "每个库一个文件", value: "owner" },
        { text: "每个表一个文件", value: "table" },
      ],
      fileNameSplices: [
        { text: "库名/表名", value: "/" },
        { text: "库名_表名", value: "_" },
        { text: "库名-表名", value: "-" },
      ],
    };
  },
  computed: {},
  watch: {
    "to.type"() {
      console.log("to type changed", this.to.type);
    },
  },
  methods: {
    init() {
      this.initOptions(this.options);
    },
    setOptions(options) {
      this.ready = false;
      this.$nextTick(() => {
        this.initOptions(options);
      });
    },
    initConfig(config) {
      config.typeReadonly = false;
      config.toolboxIdReadonly = false;
      config.colSeparator = ","; // 列分隔符号
      config.replaceCol = "|:-，-:|"; // 将值中的 ',' 替换为该字符串
      config.replaceLine = "|:-n-:|"; // 将值中的 '\n' 替换为该字符串
      config.txtFileType = "csv";
      if (this.tool.isEmpty(config.type)) {
        config.type = "excel";
      } else {
        config.typeReadonly = true;
      }
      if (!this.tool.isEmpty(config.toolboxId)) {
        config.toolboxIdReadonly = true;
      } else {
        config.toolboxId = null;
      }
    },
    initOptions(options) {
      options = options || {};
      options.from = options.from || {};
      this.initConfig(options.from);
      options.to = options.to || {};
      this.initConfig(options.to);

      this.from = options.from;
      this.to = options.to;
      this.ready = true;
    },
    async toStart() {
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
