<template>
  <div class="toolbox-database-ddl" v-loading="loading">
    <template v-if="ready">
      <el-form
        class="pdt-10 pdlr-10"
        ref="form"
        :model="form"
        size="mini"
        inline
      >
        <el-form-item label="生成建库">
          <el-switch v-model="form.appendOwnerCreateSql" @change="toLoad">
          </el-switch>
        </el-form-item>
        <Pack
          :source="source"
          :toolboxWorker="toolboxWorker"
          :form="form"
          :change="toLoad"
        >
        </Pack>
      </el-form>
      <div style="height: calc(100% - 140px) !important">
        <Editor
          ref="Editor"
          :source="source"
          :value="showDDL"
          language="sql"
        ></Editor>
      </div>
    </template>
  </div>
</template>


<script>
import Pack from "./Pack";

export default {
  components: { Pack },
  props: ["source", "toolboxWorker", "actived", "ownerName", "tableName"],
  data() {
    return {
      ready: false,
      showDDL: null,
      loading: false,
      form: {
        appendOwnerCreateSql: true,

        targetDatabaseType: "",
        appendOwnerName: true,
        ownerNamePackChar: "",
        tableNamePackChar: "",
        columnNamePackChar: "",
        sqlValuePackChar: "",
      },
    };
  },
  computed: {},
  watch: {
    "form.targetDatabaseType"() {
      this.toLoad();
    },
  },
  methods: {
    onFocus() {
      if (this.inited) {
        return;
      }
      this.$nextTick(async () => {
        this.init();
      });
    },
    init() {
      this.inited = true;
      this.ready = true;
      this.toLoad();
    },
    async toLoad() {
      this.loading = true;
      await this.load();
      this.loading = false;
    },
    async load() {
      let sqls = await this.loadDDL(this.ownerName, this.tableName);
      let ddl = "";
      sqls.forEach((sql, index) => {
        if (index > 0) {
          ddl += "\n\n";
        }
        ddl += sql + ";";
      });
      this.$refs.Editor.setValue(ddl);
    },
    async loadDDL(ownerName, tableName) {
      let param = this.toolboxWorker.getWorkParam(Object.assign({}, this.form));
      this.toolboxWorker.formatParam(param);
      param.ownerName = ownerName;
      param.tableName = tableName;
      let res = await this.server.database.ddl(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      return res.data || [];
    },
  },
  created() {},
  mounted() {
    if (this.actived) {
      this.init();
    }
  },
};
</script>

<style>
.toolbox-database-ddl {
  width: 100%;
  height: 100%;
}
</style>
