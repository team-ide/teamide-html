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
          <el-form-item
            v-if="from.type == 'database' && to.type == 'database'"
            label="同步库"
            class="mgb-0"
          >
            <el-switch v-model="formData.shouldOwner"> </el-switch>
          </el-form-item>
          <el-form-item
            v-if="from.type == 'database' && to.type == 'database'"
            label="同步表"
            class="mgb-0"
          >
            <el-switch v-model="formData.shouldTable"> </el-switch>
          </el-form-item>
          <el-form-item
            v-if="from.type == 'database' && to.type == 'sql'"
            label="建库语句"
            class="mgb-0"
          >
            <el-switch v-model="formData.shouldOwner"> </el-switch>
          </el-form-item>
          <el-form-item
            v-if="from.type == 'database' && to.type == 'sql'"
            label="建表语句"
            class="mgb-0"
          >
            <el-switch v-model="formData.shouldTable"> </el-switch>
          </el-form-item>
          <el-form-item
            v-if="from.type == 'database' && to.type == 'sql'"
            label="SQL文件合并类型"
            class="mgb-0"
          >
            <el-select
              v-model="formData.sqlFileMergeType"
              style="width: 150px"
              clearable
              filterable
            >
              <el-option
                v-for="(one, index) in sqlFileMergeTypes"
                :key="index"
                :value="one.value"
                :label="one.text"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="
              from.type == 'database' &&
              (to.type == 'txt' ||
                to.type == 'excel' ||
                (to.type == 'sql' && formData.fileNameSplice == 'table'))
            "
            label="文件名称格式"
            class="mgb-0"
          >
            <el-select
              v-model="formData.fileNameSplice"
              style="width: 150px"
              clearable
              filterable
            >
              <el-option
                v-for="(one, index) in fileNameSplices"
                :key="index"
                :value="one.value"
                :label="one.text"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </tm-layout>
      <tm-layout-bar bottom></tm-layout-bar>
      <tm-layout height="160px">
        <tm-layout width="50%" class="">
          <div class="pd-10 ft-12 color-orange">
            源数据配置（将读取这里的数据）
          </div>
          <Config :source="source" :config="from" :isFrom="true"></Config>
        </tm-layout>
        <tm-layout-bar right></tm-layout-bar>
        <tm-layout width="auto">
          <div class="pd-10 ft-12 color-orange">
            目标数据配置（将数据写入到这里）
          </div>
          <Config :source="source" :config="to" :isTo="true"></Config>
        </tm-layout>
      </tm-layout>
      <tm-layout-bar bottom></tm-layout-bar>
      <tm-layout height="400px">
        <template v-if="from.type == 'database' && from.toolboxId != null">
          <FromOwners
            :source="source"
            :from="from"
            :to="to"
            :formData="formData"
          >
          </FromOwners>
        </template>
      </tm-layout>
      <tm-layout-bar bottom></tm-layout-bar>
      <tm-layout height="auto"> </tm-layout>
    </tm-layout>
  </div>
</template>


<script>
import Config from "./Config";
import FromOwners from "./FromOwners";

export default {
  components: { Config, FromOwners },
  props: ["source", "options"],
  data() {
    return {
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
  watch: {},
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
