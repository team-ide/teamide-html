<template>
  <div class="pdlr-10">
    <el-form size="mini" inline>
      <template v-if="to.type == 'sql'">
        <DatabasePack
          :source="source"
          :config="to"
          :shouldDialectType="true"
          :change="changeDatabasePack"
        ></DatabasePack>
        <el-form-item label="导出库名称">
          <el-input v-model="ownerName" style="width: 150px"> </el-input>
        </el-form-item>
        <el-form-item label="导出表名称">
          <el-input v-model="tableName" style="width: 150px"> </el-input>
        </el-form-item>
      </template>
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
        <el-input v-model="to.fileName" style="width: 180px"> </el-input>
      </el-form-item>
      <el-form-item label="选择导出的 主题" class="mgb-0">
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
      <el-form-item label="groupId">
        <el-input v-model="topicGroupName" style="width: 200px"> </el-input>
        <div class="color-orange ft-12">导出数据时候使用该groupId消费</div>
      </el-form-item>
      <el-form-item label="拉取消息超时时间（秒）">
        <el-input v-model="pullWait" style="width: 100px"> </el-input>
        <div class="color-orange ft-12">
          消费时候如果超过该时间无数据，则停止拉取
        </div>
      </el-form-item>

      <el-form-item label="Key字段名称">
        <el-input v-model="topicKey" style="width: 100px"> </el-input>
      </el-form-item>
      <el-form-item label="Value字段名称">
        <el-input v-model="topicValue" style="width: 100px"> </el-input>
      </el-form-item>
    </el-form>
    <div class="color-orange ft-15 ft-600">导出key、value字段</div>
    <div class="color-orange ft-15 ft-600">
      导出 header 中所有字段填充到 字段列表 中
    </div>
    <div class="color-orange ft-15 ft-600">
      如果 value可以解析为 json，将其中所有 一级 key 填充到 字段列表 中
    </div>
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
      topicGroupName: "kafka-group-from-datamove",
      ownerName: "db_xxx",
      tableName: "table_xxx",
      topicValueByData: true,
      fillColumn: true,
      pullWait: 2,
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
      } else {
        this.addColumn(this.mappingColumnList, { columnName: "key" });
        this.addColumn(this.mappingColumnList, { columnName: "value" });
      }
      await this.initTopicList();
    },
    checkData() {
      if (this.selectTolic == null) {
        this.tool.warn("请选择导出的Topic");
        return false;
      }
      if (this.tool.isEmpty(this.topicGroupName)) {
        this.tool.warn("请输入groupId");
        return false;
      }
      if (this.tool.isEmpty(this.pullWait)) {
        this.tool.warn("拉取消息超时时间");
        return false;
      }
      this.from.fillColumn = true;
      this.to.fillColumn = true;
      this.to.ownerName = this.ownerName;
      this.to.tableName = this.tableName;
      this.from.topicName = this.selectTolic.topicName;
      this.from.topicKey = this.topicKey;
      this.from.topicValue = this.topicValue;
      this.from.pullWait = Number(this.pullWait);
      this.from.topicValueByData = this.topicValueByData;
      this.from.topicGroupName = this.topicGroupName;
      this.from.columnList = [];
      this.mappingColumnList.forEach((one) => {
        this.from.columnList.push(one.from);
      });

      return true;
    },
    addTopic(topicList, topicName) {
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
      let param = {
        toolboxId: this.from.toolboxId,
      };
      let res = await this.server.kafka.topics(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || [];
      list.forEach((one) => {
        let topicOne = this.addTopic(this.topicList, one.topic);
        if (one.topic == this.from.topicName) {
          this.selectTolic = topicOne;
        }
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
