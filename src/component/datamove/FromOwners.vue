<template>
  <div class="pdlr-10">
    <el-form class="" size="mini">
      <el-form-item label="所有库" class="mgb-0" v-if="owner == null">
        <el-switch v-model="allOwner"> </el-switch>
      </el-form-item>
      <el-form-item
        v-if="owner != null && table == null"
        label="所有表"
        class="mgb-0"
      >
        <el-switch v-model="owner.allTable"> </el-switch>
      </el-form-item>
    </el-form>
    <template v-if="!allOwner">
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
          label="标密码"
          width="100"
          v-if="to.type == 'database'"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.to.ownerPasswrod" />
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-if="owner != null && !owner.allTable">
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
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "formData", "from", "to"],
  data() {
    return {
      ownerList: [],
      tableList: [],
      allOwner: true,
      toOwnerNameLabel: "",
      toTableNameLabel: "",
      toColumnNameLabel: "",
      owner: null,
      table: null,
    };
  },
  computed: {},
  watch: {
    "to.type"() {
      this.initLabel();
    },
    "from.toolboxId"() {
      this.init();
    },
  },
  methods: {
    initLabel() {
      if (this.to.type == "txt" || this.to.type == "excel") {
        this.toOwnerNameLabel = "映射文件|目录名称";
        this.toTableNameLabel = "映射文件|目录名称";
        this.toColumnNameLabel = "映射字段名称";
      } else if (this.to.type == "sql") {
        this.toOwnerNameLabel = "导出的库名称";
        this.toTableNameLabel = "导出的表名称";
        this.toColumnNameLabel = "导出的字段名称";
      } else if (this.to.type == "elasticsearch") {
        this.toOwnerNameLabel = "映射索引名称";
        this.toTableNameLabel = "映射索引名称";
        this.toColumnNameLabel = "映射字段名称";
      } else if (this.to.type == "kafka") {
        this.toOwnerNameLabel = "映射主题名称";
        this.toTableNameLabel = "映射主题名称";
        this.toColumnNameLabel = "映射字段名称";
      } else if (this.to.type == "database") {
        this.toOwnerNameLabel = "映射库名称";
        this.toTableNameLabel = "映射表名称";
        this.toColumnNameLabel = "映射字段名称";
      } else {
        this.toOwnerNameLabel = "映射名称";
        this.toTableNameLabel = "映射名称";
        this.toColumnNameLabel = "映射名称";
      }
    },
    async init() {
      this.ownerList = [];
      this.tableList = [];
      this.owner = null;
      this.table = null;
      if (this.from.ownerName != null) {
        this.allOwner = false;
      }
      this.initLabel();

      await this.initOwnerList();
      await this.initTableList();
      this.fullFormData();
    },
    fullFormData() {
      this.formData.allOwner = false;
      this.formData.owners = [];
      if (this.owner != null) {
        if (this.owner.allTable) {
          this.owner.tables = [];
        } else {
          this.owner.tables = this.selectTableList || [];
        }
        this.formData.owners = [this.owner];
      } else if (this.allOwner) {
        this.formData.allOwner = true;
      } else {
        this.formData.owners = this.selectOwnerList || [];
      }
    },
    selectionOwner(val) {
      this.selectOwnerList = val;
      this.fullFormData();
    },
    selectionTable(val) {
      this.selectTableList = val;
      this.fullFormData();
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
