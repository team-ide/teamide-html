<template>
  <div class="toolbox-database-table">
    <tm-layout height="100%">
      <tm-layout height="80px" class="">
        <el-form class="pdlr-10" size="mini" inline>
          <el-form-item label="库名">
            <template v-if="!isInsert && tableDetail != null">
              <el-input
                v-model="tableDetail.ownerName"
                style="width: 120px"
                readonly
              >
              </el-input>
            </template>
            <template v-else>
              <el-input v-model="form.ownerName" style="width: 120px">
              </el-input>
            </template>
          </el-form-item>
          <el-form-item label="新建表">
            <el-switch v-model="isInsert" :readonly="tableDetail == null">
            </el-switch>
          </el-form-item>
        </el-form>
      </tm-layout>
      <tm-layout height="auto" class="">
        <TableDetail
          class="pd-10"
          ref="TableDetail"
          :source="source"
          :toolboxWorker="toolboxWorker"
          :onChange="onTableDetailChange"
          :columnTypeInfoList="columnTypeInfoList"
          :indexTypeInfoList="indexTypeInfoList"
          :formData="form"
          :getFormData="getFormData"
          :isInsert="isInsert"
          :onError="onError"
        ></TableDetail>
      </tm-layout>
      <tm-layout height="60px" class="">
        <div class="" v-if="error != null">
          <div class="bg-red ft-12 mglr-10 pd-5">{{ error }}</div>
        </div>
      </tm-layout>
      <tm-layout height="40px" class="">
        <div
          class="tm-btn bg-green ft-13 mgl-10"
          @click="toExecuteSql"
          :class="{ 'tm-disabled': executeSqlIng }"
        >
          执行
        </div>
      </tm-layout>
    </tm-layout>
  </div>
</template>

<script>
import TableDetail from "./TableDetail";

export default {
  components: { TableDetail },
  props: [
    "source",
    "toolboxWorker",
    "actived",
    "ownerName",
    "tableName",
    "columnTypeInfoList",
    "indexTypeInfoList",
  ],
  data() {
    return {
      form: {
        ownerName: null,
        tableName: "TB_XXX",
        tableComment: "",
        columnList: [],
        indexList: [],
        targetDatabaseType: "",
        appendOwnerName: true,
        ownerNamePackChar: "",
        tableNamePackChar: "",
        columnNamePackChar: "",
        sqlValuePackChar: "",
      },
      tableDetail: null,
      isInsert: false,
      error: null,
      executeSqlIng: false,
    };
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算
  computed: {},
  // 计算属性 数据变，直接会触发相应的操作
  watch: {},
  methods: {
    onFocus() {
      if (this.inited) {
        return;
      }
      this.$nextTick(async () => {
        this.init();
      });
    },
    async init() {
      this.inited = true;
      let tableDetail = null;
      if (this.tool.isNotEmpty(this.tableName)) {
        tableDetail = await this.toolboxWorker.getTableDetail(
          this.ownerName,
          this.tableName
        );
      }

      this.initForm(this.ownerName, tableDetail);
    },
    async initForm(ownerName, tableDetail) {
      this.form.ownerName = ownerName;
      this.tableDetail = tableDetail;
      this.isInsert = tableDetail == null;
      this.error = null;
      this.executeSqlIng = false;

      this.form.tableName = "TB_XXX";
      this.form.tableComment = "";
      this.form.columnList.splice(0, this.form.columnList.length);
      this.form.indexList.splice(0, this.form.indexList.length);
      if (tableDetail != null) {
        this.form.tableName = tableDetail.tableName;
        this.form.tableComment = tableDetail.tableComment;
        this.form.oldTableName = tableDetail.tableName;
        this.form.oldTableComment = tableDetail.tableComment;
        if (tableDetail.columnList) {
          tableDetail.columnList.forEach((one) => {
            let column = Object.assign({}, one);
            column.oldColumn = one;
            column.deleted = false;
            this.form.columnList.push(column);
          });
        }
        if (tableDetail.indexList) {
          tableDetail.indexList.forEach((one) => {
            let index = Object.assign({}, one);
            index.oldIndex = one;
            index.deleted = false;
            this.form.indexList.push(index);
          });
        }
      }
      this.$nextTick(() => {
        this.$refs.TableDetail.init(
          this.ownerName,
          this.form.tableName,
          this.form
        );
      });
    },
    getFormData() {
      this.form.columnList.forEach((one) => {
        one.columnLength = Number(one.columnLength);
        one.columnPrecision = Number(one.columnPrecision);
        one.columnScale = Number(one.columnScale);
      });
      let data = Object.assign({}, this.form);
      data.columnList = [];
      this.form.columnList.forEach((one) => {
        let column = Object.assign({}, one);
        data.columnList.push(column);
      });
      data.indexList = [];
      this.form.indexList.forEach((one) => {
        let index = Object.assign({}, one);
        data.indexList.push(index);
      });
      this.toolboxWorker.formatParam(data);
      return data;
    },
    async toExecuteSql() {
      let data = this.getFormData();
      let param = this.toolboxWorker.getWorkParam(data);

      this.executeSqlIng = true;
      let res = null;
      if (this.isInsert) {
        res = await this.server.database.tableCreate(param);
      } else {
        param.ownerName = this.ownerName;
        param.tableName = this.tableName || this.form.tableName;
        res = await this.server.database.tableUpdate(param);
      }
      this.executeSqlIng = false;
      this.error = null;
      if (res.code != 0) {
        this.error = res.msg;
        return;
      }
      this.tool.success("执行成功");
      let tableDetail = await this.toolboxWorker.getTableDetail(
        param.ownerName,
        param.tableName
      );
      this.initForm(param.ownerName, tableDetail);
    },
    async onTableDetailChange() {},
    onError(error) {
      this.error = error;
    },
  },
  created() {},
  updated() {},
  mounted() {
    if (this.actived) {
      this.init();
    }
  },
};
</script>

<style>
.toolbox-database-table {
  width: 100%;
  height: 100%;
}
</style>
