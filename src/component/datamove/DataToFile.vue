<template>
  <div class="pdlr-10">
    <el-form size="mini" inline>
      <el-form-item label="数据量">
        <el-input v-model="dataTotal" style="width: 100px" readonly="">
        </el-input>
      </el-form-item>
      <el-form-item label="导出保存文件名">
        <el-input v-model="to.fileName" style="width: 100px"> </el-input>
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
      </template>
      <template v-if="to.type == 'sql'">
        <el-form-item label="导出库名称">
          <el-input v-model="to.ownerName" style="width: 200px"> </el-input>
        </el-form-item>
        <el-form-item label="导出表名称">
          <el-input v-model="to.tableName" style="width: 200px"> </el-input>
        </el-form-item>
        <DatabasePack
          :source="source"
          :config="to"
          :shouldDialectType="true"
          :change="changeDatabasePack"
        ></DatabasePack>
      </template>
    </el-form>
    <div class="mgb-10">
      <div
        class="tm-link color-green mgr-5 ft-12"
        @click="addColumn(columnList, { columnName: 'columnXXX' })"
      >
        添加字段
      </div>
    </div>
    <el-table :data="columnList" border style="width: 100%" size="mini">
      <el-table-column label="字段">
        <template slot-scope="scope">
          <div class="">
            <el-input v-model="scope.row.from.columnName" readonly />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="导出列名称">
        <template slot-scope="scope">
          <div class="">
            <el-input v-model="scope.row.to.columnName" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <div
            class="tm-link color-grey mglr-5 ft-12"
            @click="upColumn(scope.row)"
          >
            上移
          </div>
          <div
            class="tm-link color-grey mglr-5 ft-12"
            @click="downColumn(scope.row)"
          >
            下移
          </div>
          <div
            class="tm-link color-grey mglr-5 ft-12"
            @click="
              addColumn(columnList, { columnName: 'columnXXX' }, scope.row)
            "
          >
            插入
          </div>
          <div
            class="tm-link color-red mglr-5 ft-12"
            @click="removeColumn(scope.row)"
          >
            删除
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
import DatabasePack from "./DatabasePack";

export default {
  components: { DatabasePack },
  props: ["source", "from", "to", "formData"],
  data() {
    return {
      columnList: [],
      dataTotal: 0,
    };
  },
  computed: {},
  watch: {},
  methods: {
    changeDatabasePack() {},
    async init() {
      await this.initData();
    },
    async initData() {
      this.dataTotal = 0;
      if (this.from.dataList) {
        this.dataTotal = this.from.dataList.length;
      }
      this.columnList = [];
      if (this.from.columnList == null) {
        return;
      }
      this.from.columnList.forEach((one) => {
        this.addColumn(this.columnList, one);
      });
    },
    checkData() {
      if (this.columnList.length == 0) {
        this.tool.warn("请配置字段信息");
        return false;
      }
      this.to.columnList = [];
      this.from.columnList = [];

      this.columnList.forEach((one) => {
        this.from.columnList.push(one.from);
        this.to.columnList.push(one.to);
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
    upColumn(one) {
      this.tool.up(this, "columnList", one);
    },
    downColumn(one) {
      this.tool.down(this, "columnList", one);
    },
    removeColumn(one) {
      let findIndex = this.columnList.indexOf(one);
      if (findIndex >= 0) {
        this.columnList.splice(findIndex, 1);
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
