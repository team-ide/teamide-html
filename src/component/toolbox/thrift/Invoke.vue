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
        <tm-layout height="120px">
          <div class="pdlr-10">
            <div class="tm-btn tm-btn-sm bg-green-6" @click="toInvoke">
              执行
            </div>
            <div v-if="result != null" class="mgt-10 ft-12">
              <div v-if="result.start > 0">
                开始时间：
                <span class="color-green pdlr-5">
                  {{
                    tool.formatDate(
                      new Date(result.start),
                      "yyyy-MM-dd hh:mm:ss.S"
                    )
                  }}
                </span>
                结束时间：
                <span class="color-green pdlr-5">
                  {{
                    tool.formatDate(
                      new Date(result.end),
                      "yyyy-MM-dd hh:mm:ss.S"
                    )
                  }}
                </span>
                总耗时：
                <span class="color-green pdlr-5">
                  {{ tool.formatTimeStr(result.end - result.start) }}
                </span>
                <template v-if="result.writeEnd > 0 && result.readStart > 0">
                  执行耗时：
                  <span class="color-green pdlr-5">
                    {{ tool.formatTimeStr(result.readStart - result.writeEnd) }}
                  </span>
                </template>
              </div>
              <div v-if="result.writeStart > 0">
                写入开始时间：
                <span class="color-green pdlr-5">
                  {{
                    tool.formatDate(
                      new Date(result.writeStart),
                      "yyyy-MM-dd hh:mm:ss.S"
                    )
                  }}
                </span>
                写入结束时间：
                <span class="color-green pdlr-5">
                  {{
                    tool.formatDate(
                      new Date(result.writeEnd),
                      "yyyy-MM-dd hh:mm:ss.S"
                    )
                  }}
                </span>
                写入耗时：
                <span class="color-green pdlr-5">
                  {{ tool.formatTimeStr(result.writeEnd - result.writeStart) }}
                </span>
              </div>
              <div v-if="result.readStart > 0">
                读取开始时间：
                <span class="color-green pdlr-5">
                  {{
                    tool.formatDate(
                      new Date(result.readStart),
                      "yyyy-MM-dd hh:mm:ss.S"
                    )
                  }}
                </span>
                读取结束时间：
                <span class="color-green pdlr-5">
                  {{
                    tool.formatDate(
                      new Date(result.readEnd),
                      "yyyy-MM-dd hh:mm:ss.S"
                    )
                  }}
                </span>
                读取耗时：
                <span class="color-green pdlr-5">
                  {{ tool.formatTimeStr(result.readEnd - result.readStart) }}
                </span>
              </div>

              <template v-if="tool.isNotEmpty(result.error)">
                <div class="mgt-5 color-error">
                  异常： <span>{{ result.error }}</span>
                </div>
              </template>
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
export default {
  components: {},
  props: ["source", "toolboxWorker", "extend", "tabId"],
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
      result: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      await this.refresh();
      this.ready = true;

      let extend = this.extend || {};
      let argData = extend.argData || {};
      let argFields = this.argFields || [];
      this.$nextTick(() => {
        let editors = this.$refs.argEditor;
        argFields.forEach((one, index) => {
          if (typeof argData[one.name] == "string") {
            let v = argData[one.name] || "";
            let editor = editors[index] || editors;
            editor.setValue && editor.setValue(v);
          }
        });
      });
    },
    async refresh() {
      let extend = this.extend || {};
      this.relativePath = extend.relativePath;
      this.serviceName = extend.serviceName;
      this.methodName = extend.methodName;
      this.serverAddress = extend.serverAddress;
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
      let argData = {};
      argFields.forEach((one, index) => {
        let editor = editors[index] || editors;
        let v = editor.getValue();
        argData[one.name] = v;
        args.push(v);
      });
      this.saveExtend(argData);
      let param = this.toolboxWorker.getWorkParam({
        relativePath: this.relativePath,
        serviceName: this.serviceName,
        methodName: this.methodName,
        args: args,
        serverAddress: this.serverAddress,
      });

      let res = await this.server.thrift.invokeByServerAddress(param);
      let result = res.data || {};
      result.error = null;
      if (res.code != 0) {
        result.error = res.msg;
        this.tool.error(res.msg);
      }
      this.result = result;
      if (this.$refs.resultEditor) {
        if (typeof result.result == "object") {
          result.result = JSON.stringify(result.result);
        }
        this.$refs.resultEditor.setValue(result.result);
      }
    },
    async saveExtend(argData) {
      let keyValueMap = {};
      keyValueMap.serverAddress = this.serverAddress;
      keyValueMap.argData = argData;
      await this.toolboxWorker.updateOpenTabExtend(this.tabId, keyValueMap);
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
