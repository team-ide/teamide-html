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
      <el-form-item label="导出Key">
        <el-input v-model="redisKeyPattern" style="width: 200px"> </el-input>
        <div class="color-orange ft-12">输入模糊搜索，如`*`、`xx*`</div>
      </el-form-item>
      <el-form-item label="导出Database">
        <el-input v-model="redisDatabase" style="width: 100px"> </el-input>
      </el-form-item>

      <el-form-item label="Key 字段名称">
        <el-input v-model="redisKeyName" style="width: 100px"> </el-input>
      </el-form-item>
      <el-form-item label="Field 字段名称">
        <el-input v-model="redisFieldName" style="width: 100px"> </el-input>
        <div class="color-orange ft-12">set、list为索引，hash 为 hash key</div>
      </el-form-item>
      <el-form-item label="Value 字段名称">
        <el-input v-model="redisValueName" style="width: 100px"> </el-input>
      </el-form-item>
      <el-form-item label="Value 类型 名称">
        <el-input v-model="redisValueTypeName" style="width: 100px"> </el-input>
      </el-form-item>
      <el-form-item label="自动解析Value转 Data">
        <el-switch v-model="redisValueByData"> </el-switch>
      </el-form-item>
    </el-form>
    <div class="color-orange ft-15 ft-600">
      导出key、valueType、field、value字段
    </div>
    <div class="color-orange ft-15 ft-600">
      可以选中 自动解析Value转 Data， 如果 value可以解析为 json，将其中所有 一级
      key 填充到 字段列表 中
    </div>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "from", "to", "formData"],
  data() {
    return {
      mappingColumnList: [],
      columnList: [],
      redisDatabase: 0,
      redisKeyPattern: "*",
      redisKeyName: "key",
      redisFieldName: "field",
      redisValueName: "value",
      redisValueTypeName: "valueType",
      redisValueByData: true,
      ownerName: "db_xxx",
      tableName: "table_xxx",
      fillColumn: true,
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
        this.addColumn(this.mappingColumnList, { columnName: "valueType" });
        this.addColumn(this.mappingColumnList, { columnName: "field" });
        this.addColumn(this.mappingColumnList, { columnName: "value" });
      }
    },
    checkData() {
      if (this.tool.isEmpty(this.redisKeyPattern)) {
        this.tool.warn("请输入 搜索 key");
        return false;
      }
      this.from.fillColumn = true;
      this.to.fillColumn = true;
      this.to.ownerName = this.ownerName;
      this.to.tableName = this.tableName;
      this.from.redisDatabase = Number(this.redisDatabase);

      this.from.redisKeyPattern = this.redisKeyPattern;
      this.from.redisKeyName = this.redisKeyName;
      this.from.redisFieldName = this.redisFieldName;
      this.from.redisValueTypeName = this.redisValueTypeName;
      this.from.redisValueName = this.redisValueName;
      this.from.redisValueByData = this.redisValueByData;
      this.from.columnList = [];
      this.mappingColumnList.forEach((one) => {
        this.from.columnList.push(one.from);
      });

      return true;
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
