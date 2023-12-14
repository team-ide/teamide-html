<template>
  <div class="toolbox-database-sql">
    <tm-layout height="100%">
      <tm-layout height="80px" class="">
        <el-form
          class="pdt-5 pdl-10"
          ref="form"
          :model="form"
          size="mini"
          inline
        >
          <el-form-item label="索引" class="mgb-5">
            <el-select
              v-model="form.indexName"
              style="width: 200px"
              filterable
              allow-create
            >
              <el-option
                v-for="(one, index) in indexes"
                :key="index"
                :value="one.indexName"
                :label="one.indexName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="URL" class="mgb-5">
            <el-select
              v-model="form.url"
              style="width: 200px"
              filterable
              allow-create
            >
              <el-option value="/_search" label="/_search"> </el-option>
              <el-option value="/_doc/x" label="/_doc/x"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="方法" class="mgb-5">
            <el-select
              v-model="form.method"
              style="width: 100px"
              filterable
              allow-create
            >
              <el-option value="POST" label="POST"> </el-option>
              <el-option value="GET" label="GET"> </el-option>
              <el-option value="PUT" label="PUT"> </el-option>
              <el-option value="HEAD" label="HEAD"> </el-option>
              <el-option value="DELETE" label="DELETE"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" class="mgb-5">
            <div
              class="mgt-2 tm-btn tm-btn-sm bg-green ft-13"
              :class="{
                'tm-disabled': doRequestIng,
              }"
              @click="toRequest()"
            >
              执行
            </div>

            <div
              class="mgt-2 tm-btn tm-btn-sm bg-teal-8 ft-13"
              @click="toSaveRequestRecord()"
            >
              保存请求
            </div>
            <div
              class="mgt-2 tm-btn tm-btn-sm bg-teal-8 ft-13"
              @click="toOpenRequest()"
            >
              打开其它请求
            </div>
          </el-form-item>
        </el-form>
      </tm-layout>
      <tm-layout height="300px" class="" style="overflow: hidden">
        <Editor
          ref="Editor"
          :source="source"
          :value="body"
          language="json"
          :change="bodyChange"
        ></Editor>
      </tm-layout>
      <tm-layout-bar bottom></tm-layout-bar>
      <tm-layout height="auto" v-loading="doRequestIng"> </tm-layout>
    </tm-layout>
  </div>
</template>


<script>
export default {
  components: {},
  props: [
    "source",
    "toolboxWorker",
    "extend",
    "extendId",
    "indexName",
    "indexes",
  ],
  data() {
    return {
      ready: false,
      body: null,
      doRequestIng: false,
      form: {
        url: "/_search",
        indexName: null,
        method: "POST",
      },
    };
  },
  computed: {},
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
      this.initRequestRecord();
      this.ready = true;
    },
    async initRequestRecord() {
      if (this.extendId == null) {
        return;
      }
      let param = this.toolboxWorker.getWorkParam({
        extendId: this.extendId,
      });

      let res = await this.server.toolbox.extend.get(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        if (res.data) {
          let extend = res.data.extend || {};
          this.form.indexName = extend.indexName;
          this.form.url = extend.url;
          this.form.method = extend.method;
          this.body = extend.body;
          this.$refs.Editor.setValue(this.body);
        }
      }
    },
    bodyChange(value) {
      this.body = value;
    },
    async toRequest() {
      await this.doExecuteSql();
    },
    async doRequest() {
      this.doRequestIng = true;
      let param = this.toolboxWorker.getWorkParam(Object.assign({}, this.form));

      param.body = this.body;
      let res = await this.server.database.executeSQL(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let data = res.data || {};
      this.doRequestIng = false;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.isDestroyed = true;
  },
};
</script>

<style>
</style>
