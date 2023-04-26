<template>
  <div class="toolbox-thrift-invoke">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout height="150px">
          <div class="pdlr-10 pdtb-5">
            文件:
            <span class="color-green pdr-10">
              {{ relativePath }}
            </span>
            服务:
            <span class="color-green pdr-10">
              {{ serviceName }}
            </span>
            方法:
            <span class="color-green pdr-10">
              {{ methodName }}
            </span>
          </div>
          <el-form class="pdt-10 pdlr-10" size="mini" inline>
            <el-form-item label="服务地址(127.0.0.1:10001)" class="mgb-5">
              <el-input v-model="serverAddress" />
            </el-form-item>
            <el-form-item label="性能测试" class="mgb-5">
              <el-switch v-model="test.open" />
            </el-form-item>
            <template v-if="test.open">
              <el-form-item label="并发线程" class="mgb-5">
                <el-input v-model="test.worker" style="width: 80px" />
              </el-form-item>
              <el-form-item label="执行时间(分钟)" class="mgb-5">
                <el-input v-model="test.duration" style="width: 80px" />
              </el-form-item>
              <el-form-item label="执行次数(优先级高于执行时间)" class="mgb-5">
                <el-input v-model="test.frequency" style="width: 80px" />
              </el-form-item>
              <el-form-item label="连接和响应超时时间(毫秒)" class="mgb-5">
                <el-input v-model="test.timeout" style="width: 80px" />
              </el-form-item>
            </template>
            <el-form-item label="" class="mgb-5">
              <div class="tm-btn tm-btn-sm bg-green-6" @click="toInvoke">
                执行
              </div>
              <div class="tm-btn tm-btn-sm bg-green-6" @click="toInvokeReports">
                测试记录
              </div>
            </el-form-item>
          </el-form>
        </tm-layout>
        <tm-layout height="300px">
          <template v-for="(argField, index) in argFields">
            <tm-layout-bar
              :key="'layout-bar-' + index"
              right
              v-if="index > 0"
            ></tm-layout-bar>
            <tm-layout
              :key="'layout-' + index"
              :width="argField.width"
              height="100%"
            >
              <div class="ft-12 pdlr-10 pdtb-5">
                参数:{{ argField.num }}:{{ argField.name }}
              </div>
              <div style="height: calc(100% - 30px)">
                <Editor
                  ref="argEditor"
                  :source="source"
                  language="json"
                  lineNumbers="off"
                ></Editor>
              </div>
            </tm-layout>
          </template>
        </tm-layout>
        <tm-layout height="120px" class="app-scroll-bar">
          <div class="pdlr-10 pdt-5">
            <div v-if="result != null" class="mgt-10 ft-12">
              <div v-if="result.start > 0">
                开始时间:
                <span class="color-green pdlr-5">
                  {{
                    tool.formatDate(
                      new Date(result.start),
                      "yyyy-MM-dd hh:mm:ss.S"
                    )
                  }}
                </span>
                结束时间:
                <span class="color-green pdlr-5">
                  {{
                    tool.formatDate(
                      new Date(result.end),
                      "yyyy-MM-dd hh:mm:ss.S"
                    )
                  }}
                </span>
                总耗时:
                <span class="color-green pdlr-5">
                  {{ tool.formatTimeStr(result.end - result.start) }}
                </span>
                <template v-if="result.writeEnd > 0 && result.readStart > 0">
                  执行耗时:
                  <span class="color-green pdlr-5">
                    {{ tool.formatTimeStr(result.readStart - result.writeEnd) }}
                  </span>
                </template>
              </div>
              <div v-if="result.writeStart > 0">
                写入开始时间:
                <span class="color-green pdlr-5">
                  {{
                    tool.formatDate(
                      new Date(result.writeStart),
                      "yyyy-MM-dd hh:mm:ss.S"
                    )
                  }}
                </span>
                写入结束时间:
                <span class="color-green pdlr-5">
                  {{
                    tool.formatDate(
                      new Date(result.writeEnd),
                      "yyyy-MM-dd hh:mm:ss.S"
                    )
                  }}
                </span>
                写入耗时:
                <span class="color-green pdlr-5">
                  {{ tool.formatTimeStr(result.writeEnd - result.writeStart) }}
                </span>
              </div>
              <div v-if="result.readStart > 0">
                读取开始时间:
                <span class="color-green pdlr-5">
                  {{
                    tool.formatDate(
                      new Date(result.readStart),
                      "yyyy-MM-dd hh:mm:ss.S"
                    )
                  }}
                </span>
                读取结束时间:
                <span class="color-green pdlr-5">
                  {{
                    tool.formatDate(
                      new Date(result.readEnd),
                      "yyyy-MM-dd hh:mm:ss.S"
                    )
                  }}
                </span>
                读取耗时:
                <span class="color-green pdlr-5">
                  {{ tool.formatTimeStr(result.readEnd - result.readStart) }}
                </span>
              </div>

              <template v-if="tool.isNotEmpty(result.error)">
                <div class="mgt-5 color-error">
                  异常: <span>{{ result.error }}</span>
                </div>
              </template>
            </div>
          </div>
        </tm-layout>
        <tm-layout-bar bottom></tm-layout-bar>
        <tm-layout height="auto">
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
      test: {
        open: false,
        worker: 10, // 并发数
        duration: 0, // 执行时长 分钟
        frequency: 10, // 任务执行次数，和执行时间互斥，只能一个生效，优先级高于执行时间
        timeout: 1000, // 超时时间
        info: null,
      },
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
          var v = one.demoData;
          if (this.tool.isNotEmpty(argData[one.name])) {
            if (typeof argData[one.name] == "string") {
              v = argData[one.name];
            }
          }
          let editor = editors[index] || editors;
          editor.setValue && editor.setValue(v);
        });
      });
    },
    async refresh() {
      let extend = this.extend || {};
      this.relativePath = extend.relativePath;
      this.serviceName = extend.serviceName;
      this.methodName = extend.methodName;
      this.serverAddress = extend.serverAddress || "127.0.0.1:10001";
      await this.loadData();

      // this.initArgForm();
    },
    toInvokeReports() {
      let extend = {
        name: this.serviceName + "." + this.methodName + "测试记录",
        title: this.serviceName + "." + this.methodName + "测试记录",
        type: "invokeReports",
        relativePath: this.relativePath,
        serviceName: this.serviceName,
        methodName: this.methodName,
      };
      this.toolboxWorker.openTabByExtend(extend);
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
      param.isTest = this.test.open;
      if (param.isTest) {
        param.worker = Number(this.test.worker);
        param.duration = Number(this.test.duration);
        param.frequency = Number(this.test.frequency);
        param.timeout = Number(this.test.timeout);
      }

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
      let argDemoDataList = res.data.argDemoDataList || [];
      let structCache = res.data.structCache || {};

      let argLength = argFields.length;
      argFields.forEach((one, index) => {
        one.demoData = argDemoDataList[index];
        if (index >= argLength - 1) {
          one.width = "auto";
        } else {
          one.width = "" + 100 / argLength + "%";
          // one.width = "200px";
        }
      });
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
