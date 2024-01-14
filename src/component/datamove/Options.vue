<template>
  <div class="pdlr-10">
    <el-form size="mini">
      <el-form-item label="类型">
        <el-select
          v-model="config.type"
          style="width: 150px"
          :disabled="config.typeReadonly"
          clearable
          filterable
        >
          <el-option
            v-for="(one, index) in types"
            :key="index"
            :value="one.value"
            :label="one.text"
            :disabled="one.disabled"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="config.type == 'txt'" label="文本文件类型">
        <el-select
          v-model="config.txtFileType"
          style="width: 150px"
          clearable
          filterable
        >
          <el-option
            v-for="(one, index) in txtFileTypes"
            :key="index"
            :value="one.value"
            :label="one.text"
            :disabled="one.disabled"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="shouldToolboxList(config.type)" label="配置">
        <el-select
          v-model="config.toolboxId"
          style="width: 250px"
          :disabled="config.toolboxIdReadonly"
          clearable
          filterable
        >
          <el-option
            v-for="(one, index) in toolboxList"
            :key="index"
            :value="one.toolboxId"
            :label="one.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <template v-if="config.type == 'txt'">
        <el-form-item label="列分割字符">
          <el-input v-model="config.colSeparator" style="width: 100px">
          </el-input>
        </el-form-item>
        <el-form-item
          :label="'列分割字符转换（替换值中`' + config.colSeparator + '`）'"
        >
          <el-input v-model="config.replaceCol" style="width: 100px">
          </el-input>
        </el-form-item>
        <el-form-item label="换行符转换（替换值中`\n`）">
          <el-input v-model="config.replaceLine" style="width: 100px">
          </el-input>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "config", "isFrom", "isTo"],
  data() {
    return {
      types: [
        { text: "SQL", value: "sql" },
        { text: "Excel", value: "excel" },
        { text: "文本（txt、csv）", value: "txt" },
        { text: "数据库", value: "database" },
        { text: "ES", value: "elasticsearch" },
        { text: "Kafka", value: "kafka" },
        { text: "Redis", value: "redis" },
      ],
      txtFileTypes: [
        { text: "TXT", value: "txt" },
        { text: "CSV", value: "csv" },
      ],
      toolboxList: [],
    };
  },
  computed: {},
  watch: {
    "config.type"() {
      this.config.toolboxId = null;
      this.initFrom();
    },
  },
  methods: {
    init() {
      this.initFrom();
    },
    initFrom() {
      this.initToolboxList();
    },
    shouldToolboxList(type) {
      return (
        type == "database" ||
        type == "elasticsearch" ||
        type == "kafka" ||
        type == "redis"
      );
    },
    async initToolboxList() {
      if (!this.shouldToolboxList(this.config.type)) {
        return;
      }
      let res = await this.server.toolbox.queryVisibility({
        toolboxType: this.config.type,
      });
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      res.data = res.data || {};
      this.toolboxList = res.data.toolboxList || [];
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
</style>
