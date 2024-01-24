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
      <el-form-item label="选择导出的 索引" class="mgb-0">
        <el-select
          v-model="selectIndex"
          style="width: 200px"
          filterable
          value-key="indexName"
        >
          <el-option
            v-for="(one, index) in indexList"
            :key="index"
            :value="one"
            :label="one.indexName"
          >
          </el-option>
        </el-select>
      </el-form-item>
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
export default {
  components: {},
  props: ["source", "from", "to", "formData"],
  data() {
    return {
      indexList: [],
      columnList: [],
      selectIndex: null,
      ownerName: "db_xxx",
      tableName: "table_xxx",
    };
  },
  computed: {},
  watch: {
    selectIndex() {
      this.$nextTick(() => {
        this.initColumnList();
      });
    },
  },
  methods: {
    async init() {
      this.indexList = [];
      this.columnList = [];
      this.selectIndex = null;
      await this.initData();
    },
    async initData() {
      await this.initIndexList();
    },
    checkData() {
      if (this.selectIndex == null) {
        this.tool.warn("请选择导出的Topic");
        return false;
      }
      this.from.fillColumn = true;
      this.to.fillColumn = true;
      this.to.ownerName = this.ownerName;
      this.to.tableName = this.tableName;
      this.from.indexName = this.selectIndex.indexName;
      this.from.columnList = [];
      this.to.columnList = [];
      this.columnList.forEach((one) => {
        this.from.columnList.push(one.from);
        this.to.columnList.push(one.to);
      });

      return true;
    },
    addIndex(indexList, indexName) {
      let one = {};
      one.indexName = indexName;
      indexList.push(one);
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
      if (this.selectIndex == null) {
        return;
      }
      let param = {
        toolboxId: this.from.toolboxId,
        indexName: this.selectIndex.indexName,
      };
      let res = await this.server.elasticsearch.getMapping(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      res.data = res.data || {};
      let list = [];
      list.push({
        columnName: "_id",
      });
      list.push({
        columnName: "_source",
      });
      if (res.data.mappings && res.data.mappings.properties) {
        let properties = res.data.mappings.properties;
        for (let k in properties) {
          list.push({ columnName: k });
        }
      }
      list.forEach((one) => {
        this.addColumn(this.columnList, one);
      });
    },
    async initIndexList() {
      this.indexList = [];
      this.selectIndex = null;
      let param = {
        toolboxId: this.from.toolboxId,
      };
      let res = await this.server.elasticsearch.indexes(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || [];
      list.forEach((one) => {
        let one_ = this.addIndex(this.indexList, one.indexName);
        if (one_.indexName == this.from.indexName) {
          this.selectIndex = one_;
        }
      });
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
