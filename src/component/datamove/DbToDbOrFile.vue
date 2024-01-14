<template>
  <div class="pdlr-10">
    <el-form size="mini" inline>
      <el-form-item label="使用SQL导出">
        <el-switch v-model="bySql"> </el-switch>
      </el-form-item>
      <template v-if="!bySql">
        <template v-if="from.type == 'database' && to.type == 'database'">
          <el-form-item label="同步库">
            <el-switch v-model="shouldOwner"> </el-switch>
          </el-form-item>
          <el-form-item label="同步表">
            <el-switch v-model="shouldTable"> </el-switch>
          </el-form-item>
        </template>
        <template v-if="from.type == 'database' && to.type == 'sql'">
          <el-form-item label="建库语句">
            <el-switch v-model="shouldOwner"> </el-switch>
          </el-form-item>
          <el-form-item label="建表语句">
            <el-switch v-model="shouldTable"> </el-switch>
          </el-form-item>
        </template>

        <el-form-item
          v-if="from.type == 'database' && to.type == 'sql'"
          label="SQL文件合并类型"
        >
          <el-select
            v-model="to.sqlFileMergeType"
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
              (to.type == 'sql' && to.sqlFileMergeType == 'table'))
          "
          label="文件名称格式"
        >
          <el-select
            v-model="to.fileNameSplice"
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
      </template>
      <template v-if="bySql && (to.type == 'database' || to.type == 'sql')">
        <el-form-item label="导入到库">
          <el-input v-model="to.ownerName" style="width: 150px"> </el-input>
        </el-form-item>
        <el-form-item v-if="to.type == 'database'" label="库登录用户">
          <el-input
            v-model="to.username"
            style="width: 120px"
            placeholder="默认配置用户"
          >
          </el-input>
        </el-form-item>
        <el-form-item v-if="to.type == 'database'" label="库登录密码">
          <el-input
            v-model="to.password"
            style="width: 120px"
            placeholder="默认配置密码"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="导入到表">
          <el-input v-model="to.tableName" style="width: 150px"> </el-input>
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
      </template>
      <el-form-item label="所有库" class="mgb-0" v-if="owner == null && !bySql">
        <el-switch v-model="allOwner"> </el-switch>
      </el-form-item>
      <el-form-item
        v-if="owner != null && table == null && !bySql"
        label="所有表"
        class="mgb-0"
      >
        <el-switch v-model="owner.allTable"> </el-switch>
      </el-form-item>
      <el-form-item
        v-if="
          (to.type == 'sql' && to.sqlFileMergeType == 'one') ||
          (bySql && to.type != 'database')
        "
        label="导出保存文件名"
      >
        <el-input v-model="to.fileName" style="width: 100px"> </el-input>
      </el-form-item>
    </el-form>
    <template v-if="!allOwner && !bySql">
      <div class="ft-12 color-orange pdtb-10">
        配置库映射信息，如果库需要单独的用户名、密码访问，则填写下信息否则使用主配置查询
      </div>
      <el-table
        :data="ownerList"
        border
        style="width: 100%"
        size="mini"
        @selection-change="selectionOwner"
      >
        <el-table-column v-if="owner == null" type="selection" width="55">
        </el-table-column>
        <el-table-column label="库" prop="ownerName" sortable>
        </el-table-column>
        <el-table-column label="源用户名" width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.from.ownerUsername" />
          </template>
        </el-table-column>
        <el-table-column label="源密码" width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.from.ownerPasswrod" />
          </template>
        </el-table-column>
        <el-table-column :label="toOwnerNameLabel">
          <template slot-scope="scope">
            <el-input v-model="scope.row.to.ownerName" /> </template
        ></el-table-column>
        <el-table-column
          label="目标用户名"
          width="100"
          v-if="to.type == 'database'"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.to.ownerUsername" />
          </template>
        </el-table-column>
        <el-table-column
          label="目标密码"
          width="100"
          v-if="to.type == 'database'"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.to.ownerPasswrod" />
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-if="owner != null && !owner.allTable && !bySql">
      <div class="ft-12 color-orange pdtb-10">配置 表 映射信息</div>
      <el-table
        :data="tableList"
        border
        style="width: 100%"
        size="mini"
        @selection-change="selectionTable"
      >
        <el-table-column type="selection" width="55" v-if="table == null">
        </el-table-column>
        <el-table-column label="表" prop="tableName" sortable>
        </el-table-column>
        <el-table-column :label="toTableNameLabel">
          <template slot-scope="scope">
            <el-input v-model="scope.row.to.tableName" /> </template
        ></el-table-column>
      </el-table>
    </template>
    <template v-if="bySql">
      <Editor
        ref="Editor"
        :source="source"
        language="sql"
        style="height: 200px"
      ></Editor>
    </template>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "from", "to", "formData"],
  data() {
    return {
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
      ownerList: [],
      tableList: [],
      allOwner: true,
      toOwnerNameLabel: "",
      toTableNameLabel: "",
      toColumnNameLabel: "",
      owner: null,
      table: null,
      shouldOwner: true,
      shouldTable: true,
      bySql: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.ownerList = [];
      this.tableList = [];
      this.owner = null;
      this.table = null;
      this.bySql = this.from.bySql;
      if (this.from.ownerName != null) {
        this.allOwner = false;
      }
      await this.initData();
    },
    async initData() {
      if (this.to.type == "txt" || this.to.type == "excel") {
        this.toOwnerNameLabel = "映射文件|目录名称";
        this.toTableNameLabel = "映射文件|目录名称";
        this.toColumnNameLabel = "映射字段名称";
      } else if (this.to.type == "sql") {
        this.toOwnerNameLabel = "导出的库名称";
        this.toTableNameLabel = "导出的表名称";
        this.toColumnNameLabel = "导出的字段名称";
      } else if (this.to.type == "database") {
        this.toOwnerNameLabel = "映射库名称";
        this.toTableNameLabel = "映射表名称";
        this.toColumnNameLabel = "映射字段名称";
      } else {
        this.toOwnerNameLabel = "映射名称";
        this.toTableNameLabel = "映射名称";
        this.toColumnNameLabel = "映射名称";
      }
      await this.initOwnerList();
      await this.initTableList();
    },
    checkData() {
      this.from.allOwner = false;
      this.from.owners = [];
      this.from.bySql = this.bySql;
      if (this.bySql) {
        this.from.shouldOwner = false;
        this.from.shouldTable = false;
        if (this.to.type == "sql") {
          if (this.tool.isEmpty(this.to.tableName)) {
            this.tool.warn("请输入目标表名称");
            return false;
          }
        }
        let selectSql = this.$refs.Editor.getValue();
        if (this.tool.isEmpty(selectSql)) {
          this.tool.warn("请输入SQL");
          return false;
        }
        this.from.selectSql = selectSql;
      } else {
        this.from.shouldOwner = this.shouldOwner;
        this.from.shouldTable = this.shouldTable;
        if (this.owner != null) {
          if (this.owner.allTable) {
            this.owner.tables = [];
          } else {
            if (this.table != null) {
              this.owner.tables = [this.table];
            } else {
              this.owner.tables = this.selectTableList || [];
            }
          }
          this.from.owners = [this.owner];
        } else if (this.allOwner) {
          this.from.allOwner = true;
        } else {
          this.from.owners = this.selectOwnerList || [];
        }
      }
      return true;
    },
    selectionOwner(val) {
      this.selectOwnerList = val;
    },
    selectionTable(val) {
      this.selectTableList = val;
    },
    addOwner(owners, ownerName) {
      let owner = {};
      owner.from = {
        ownerName: ownerName,
        ownerUsername: "",
        ownerPasswrod: "",
      };
      owner.to = {
        ownerName: ownerName,
        ownerUsername: "",
        ownerPasswrod: "",
      };
      owner.allTable = true;
      owner.ownerName = ownerName;
      owner.tableListLoaded = false;
      owners.push(owner);
      return owner;
    },
    addTable(tables, tableName) {
      let table = {};
      table.from = {
        tableName: tableName,
      };
      table.to = {
        tableName: tableName,
      };
      table.tableName = tableName;
      table.allColumn = true;
      tables.push(table);
      return table;
    },
    async initTableList() {
      if (this.from.ownerName == null) {
        return;
      }
      if (this.from.tableName != null) {
        this.owner.allTable = false;
        this.table = this.addTable(this.tableList, this.from.tableName);
        return;
      }
      this.owner.allTable = true;
      let param = {
        toolboxId: this.from.toolboxId,
        ownerName: this.from.ownerName,
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
      if (this.from.ownerName != null) {
        this.allOwner = false;
        this.owner = this.addOwner(this.ownerList, this.from.ownerName);
        return;
      }
      let param = {
        toolboxId: this.from.toolboxId,
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
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
</style>
