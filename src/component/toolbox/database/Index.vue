<template>
  <div class="toolbox-database-editor">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout width="300px" class="">
          <Owner
            ref="Owner"
            :source="source"
            :toolboxWorker="toolboxWorker"
            :extend="extend"
            :ownersChange="ownersChange"
            :openDateFormat="openDateFormat"
            :changeOpenDateFormat="changeOpenDateFormat"
          >
          </Owner>
        </tm-layout>
        <tm-layout-bar right></tm-layout-bar>
        <tm-layout width="auto">
          <Tabs
            :source="source"
            :toolboxWorker="toolboxWorker"
            :owners="owners"
            :columnTypeInfoList="columnTypeInfoList"
            :indexTypeInfoList="indexTypeInfoList"
            :openDateFormat="openDateFormat"
          >
          </Tabs>
        </tm-layout>
      </tm-layout>
      <TableDataListExecSql :source="source" :toolboxWorker="toolboxWorker">
      </TableDataListExecSql>
      <TableDataListSql :source="source" :toolboxWorker="toolboxWorker">
      </TableDataListSql>
      <OwnerCreate :source="source" :toolboxWorker="toolboxWorker">
      </OwnerCreate>
      <Table :source="source" :toolboxWorker="toolboxWorker"> </Table>
    </template>
    <ShowInfo :source="source" :toolboxWorker="toolboxWorker"> </ShowInfo>

    <SqlProfile
      ref="SqlProfile"
      :source="source"
      :toolboxWorker="toolboxWorker"
      :getRowMenus="getRowMenus"
      :openDateFormat="openDateFormat"
    >
    </SqlProfile>

    <DataListExport
      ref="DataListExport"
      :source="source"
      :toolboxWorker="toolboxWorker"
    ></DataListExport>
    <SqlFiles
      ref="SqlFiles"
      :source="source"
      :toolboxWorker="toolboxWorker"
    ></SqlFiles>
  </div>
</template>


<script>
import Owner from "./Owner";
import Tabs from "./Tabs";
import TableDataListExecSql from "./TableDataListExecSql";
import TableDataListSql from "./TableDataListSql";
import OwnerCreate from "./OwnerCreate";
import ShowInfo from "./ShowInfo";
import SqlProfile from "./SqlProfile";
import DataListExport from "./DataListExport";
import SqlFiles from "./SqlFiles";

export default {
  components: {
    Owner,
    Tabs,
    TableDataListExecSql,
    TableDataListSql,
    OwnerCreate,
    ShowInfo,
    SqlProfile,
    DataListExport,
    SqlFiles,
  },
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      ready: false,
      owners: [],
      columnTypeInfoList: [],
      indexTypeInfoList: [],
      openDateFormat: true,
      info: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      if (this.extend != null) {
        if (this.tool.isNotEmpty(this.extend.openDateFormat)) {
          this.openDateFormat = this.extend.openDateFormat;
        }
      }

      this.toolboxWorker.getInfo = this.getInfo;
      this.toolboxWorker.isMySql = this.isMySql;
      this.toolboxWorker.columnIsNumber = this.columnIsNumber;
      this.toolboxWorker.columnIsDate = this.columnIsDate;
      this.toolboxWorker.formatDateColumn = this.formatDateColumn;
      this.toolboxWorker.formatParam = this.formatParam;
      this.toolboxWorker.showSqlProfile = this.showSqlProfile;
      this.toolboxWorker.getRowMenus = this.getRowMenus;
      this.toolboxWorker.showDataListExport = this.showDataListExport;
      await this.loadData();
      this.ready = true;
    },
    changeOpenDateFormat(openDateFormat) {
      this.openDateFormat = openDateFormat;
      this.toolboxWorker.updateExtend({
        openDateFormat: openDateFormat,
      });
    },
    getInfo() {
      return this.info;
    },
    getRowMenus(row, column, event) {
      let menus = [];

      if (column) {
        menus.push({
          text: "查看列数据",
          onClick: () => {
            this.tool.showJSONData(row[column.name]);
          },
        });
      }
      menus.push({
        text: "查看行数据",
        onClick: () => {
          this.tool.showJSONData(row);
        },
      });

      if (row) {
        let ownerName = "ownerName";
        let dataList = [Object.assign({}, row)];
        let tableDetail = {
          tableName: "tableName",
          columnList: [],
        };

        for (let name in row) {
          tableDetail.columnList.push({
            columnName: name,
          });
        }
        menus.push({
          text: "查看SQL",
          onClick: () => {
            this.toolboxWorker.showTableDataListSql(
              ownerName,
              tableDetail,
              dataList
            );
          },
        });
      }

      return menus;
    },
    showDataListExport(options) {
      this.$refs.DataListExport.show(options);
    },
    showSqlProfile(data) {
      if (data == null || data.profiling == null) {
        this.tool.warn("Sql Profile数据不存在");
        return;
      }
      this.$refs.SqlProfile.show(data);
    },
    async loadData() {
      let param = this.toolboxWorker.getWorkParam({});
      let res = await this.server.database.data(param);
      let data = res.data || {};
      this.info = data.info;
      this.columnTypeInfoList = data.columnTypeInfoList || [];
      this.indexTypeInfoList = data.indexTypeInfoList || [];
    },
    formatParam(param) {
      param = param || {};
      if (this.tool.isEmpty(param.ownerNamePackChar)) {
        delete param.ownerNamePack;
        delete param.ownerNamePackChar;
      } else {
        if (param.ownerNamePackChar == "-") {
          param.ownerNamePack = false;
        } else {
          param.ownerNamePack = true;
        }
      }
      if (this.tool.isEmpty(param.tableNamePackChar)) {
        delete param.tableNamePack;
        delete param.tableNamePackChar;
      } else {
        if (param.tableNamePackChar == "-") {
          param.tableNamePack = false;
        } else {
          param.tableNamePack = true;
        }
      }
      if (this.tool.isEmpty(param.columnNamePackChar)) {
        delete param.columnNamePack;
        delete param.columnNamePackChar;
      } else {
        if (param.columnNamePackChar == "-") {
          param.columnNamePack = false;
        } else {
          param.columnNamePack = true;
        }
      }
      if (this.tool.isEmpty(param.sqlValuePackChar)) {
        delete param.sqlValuePackChar;
      }
    },
    ownersChange(owners) {
      this.owners = owners;
    },
    columnIsNumber(column) {
      let type = ("" + column.type).toLowerCase();
      if (
        type == "int" ||
        type == "bigint" ||
        type == "bit" ||
        type == "number" ||
        type == "tinyint" ||
        type == "smallint" ||
        type == "integer" ||
        type == "float" ||
        type == "double" ||
        type == "dec" ||
        type == "decimal"
      ) {
        return true;
      }
      return false;
    },
    columnIsDate(column) {
      let type = ("" + column.type).toLowerCase();
      if (
        type == "year" ||
        type == "date" ||
        type == "time" ||
        type == "datetime" ||
        type == "timestamp"
      ) {
        return true;
      }
      return false;
    },
    formatDateColumn(column, value) {
      if (value == null) {
        return;
      }
      let type = ("" + column.type).toLowerCase();

      try {
        if (type == "year") {
          value = this.tool.formatDate(new Date(value), "yyyy");
        } else if (type == "date") {
          value = this.tool.formatDate(new Date(value), "yyyy-MM-dd");
        } else if (type == "time") {
          value = this.tool.formatDate(new Date(value), "hh:mm:ss");
        } else if (type == "datetime" || type == "timestamp") {
          value = this.tool.formatDate(new Date(value), "yyyy-MM-dd hh:mm:ss");
        }
      } catch (e) {
        this.tool.error(e.toString());
      }
      return value;
    },
    async loadOwners() {
      let param = this.toolboxWorker.getWorkParam({});
      let res = await this.server.database.owners(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || [];
      let info = this.toolboxWorker.getInfo();
      let owners = [];
      list.forEach((one) => {
        one.order = 1;
        if (info != null) {
          if (
            info.database != null &&
            info.database.toLowerCase() == one.ownerName.toLowerCase()
          ) {
            one.order = 0;
          } else if (
            info.dbName != null &&
            info.dbName.toLowerCase() == one.ownerName.toLowerCase()
          ) {
            one.order = 0;
          } else if (
            info.username != null &&
            info.username.toLowerCase() == one.ownerName.toLowerCase()
          ) {
            one.order = 0;
          }
        }
        owners.push(one);
      });
      owners.sort(function (a, b) {
        return a.order - b.order; //正序
      });
      return owners;
    },
    isMySql() {
      let info = this.toolboxWorker.getInfo();
      return info != null && info.dialectType == "mysql";
    },
    async loadTables(ownerName) {
      let param = this.toolboxWorker.getWorkParam({
        ownerName: ownerName,
      });

      let res = await this.server.database.tables(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      return res.data || [];
    },
    async getTableDetail(ownerName, tableName) {
      let res = await this.loadTableDetail(ownerName, tableName);
      return res;
    },
    async loadTableDetail(ownerName, tableName) {
      let param = this.toolboxWorker.getWorkParam({
        ownerName: ownerName,
        tableName: tableName,
      });
      let res = await this.server.database.tableDetail(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
        return null;
      }
      let tableDetail = res.data;
      if (tableDetail) {
        tableDetail.columnList = tableDetail.columnList || [];
        tableDetail.indexList = tableDetail.indexList || [];
      }
      return tableDetail;
    },
    refresh() {
      this.$refs.Owner.refresh();
    },
  },
  created() {},
  mounted() {
    this.toolboxWorker.loadOwners = this.loadOwners;
    this.toolboxWorker.loadTables = this.loadTables;
    this.toolboxWorker.getTableDetail = this.getTableDetail;
    this.init();
  },
  beforeDestroy() {
    let param = this.toolboxWorker.getWorkParam({});
    this.server.database.close(param);
  },
};
</script>

<style>
.toolbox-database-editor {
  width: 100%;
  height: 100%;
}
</style>
