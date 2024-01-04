<template>
  <div class="toolbox-database-sql">
    <tm-layout height="100%">
      <tm-layout height="200px" class="">
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
              clearable
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
          <el-form-item label="Action" class="mgb-5">
            <el-select
              v-model="form.action"
              style="width: 200px"
              filterable
              allow-create
              clearable
            >
              <el-option
                v-for="(one, index) in actions"
                :key="index"
                :value="one.value"
                :label="one.text"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="格式化结果" class="mgb-5">
            <el-switch v-model="form.pretty"> </el-switch>
          </el-form-item>
          <el-form-item label="方法" class="mgb-5">
            <el-select
              v-model="form.method"
              style="width: 100px"
              filterable
              allow-create
              clearable
            >
              <el-option
                v-for="(one, index) in methods"
                :key="index"
                :value="one.value"
                :label="one.text"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="路径" class="mgb-5">
            <el-input v-model="form.path" style="width: 300px"> </el-input>
            <div
              class="mgl-10 tm-btn tm-btn-sm bg-grey ft-13"
              @click="params.push({ name: '', value: '' })"
            >
              添加参数
            </div>
          </el-form-item>
          <template v-for="(param, index) in params">
            <div :key="index">
              <el-form-item label="Name" class="mgb-5">
                <el-input v-model="param.name" style="width: 200px"> </el-input>
              </el-form-item>
              <el-form-item label="Value" class="mgb-5">
                <el-input v-model="param.value" style="width: 200px">
                </el-input>
                <div
                  class="mgl-10 tm-link color-orange"
                  @click="params.splice(params.indexOf(param), 1)"
                >
                  删除
                </div>
              </el-form-item>
            </div>
          </template>
          <el-form-item label="" class="mgb-5">
            <div
              class="tm-btn tm-btn-sm bg-green ft-13"
              :class="{
                'tm-disabled': doRequestIng,
              }"
              @click="toRequest()"
            >
              执行
            </div>

            <div
              class="tm-btn tm-btn-sm bg-teal-8 ft-13"
              @click="toSaveRequestRecord()"
            >
              保存请求
            </div>
            <div
              class="tm-btn tm-btn-sm bg-teal-8 ft-13"
              @click="toOpenRequest()"
            >
              打开其它请求
            </div>
          </el-form-item>
        </el-form>
      </tm-layout>
      <tm-layout height="200px" class="" style="overflow: hidden">
        <Editor
          ref="Editor"
          :source="source"
          :value="body"
          language="json"
          :change="bodyChange"
        ></Editor>
      </tm-layout>
      <tm-layout height="50px" class="" style="overflow: hidden">
        <div class="color-red ft-12 pdlr-10" v-if="tool.isNotEmpty(error)">
          {{ error }}
        </div>
        <template v-else>
          <div class="pd-10">
            <div
              class="tm-btn tm-btn-sm bg-teal-8 ft-13"
              @click="tool.warn('功能暂未完成，敬请期待！')"
            >
              表格展示结果
            </div>
          </div>
        </template>
      </tm-layout>
      <tm-layout-bar bottom></tm-layout-bar>
      <tm-layout height="auto" v-loading="doRequestIng">
        <Editor ref="EditorResult" :source="source" language="json"></Editor
      ></tm-layout>
    </tm-layout>
  </div>
</template>


<script>
export default {
  components: {},
  props: [
    "source",
    "toolboxWorker",
    "tabId",
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
      error: null,
      form: {
        action: "/_search",
        indexName: null,
        path: "",
        method: "POST",
        pretty: true,
      },
      params: [],
      actions: [
        { text: "/_search", value: "/_search" },
        { text: "/_doc/x", value: "/_doc/x" },
        { text: "/_sql", value: "/_sql" },
      ],
      methods: [
        { text: "POST", value: "POST" },
        { text: "GET", value: "GET" },
        { text: "PUT", value: "PUT" },
        { text: "HEAD", value: "HEAD" },
        { text: "DELETE", value: "DELETE" },
      ],
      paramNames: [
        { text: "from", value: "from" },
        { text: "size", value: "size" },
        { text: "sort", value: "sort" },
        { text: "scroll", value: "scroll" },
        { text: "_source", value: "_source" },
      ],
    };
  },
  computed: {},
  watch: {
    "form.action"() {
      this.initPath();
    },
    "form.indexName"() {
      this.initPath();
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
    initPath() {
      let path = "";
      if (this.tool.isNotEmpty(this.form.indexName)) {
        path += "/" + this.form.indexName;
      }
      if (this.tool.isNotEmpty(this.form.action)) {
        path += "/" + this.form.action;
      }
      path = path.replace(/\/+/g, "/");
      this.form.path = path;
    },
    async init() {
      this.inited = true;
      await this.initRequestRecord();
      this.ready = true;
    },
    async toSaveRequestRecord() {
      let param = this.toolboxWorker.getWorkParam({
        extendId: this.extendId,
      });
      param.extend = Object.assign({}, this.form);
      param.extend.params = this.params;
      param.extend.body = this.body;
      let res = await this.server.toolbox.extend.save(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.tool.success("保存成功");
      }
    },
    toOpenRequest() {
      this.toolboxWorker.showRequestRecords({
        indexName: this.indexName,
        onOpen: (data) => {
          this.extendId = data.extendId;
          this.toolboxWorker.updateOpenTabExtend(this.tabId, {
            extendId: this.extendId,
          });
          this.initRequestRecord();
        },
      });
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
          this.form.action = extend.action || "/_search";
          this.form.path = extend.path;
          this.form.method = extend.method || "POST";
          this.form.pretty = extend.pretty || true;
          this.params = extend.params || [];
          this.body = extend.body;
          this.$refs.Editor.setValue(this.body);
        }
      }
      this.initPath();
    },
    bodyChange(value) {
      this.body = value;
    },
    async toRequest() {
      await this.doRequest();
    },
    async doRequest() {
      this.doRequestIng = true;
      let param = this.toolboxWorker.getWorkParam(Object.assign({}, this.form));
      param.params = param.params || {};
      if (param.pretty) {
        param.params["pretty"] = ["true"];
      }
      this.params.forEach((one) => {
        if (this.tool.isNotEmpty(one.name)) {
          param.params[one.name] = [one.value];
        }
      });
      if (param.method != "GET") {
        param.body = this.body;
      }
      this.error = null;
      let res = await this.server.elasticsearch.request(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
        this.error = res.msg;
      }
      let data = res.data || {};
      this.$refs.EditorResult.setValue(data.body);
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
