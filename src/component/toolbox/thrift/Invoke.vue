<template>
  <div class="toolbox-thrift-invoke">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout height="400px" class="app-scroll-bar">
          <el-form class="pdt-10 pdlr-10" size="mini" inline>
            <el-form-item label="服务地址（127.0.0.1:10001" class="mgb-5">
              <el-input v-model="serverAddress" />
            </el-form-item>
          </el-form>
          <template v-for="(argField, index) in argFields">
            <div :key="'arg-' + index" class="ft-12 pd-10">
              参数：{{ argField.num }}:{{ argField.name }}
            </div>
            <div :key="'editor-' + index" style="height: 200px">
              <Editor ref="argEditor" :source="source" language="json"></Editor>
            </div>
          </template>
        </tm-layout>
        <tm-layout height="40px">
          <div class="pdlr-10">
            <div class="tm-btn tm-btn-sm bg-green-6" @click="toInvoke">
              执行
            </div>
          </div>
        </tm-layout>
        <tm-layout height="auto" class="app-scroll-bar">
          <Editor ref="resultEditor" :source="source" language="json"></Editor>
        </tm-layout>
      </tm-layout>
    </template>
  </div>
</template>


<script>
import { append } from "@antv/x6/lib/util/dom/elem";
export default {
  components: {},
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      ready: false,
      relativePath: null,
      serviceName: null,
      methodName: null,
      argFields: null,
      structCache: null,
      argForm: null,
      serverAddress: "127.0.0.1:10001",
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      await this.refresh();
      this.ready = true;
    },
    async refresh() {
      let extend = this.extend || {};
      this.relativePath = extend.relativePath;
      this.serviceName = extend.serviceName;
      this.methodName = extend.methodName;
      await this.loadData();
      // this.initArgForm();
    },
    initArgForm() {
      let argForm = {
        fields: [],
      };
      let argFields = this.argFields || [];
      argFields.forEach((one) => {
        let field = this.getFieldByModel(one);
        argForm.fields.push(field);
      });

      this.argForm = argForm;
    },
    getFieldByModel(model) {
      let field = Object.assign({}, model);
      if (this.tool.isNotEmpty(field.structName)) {
        let structForm = this.getStructFormByModel(
          field.structInclude,
          field.structName
        );
        field.structForm = structForm;
      }
      field.num = model.num;
    },
    getStructFormByModel(structInclude, structName) {},
    async toInvoke() {
      let argFields = this.argFields || [];
      let editors = this.$refs.argEditor;
      var args = [];
      argFields.forEach((one, index) => {
        let editor = editors[index] || editors;
        let v = editor.getValue();
        if (this.tool.isNotEmpty(v)) {
          let json = this.tool.stringToJSON(v);
          if (json != null) {
            v = json;
          }
        } else {
          v = null;
        }
        args.push(v);
      });
      let param = this.toolboxWorker.getWorkParam({
        relativePath: this.relativePath,
        serviceName: this.serviceName,
        methodName: this.methodName,
        args: args,
        serverAddress: this.serverAddress,
      });

      let res = await this.server.thrift.invokeByServerAddress(param);
      let out = res.data;
      if (res.code != 0) {
        out = res.msg;
        this.tool.error(res.msg);
      }
      if (this.$refs.resultEditor) {
        if (typeof out == "object") {
          out = JSON.stringify(out);
        }
        this.$refs.resultEditor.setValue(out);
      }
    },
    async loadData() {
      let param = this.toolboxWorker.getWorkParam({
        relativePath: this.relativePath,
        serviceName: this.serviceName,
        methodName: this.methodName,
      });

      let res = await this.server.thrift.getMethodArgFields(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      res.data = res.data || {};
      let argFields = res.data.argFields || [];
      let structCache = res.data.structCache || {};

      this.argFields = argFields;
      this.structCache = structCache;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-thrift-invoke {
  width: 100%;
  height: 100%;
}
</style>
