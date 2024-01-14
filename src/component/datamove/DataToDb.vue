<template>
  <div class="pdlr-10">
    <el-form size="mini" inline
      ><el-form-item label="选择导入到库" class="mgb-0">
        <el-select
          v-model="selectOwner"
          style="width: 200px"
          filterable
          value-key="ownerName"
        >
          <el-option
            v-for="(one, index) in ownerList"
            :key="index"
            :value="one"
            :label="one.ownerName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库登录用户">
        <el-input
          v-model="to.username"
          style="width: 120px"
          placeholder="默认配置用户"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="库登录密码">
        <el-input
          v-model="to.password"
          style="width: 120px"
          placeholder="默认配置密码"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="from.type != 'sql' && selectOwner != null"
        label="选择导入到表"
        class="mgb-0"
      >
        <el-select
          v-model="selectTable"
          style="width: 200px"
          filterable
          value-key="tableName"
        >
          <el-option
            v-for="(one, index) in tableList"
            :key="index"
            :value="one"
            :label="one.tableName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="from.type == 'script'" label="导入数据数量">
        <el-input v-model="from.total" style="width: 100px"> </el-input>
      </el-form-item>
      <template v-if="from.type == 'txt'">
        <el-form-item label="列分割字符">
          <el-input v-model="from.colSeparator" style="width: 100px">
          </el-input>
        </el-form-item>
        <el-form-item
          :label="'列分割字符转换（替换值中`' + from.colSeparator + '`）'"
        >
          <el-input v-model="from.replaceCol" style="width: 100px"> </el-input>
        </el-form-item>
        <el-form-item label="换行符转换（替换值中`\n`）">
          <el-input v-model="from.replaceLine" style="width: 100px"> </el-input>
        </el-form-item>
      </template>
      <el-form-item
        v-if="
          from.type == 'sql' ||
          (selectTable != null && (from.type == 'txt' || from.type == 'excel'))
        "
        label="文件路径"
      >
        <el-input v-model="filePath" style="width: 300px" readonly="">
        </el-input>
        <el-upload
          v-if="uploadReady"
          class="toolbox-database-import-upload-file"
          :action="source.api + 'upload'"
          :limit="1"
          :data="{ place: 'other' }"
          :headers="{ JWT: tool.getJWT() }"
          name="file"
          :on-success="onFileUpload"
          :show-file-list="false"
        >
          <div class="tm-link color-teal-8">点击上传</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <template v-if="from.type == 'script'">
      <div class="mgb-10">
        <div
          class="tm-link color-green mgr-5 ft-12"
          @click="addColumn(columnList, { columnName: 'columnXXX' })"
        >
          添加字段
        </div>
      </div>
      <el-table :data="columnList" border style="width: 100%" size="mini">
        <el-table-column label="字段" width="200px">
          <template slot-scope="scope">
            <div class="">
              <el-input v-model="scope.row.from.columnName" readonly />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="导出固定值（函数脚本，默认为查询出的值）">
          <template slot-scope="scope">
            <div class="">
              <el-input v-model="scope.row.from.value" />
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
    </template>
    <template
      v-if="from.type == 'data' || from.type == 'txt' || from.type == 'excel'"
    >
      <el-table
        :data="mappingColumnList"
        border
        style="width: 100%"
        size="mini"
      >
        <el-table-column label="字段">
          <template slot-scope="scope">
            <div class="">
              <el-input v-model="scope.row.from.columnName" readonly />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="映射到字段">
          <template slot-scope="scope">
            <div class="">
              <el-select v-model="scope.row.to.columnName" filterable clearable>
                <el-option
                  v-for="(one, index) in columnList"
                  :key="index"
                  :value="one.from.columnName"
                  :label="one.from.columnName"
                >
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "from", "to", "formData"],
  data() {
    return {
      ownerList: [],
      tableList: [],
      mappingColumnList: [],
      columnList: [],
      selectOwner: null,
      selectTable: null,
      filePath: null,
      uploadReady: true,
    };
  },
  computed: {},
  watch: {
    selectOwner() {
      this.$nextTick(() => {
        this.initTableList();
      });
    },
    selectTable() {
      this.$nextTick(() => {
        this.initColumnList();
      });
    },
  },
  methods: {
    async init() {
      this.ownerList = [];
      this.tableList = [];
      this.columnList = [];
      this.mappingColumnList = [];
      this.selectOwner = null;
      this.selectTable = null;
      await this.initData();
    },
    onFileUpload(response) {
      this.uploadReady = false;
      this.$nextTick(() => {
        this.uploadReady = true;
      });
      if (response.code != 0) {
        this.tool.error(response.msg);
        return false;
      }
      this.filePath = response.data.files[0].path;
      if (this.from.type == "txt" || this.from.type == "excel") {
        this.loadFileColumnList();
      }
    },
    async initData() {
      await this.initOwnerList();
    },
    checkData() {
      if (
        this.from.type == "sql" ||
        this.from.type == "txt" ||
        this.from.type == "excel"
      ) {
        if (this.tool.isEmpty(this.filePath)) {
          this.tool.warn("请上传文件");
          return false;
        }
        this.from.filePath = this.filePath;
      }
      if (this.from.type == "sql") {
        return true;
      }
      if (this.selectOwner == null) {
        this.tool.warn("请选择导入到的库");
        return false;
      }
      if (this.selectTable == null) {
        this.tool.warn("请选择导入到的表");
        return false;
      }
      this.to.ownerName = this.selectOwner.ownerName;
      this.to.tableName = this.selectTable.tableName;
      this.to.columnList = [];
      this.from.columnList = [];
      if (
        this.from.type == "data" ||
        this.from.type == "txt" ||
        this.from.type == "excel"
      ) {
        if (this.mappingColumnList.length == 0) {
          this.tool.warn("请设置导入到的列");
          return false;
        }
        this.mappingColumnList.forEach((one) => {
          this.from.columnList.push(one.from);
          this.to.columnList.push(one.to);
        });
      } else if (this.from.type == "script") {
        if (this.columnList.length == 0) {
          this.tool.warn("请设置导入到的列");
          return false;
        }
        this.columnList.forEach((one) => {
          this.from.columnList.push(one.from);
          this.to.columnList.push(one.to);
        });
        this.from.total = Number(this.from.total);
      }

      return true;
    },
    addOwner(owners, ownerName) {
      let owner = {};
      owner.ownerName = ownerName;
      owners.push(owner);
      return owner;
    },
    addTable(tables, tableName) {
      let table = {};
      table.tableName = tableName;
      tables.push(table);
      return table;
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
      if (this.selectOwner == null || this.selectTable == null) {
        return;
      }
      let param = {
        toolboxId: this.to.toolboxId,
        ownerName: this.selectOwner.ownerName,
        tableName: this.selectTable.tableName,
      };
      let res = await this.server.database.tableDetail(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      res.data = res.data || {};
      let list = res.data.columnList || {};
      list.forEach((one) => {
        this.addColumn(this.columnList, one);
      });
    },
    async initTableList() {
      this.tableList = [];
      this.selectTable = null;
      if (this.selectOwner == null) {
        return;
      }
      if (this.to.tableName != null) {
        this.selectTable = this.addTable(this.tableList, this.to.tableName);
        return;
      }
      let param = {
        toolboxId: this.to.toolboxId,
        ownerName: this.selectOwner.ownerName,
      };
      let res = await this.server.database.tables(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || [];
      list.forEach((one) => {
        this.addTable(this.tableList, one.tableName);
      });
    },
    async initOwnerList() {
      this.ownerList = [];
      this.selectOwner = null;
      if (this.to.ownerName != null) {
        this.selectOwner = this.addOwner(this.ownerList, this.to.ownerName);
        return;
      }
      let param = {
        toolboxId: this.to.toolboxId,
      };
      let res = await this.server.database.owners(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || [];
      list.forEach((one) => {
        this.addOwner(this.ownerList, one.ownerName);
      });
    },
    async loadFileColumnList() {
      this.mappingColumnList = [];
      let param = {
        from: {
          type: this.from.type,
          filePath: this.filePath,
          colSeparator: this.from.colSeparator,
        },
      };
      let res = await this.server.datamove.readFileColumnList(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || {};
      list.forEach((one) => {
        this.addColumn(this.mappingColumnList, one);
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
