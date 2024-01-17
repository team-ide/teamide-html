<template>
  <div class="pdlr-10">
    <el-form size="mini" inline>
      <el-form-item label="选择导出的Topic" class="mgb-0">
        <el-select
          v-model="selectTolic"
          style="width: 200px"
          filterable
          value-key="topicName"
        >
          <el-option
            v-for="(one, index) in topicList"
            :key="index"
            :value="one"
            :label="one.topicName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="index登录用户">
        <el-input
          v-model="from.username"
          style="width: 120px"
          placeholder="可不填写或默认配置用户"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="index登录密码">
        <el-input
          v-model="from.password"
          style="width: 120px"
          placeholder="可不填写或默认配置密码"
        >
        </el-input>
      </el-form-item>
      <template v-if="to.type == 'txt'">
        <el-form-item label="列分割字符">
          <el-input v-model="to.colSeparator" style="width: 100px"> </el-input>
        </el-form-item>
        <el-form-item
          :label="'列分割字符转换（替换值中`' + to.colSeparator + '`）'"
        >
          <el-input v-model="to.replaceCol" style="width: 100px"> </el-input>
        </el-form-item>
        <el-form-item label="换行符转换（替换值中`\n`）">
          <el-input v-model="to.replaceLine" style="width: 100px"> </el-input>
        </el-form-item>
        <el-form-item label="换行符转换（替换值中`\n`）">
          <el-input v-model="to.replaceLine" style="width: 100px"> </el-input>
        </el-form-item>
      </template>
      <el-form-item label="导出保存文件名">
        <el-input v-model="to.fileName" style="width: 100px"> </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "from", "to", "formData"],
  data() {
    return {
      topicList: [],
      mappingColumnList: [],
      columnList: [],
      selectTolic: null,
      topicKey: "key",
      topicValue: "value",
    };
  },
  computed: {},
  watch: {
    selectTolic() {
      this.$nextTick(() => {
        this.initColumnList();
      });
    },
  },
  methods: {
    async init() {
      this.topicList = [];
      this.columnList = [];
      this.mappingColumnList = [];
      this.selectTolic = null;
      await this.initData();
    },
    async initData() {
      if (this.from.columnList != null) {
        this.from.columnList.forEach((one) => {
          this.addColumn(this.mappingColumnList, one);
        });
      }
      await this.initTopicList();
    },
    checkData() {
      if (this.selectTolic == null) {
        this.tool.warn("请选择导出的Topic");
        return false;
      }
      this.from.topicName = this.selectTolic.topicName;
      this.from.topicKey = this.topicKey;
      this.from.topicValue = this.topicValue;

      return true;
    },
    addTolic(topicList, topicName) {
      let one = {};
      one.topicName = topicName;
      topicList.push(one);
      return one;
    },
    addColumn(columns, one, after) {
      let column = {};
      column.from = Object.assign({}, one);
      column.to = Object.assign({}, one);
      column.from.value = "";
      let appendIndex = columns.indexOf(after);
      if (appendIndex < 0) {
        appendIndex = columns.length;
      } else {
        appendIndex++;
      }
      columns.splice(appendIndex, 0, column);
      return column;
    },
    async initColumnList() {
      this.columnList = [];
      if (this.selectTolic == null) {
        return;
      }
      let list = [];
      list.forEach((one) => {
        this.addColumn(this.columnList, one);
      });
    },
    async initTopicList() {
      this.topicList = [];
      this.selectTolic = null;
      if (this.from.topicName != null) {
        this.selectTolic = this.addTolic(this.topicList, this.from.topicName);
        return;
      }
      let param = {
        toolboxId: this.to.toolboxId,
      };
      let res = await this.server.kafka.topics(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || [];
      list.forEach((one) => {
        this.addTolic(this.topicList, one.topic);
      });
    },
    upColumn(one) {
      this.tool.up(this, "mappingColumnList", one);
    },
    downColumn(one) {
      this.tool.down(this, "mappingColumnList", one);
    },
    removeColumn(one) {
      let findIndex = this.mappingColumnList.indexOf(one);
      if (findIndex >= 0) {
        this.mappingColumnList.splice(findIndex, 1);
      }
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
