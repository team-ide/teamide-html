<template>
  <el-dialog
    ref="modal"
    :title="
      '导出：[' +
      ownerName +
      '].[' +
      (tableDetail == null ? '' : tableDetail.tableName) +
      '] 数据为SQL'
    "
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :show-close="true"
    :append-to-body="true"
    :visible="showDialog"
    :before-close="hide"
    :destroy-on-close="true"
    class="app-dialog"
    :fullscreen="true"
  >
    <div class="pd-10" style="height: 100%">
      <el-form ref="form" :model="form" size="mini" :inline="true">
        <Pack
          :source="source"
          :toolboxWorker="toolboxWorker"
          :form="form"
          :change="toLoad"
        >
        </Pack>
      </el-form>
      <div style="height: calc(100% - 120px)">
        <Editor
          ref="Editor"
          :source="source"
          :value="showSQL"
          language="sql"
        ></Editor>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Pack from "./Pack";

export default {
  components: { Pack },
  props: ["source", "toolboxWorker"],
  data() {
    return {
      showDialog: false,
      showSQL: null,
      ownerName: null,
      tableDetail: null,
      form: {
        targetDatabaseType: "",
        appendOwnerName: true,
        ownerNamePackChar: "",
        tableNamePackChar: "",
        columnNamePackChar: "",
        sqlValuePackChar: "",
      },
    };
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算
  computed: {},
  // 计算属性 数据变，直接会触发相应的操作
  watch: {
    "form.targetDatabaseType"() {
      this.toLoad();
    },
  },
  methods: {
    async show(ownerName, tableDetail, params) {
      this.ownerName = ownerName;
      this.tableDetail = tableDetail;
      this.insertList = params.insertList;
      this.updateList = params.updateList;
      this.updateWhereList = params.updateWhereList;
      this.deleteList = params.deleteList;
      this.showDialog = true;
      await this.toLoad();
    },
    hide() {
      this.showDialog = false;
    },
    async toLoad() {
      let showSQL = "";
      let sqlList = await this.loadSqls();
      sqlList.forEach((sql) => {
        showSQL += sql + ";\n\n";
      });
      this.showSQL = showSQL;
      this.$refs.Editor.setValue(showSQL);
    },
    async loadSqls() {
      let data = Object.assign({}, this.form);
      this.toolboxWorker.formatParam(data);

      data.appendSqlValue = true;
      data.ownerName = this.ownerName;
      data.tableName = this.tableDetail.tableName;
      data.columnList = this.tableDetail.columnList;

      data.insertList = this.insertList;
      data.updateList = this.updateList;
      data.updateWhereList = this.updateWhereList;
      data.deleteList = this.deleteList;

      let param = this.toolboxWorker.getWorkParam(data);
      let res = await this.server.database.dataListSql(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      return res.data || [];
    },
    init() {},
  },
  // 在实例创建完成后被立即调用
  created() {},
  // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用
  mounted() {
    this.toolboxWorker.showTableDataListExecSql = this.show;
    this.init();
  },
};
</script>

<style>
</style>
