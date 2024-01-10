<template>
  <div class="pdlr-10 datamove-owners-page">
    <el-form class="" size="mini" inline>
      <el-form-item label="所有库" class="mgb-0" v-if="from.ownerName == null">
        <el-switch v-model="formData.allOwner"> </el-switch>
      </el-form-item>
      <el-form-item
        label="选择库进行配置（如果选择所有库，不受该选项影响）"
        v-if="ownerList.length != 0"
        class="mgb-0"
      >
        <div v-if="ownerList.length == 0" class="ft-12 color-orange">
          没有库信息
        </div>
        <el-select
          v-model="formData.owners"
          clearable
          filterable
          multiple
          value-key="ownerName"
        >
          <el-option
            v-for="(owner, index) in ownerList"
            :value="owner"
            :label="owner.from.ownerName"
            :key="index"
          >
            {{ owner.from.ownerName }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" class="mgb-0">
        <div
          class="tm-link color-orange mgr-5 ft-12"
          v-if="formData.owners.length != 0 && openList"
          @click="openList = false"
        >
          收起库
        </div>
        <div
          class="tm-link color-orange mgr-5 ft-12"
          v-if="formData.owners.length != 0 && !openList"
          @click="openList = true"
        >
          展开库
        </div>
      </el-form-item>
    </el-form>
    <div v-if="formData.owners.length != 0 && openList">
      <template v-for="(owner, ownerIndex) in formData.owners">
        <div
          :key="ownerIndex"
          v-loading="owner.tableListLoading"
          class="owner-one-box"
        >
          <el-form size="mini" inline>
            <el-form-item label="库名称" class="mgb-0">
              <el-input
                v-model="owner.from.ownerName"
                style="width: 150px"
                readonly
              >
              </el-input>
            </el-form-item>
            <el-form-item :label="toOwnerNameLabel" class="mgb-0">
              <el-input v-model="owner.to.ownerName" style="width: 150px">
              </el-input>
            </el-form-item>

            <el-form-item
              label="所有表"
              class="mgb-0"
              v-if="
                from.tableName == null ||
                (owner.tableList != null && owner.tableList.length == 0)
              "
            >
              <el-switch v-model="owner.allTable"> </el-switch>
            </el-form-item>
            <el-form-item label="" class="mgb-0">
              <div
                v-if="owner.tableList == null && from.tableName == null"
                class="tm-link color-green mgr-5"
                @click="initOwnerTables(owner)"
              >
                加载表信息
              </div>
              <div
                v-if="owner.tableList != null && owner.tableList.length == 0"
                class="ft-12 color-orange"
              >
                没有表信息
              </div>
            </el-form-item>

            <el-form-item
              label="选择表进行配置"
              v-if="owner.tableList != null && owner.tableList.length != 0"
              class="mgb-0"
            >
              <el-select
                v-model="owner.tables"
                style="width: 250px"
                clearable
                filterable
                multiple
                value-key="tableName"
              >
                <el-option
                  v-for="(table, index) in owner.tableList"
                  :value="table"
                  :label="table.from.tableName"
                  :key="index"
                >
                  {{ table.from.tableName }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" class="mgb-0">
              <div
                class="tm-link color-orange mgr-5 ft-12"
                v-if="owner.tables.length != 0 && owner.openList"
                @click="owner.openList = false"
              >
                收起表
              </div>
              <div
                class="tm-link color-orange mgr-5 ft-12"
                v-if="owner.tables.length != 0 && !owner.openList"
                @click="owner.openList = true"
              >
                展开表
              </div>
            </el-form-item>
          </el-form>
          <div class="pdl-10" v-if="owner.openList">
            <template v-for="(table, tableIndex) in owner.tables">
              <div :key="tableIndex" class="table-one-box">
                <div v-loading="table.columnListLoading">
                  <el-form size="mini" inline>
                    <el-form-item label="表名称" class="mgb-0">
                      <el-input
                        v-model="table.from.tableName"
                        style="width: 150px"
                        readonly=""
                      >
                      </el-input>
                    </el-form-item>
                    <el-form-item :label="toTableNameLabel" class="mgb-0">
                      <el-input
                        v-model="table.to.tableName"
                        style="width: 150px"
                      >
                      </el-input>
                    </el-form-item>

                    <el-form-item label="所有字段" class="mgb-0">
                      <el-switch v-model="table.allColumn"> </el-switch>
                    </el-form-item>
                    <el-form-item
                      v-if="table.columns == null"
                      label=""
                      class="mgb-0"
                    >
                      <div
                        class="tm-link color-green mgr-5"
                        @click="initTableColumns(owner, table)"
                      >
                        加载字段信息
                      </div>
                    </el-form-item>
                    <el-form-item
                      v-if="table.columns != null"
                      label=""
                      class="mgb-0"
                    >
                      <div
                        class="tm-link color-green mgr-5 ft-12"
                        @click="addColumn(table.columns, 'columnXXX')"
                      >
                        添加字段
                      </div>
                      <div
                        class="tm-link color-orange mgr-5 ft-12"
                        v-if="table.columns.length != 0 && table.openList"
                        @click="table.openList = false"
                      >
                        收起字段
                      </div>
                      <div
                        class="tm-link color-orange mgr-5 ft-12"
                        v-if="table.columns.length != 0 && !table.openList"
                        @click="table.openList = true"
                      >
                        展开字段
                      </div>
                    </el-form-item>
                  </el-form>
                </div>
                <div v-if="table.openList">
                  <el-table
                    :data="table.columns"
                    border
                    style="width: 100%"
                    size="mini"
                  >
                    <el-table-column label="字段">
                      <template slot-scope="scope">
                        <div class="">
                          <el-input v-model="scope.row.from.columnName" />
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column :label="toColumnNameLabel">
                      <template slot-scope="scope">
                        <div class="">
                          <el-input v-model="scope.row.to.columnName" />
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="导出固定值（函数脚本，默认为查询出的值）"
                    >
                      <template slot-scope="scope">
                        <div class="">
                          <el-input v-model="scope.row.value" />
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200px">
                      <template slot-scope="scope">
                        <div
                          class="tm-link color-grey mglr-5 ft-12"
                          @click="upColumn(table, scope.row)"
                        >
                          上移
                        </div>
                        <div
                          class="tm-link color-grey mglr-5 ft-12"
                          @click="downColumn(table, scope.row)"
                        >
                          下移
                        </div>
                        <div
                          class="tm-link color-grey mglr-5 ft-12"
                          @click="
                            addColumn(table.columns, 'columnXXX', scope.row)
                          "
                        >
                          插入
                        </div>
                        <div
                          class="tm-link color-red mglr-5 ft-12"
                          @click="removeColumn(table, scope.row)"
                        >
                          删除
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "formData", "from", "to"],
  data() {
    return {
      ownerList: [],
      toOwnerNameLabel: "",
      toTableNameLabel: "",
      toColumnNameLabel: "",
      openList: true,
    };
  },
  computed: {},
  watch: {
    "from.toolboxId"() {
      this.init();
    },
    "to.type"() {
      this.initLabel();
    },
  },
  methods: {
    initLabel() {
      if (
        this.to.type == "sql" ||
        this.to.type == "txt" ||
        this.to.type == "excel"
      ) {
        this.toOwnerNameLabel = "映射文件|目录名称";
        this.toTableNameLabel = "映射文件|目录名称";
        this.toColumnNameLabel = "映射字段名称";
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
    init() {
      this.ownerList = [];
      this.initLabel();

      this.initOwnerList();
    },
    addOwner(owners, ownerName) {
      let owner = {};
      owner.from = {
        ownerName: ownerName,
      };
      owner.to = {
        ownerName: ownerName,
      };
      owner.ownerName = ownerName;
      owner.allTable = false;
      owner.tables = [];
      owner.tableListLoading = false;
      owner.tableList = null;
      owner.openList = true;
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
      table.columns = null;
      table.columnListLoading = false;
      table.openList = false;
      tables.push(table);
      return table;
    },
    addColumn(columns, columnName, after) {
      let column = {};
      column.from = {
        columnName: columnName,
      };
      column.to = {
        columnName: columnName,
      };
      column.value = null;

      let appendIndex = columns.indexOf(after);
      if (appendIndex < 0) {
        appendIndex = columns.length;
      } else {
        appendIndex++;
      }
      columns.splice(appendIndex, 0, column);
      return column;
    },
    async initTableColumns(owner, table) {
      table.columnListLoading = true;
      table.columns = [];
      let param = {
        toolboxId: this.from.toolboxId,
        ownerName: owner.from.ownerName,
        tableName: table.from.tableName,
      };
      table.openList = true;
      let res = await this.server.database.tableDetail(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let tableDetail = res.data || {};
      let list = tableDetail.columnList || {};
      list.forEach((one) => {
        this.addColumn(table.columns, one.columnName);
      });
      table.columnListLoading = false;
    },
    async initOwnerTables(owner) {
      owner.tableListLoading = true;
      owner.tableList = [];
      let param = {
        toolboxId: this.from.toolboxId,
        ownerName: owner.from.ownerName,
      };
      let res = await this.server.database.tables(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || [];
      list.forEach((one) => {
        this.addTable(owner.tableList, one.tableName);
      });
      owner.tableListLoading = false;
    },
    async initOwnerList() {
      this.formData.owners = [];
      this.ownerList = [];
      if (this.from.ownerName != null) {
        this.formData.allOwner = false;
        let owner = this.addOwner(this.formData.owners, this.from.ownerName);
        owner.allTable = true;
        if (this.from.tableName != null) {
          owner.allTable = false;
          owner.tables = [];
          let table = this.addTable(owner.tables, this.from.tableName);
          table.allColumn = true;
        }
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
    upColumn(table, one) {
      this.tool.up(table, "columns", one);
    },
    downColumn(table, one) {
      this.tool.down(table, "columns", one);
    },
    removeColumn(table, one) {
      let findIndex = table.columns.indexOf(one);
      if (findIndex >= 0) {
        table.columns.splice(findIndex, 1);
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
.datamove-owners-page .owner-one-box {
  border: 1px dotted #4d4d4d;
  margin-top: 5px;
  padding: 5px;
}
.datamove-owners-page .table-one-box {
  border: 1px dotted #4d4d4d;
  margin-top: 5px;
  padding: 5px;
}
</style>
