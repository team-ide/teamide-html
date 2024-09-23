<template>
  <div class="toolbox-http-invoke">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout height="60px">
          <el-form class="pdt-10 pdlr-10" inline>
            <el-form-item label="" class="mgb-0">
              <el-select v-model="method" style="width: 100px">
                <el-option
                  v-for="(one, index) in methods"
                  :key="index"
                  :value="one.value"
                  :label="one.text"
                  :disabled="one.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" class="mgb-0">
              <el-input v-model="path" style="width: 400px" />
            </el-form-item>
            <el-form-item label="" class="mgb-0">
              <div
                class="tm-btn tm-btn-smx bg-green-6"
                @click="toInvoke()"
                :class="{ 'tm-disabled': executeIng }"
              >
                请求
              </div>
              <div class="tm-btn tm-btn-smx bg-grey-6" @click="toSave()">
                保存
              </div>
            </el-form-item>
          </el-form>
        </tm-layout>
        <tm-layout height="360px">
          <div class="toolbox-http-invoke-tabs-box">
            <el-tabs v-model="requestActiveName">
              <el-tab-pane
                :label="'Params (' + params.length + ')'"
                name="params"
              >
                <div style="height: 100%">
                  <DataTable
                    :source="source"
                    :toolboxWorker="toolboxWorker"
                    :dataList="params"
                    :isForm="false"
                  >
                  </DataTable>
                </div>
              </el-tab-pane>
              <el-tab-pane
                :label="'Headers (' + headers.length + ')'"
                name="headers"
              >
                <div style="height: 100%">
                  <DataTable
                    :source="source"
                    :toolboxWorker="toolboxWorker"
                    :dataList="headers"
                    :isForm="false"
                  >
                  </DataTable>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Body" name="body">
                <div style="height: 100%">
                  <div class="pdlr-10">
                    <el-form class="mg-0 pd-0" size="mini" inline>
                      <el-form-item label="" class="mg-0 pd-0">
                        <el-radio-group v-model="bodyType" v-remove-aria-hidden>
                          <el-radio
                            v-for="(one, index) in bodyTypes"
                            :key="index"
                            :label="one.value"
                            :disabled="one.disabled"
                            class="mgr-20"
                          >
                            {{ one.text }}
                          </el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="" class="mg-0 pd-0">
                        <el-select
                          v-model="textType"
                          style="width: 100px"
                          v-if="bodyType == 'text'"
                        >
                          <el-option
                            v-for="(one, index) in textTypes"
                            :key="index"
                            :value="one.value"
                            :label="one.text"
                            :disabled="one.disabled"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div style="height: calc(100% - 28px)">
                    <template v-if="bodyType == 'form'">
                      <DataTable
                        :source="source"
                        :toolboxWorker="toolboxWorker"
                        :dataList="formData"
                        :isForm="true"
                      >
                      </DataTable>
                    </template>
                    <template v-if="bodyType == 'binary'">
                      <span
                        v-for="(one, index) in files"
                        :key="index"
                        class="mgl-10 mgr-10 ft-12"
                      >
                        <span>{{ one.name }}</span>
                        <span @click="removeOne(files, one)">
                          <Icon
                            class="mdi-close color-orange-8 mgl-10"
                            style="vertical-align: 5px"
                          ></Icon>
                        </span>
                      </span>
                      <el-upload
                        v-if="uploadReady"
                        :action="source.api + 'upload'"
                        :limit="5"
                        multiple
                        :data="{ place: 'other' }"
                        :headers="{ JWT: tool.getJWT() }"
                        name="file"
                        :on-success="onFileUpload"
                        :show-file-list="false"
                        style="display: inline-block; margin-left: 10px"
                      >
                        <div class="tm-link color-green-8">点击上传</div>
                      </el-upload>
                    </template>
                    <template v-if="bodyType == 'text'">
                      <Editor
                        v-show="textType == 'text'"
                        ref="editor-text"
                        :source="source"
                        :value="text.text"
                        language="text"
                        :change="textChangeText"
                      >
                      </Editor>
                      <Editor
                        v-show="textType == 'json'"
                        ref="editor-json"
                        :source="source"
                        :value="text.json"
                        language="json"
                        :change="textChangeJson"
                      >
                      </Editor>
                      <Editor
                        v-show="textType == 'xml'"
                        ref="editor-xml"
                        :source="source"
                        :value="text.xml"
                        language="xml"
                        :change="textChangeXml"
                      >
                      </Editor>
                    </template>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </tm-layout>
        <tm-layout-bar bottom></tm-layout-bar>
        <tm-layout height="auto" v-loading="executeIng">
          <div class="toolbox-http-invoke-tabs-box" v-if="result != null">
            <div class="ft-12 pd-10">
              <template v-if="result.requestTime">
                请求：
                <span class="color-green mgr-10">
                  {{
                    tool.formatDate(
                      new Date(result.requestTime),
                      "yyyy-MM-dd HH:mm:ss.S"
                    )
                  }}
                </span>
              </template>
              <template v-if="result.responseTime">
                响应：
                <span class="color-green mgr-10">
                  {{
                    tool.formatDate(
                      new Date(result.responseTime),
                      "yyyy-MM-dd HH:mm:ss.S"
                    )
                  }}
                </span>
                耗时：
                <span class="color-green mgr-10">
                  {{ result.responseTime - result.requestTime }}ms
                </span>
              </template>
              <template v-if="result.response.status">
                Status：
                <span class="color-green mgr-10">
                  {{ result.response.status }}
                </span>
              </template>
              <template v-if="result.response.statusCode">
                Status-Code：
                <span class="color-green mgr-10">
                  {{ result.response.statusCode }}
                </span>
              </template>
              <template v-if="result.response.contentType">
                Content-Type：
                <span class="color-green mgr-10">
                  {{ result.response.contentType }}
                </span>
              </template>
              <template v-if="result.response.contentLength > 0">
                Content-Length：
                <span class="color-green mgr-10">
                  {{ result.response.contentLength }}
                </span>
              </template>
              <template v-if="result.error">
                Error：
                <span class="color-red mgr-10">
                  {{ result.response.error }}
                </span>
              </template>
            </div>
            <div style="height: calc(100% - 60px)">
              <el-tabs v-model="resultActiveName">
                <el-tab-pane :label="'Header'" name="header">
                  <div style="height: 100%">
                    <KeyValue
                      :source="source"
                      :toolboxWorker="toolboxWorker"
                      :data="result.response.header"
                    >
                    </KeyValue>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="Body" name="body">
                  <template
                    v-if="result.response.isFile && result.response.fileName"
                  >
                    <div
                      class="mgtb-50 text-center"
                      v-if="result.response.isImage"
                    >
                      <div
                        class="tm-link color-green"
                        @click="downloadFile(result)"
                      >
                        下载文件：{{ result.response.fileName }}
                      </div>
                    </div>
                    <div class="mgtb-50 text-center" v-else>
                      <div
                        class="tm-link color-green"
                        @click="downloadFile(result)"
                      >
                        下载文件：{{ result.response.fileName }}
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="pdlr-10">
                      <el-form class="mg-0 pd-0" size="mini" inline>
                        <el-form-item label="" class="mg-0 pd-0">
                          <el-radio-group
                            v-model="responseBodyType"
                            v-remove-aria-hidden
                          >
                            <el-radio label="text" class="mgr-20">
                              文本
                            </el-radio>
                            <el-radio
                              label="format"
                              class="mgr-20"
                              :disabled="!result.response.isJson"
                            >
                              格式化
                            </el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-form>
                    </div>
                    <div style="height: calc(100% - 28px)">
                      <Editor
                        v-show="responseBodyType == 'text'"
                        :source="source"
                        :value="result.response.body"
                        :language="getResponseLanguage(result.response)"
                      >
                      </Editor>
                      <Editor
                        v-show="responseBodyType == 'format'"
                        :source="source"
                        :value="result.response.body"
                        :language="getResponseLanguage(result.response)"
                        :format="true"
                      >
                      </Editor>
                    </div>
                  </template>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </tm-layout>
      </tm-layout>
    </template>
  </div>
</template>


<script>
import DataTable from "./DataTable";
import KeyValue from "./KeyValue";

export default {
  components: { DataTable, KeyValue },
  props: ["source", "toolboxWorker", "tabId", "extend", "config"],
  data() {
    return {
      ready: false,
      requestActiveName: "params",
      method: "GET",
      name: "",
      path: "",
      methods: [
        { text: "GET", value: "GET" },
        { text: "POST", value: "POST" },
        { text: "PUT", value: "PUT" },
        { text: "DELETE", value: "DELETE" },
        { text: "PATCH", value: "PATCH" },
      ],
      bodyType: "none",
      bodyTypes: [
        { text: "空", value: "none" },
        { text: "表单(可传文件)", value: "form" },
        { text: "二进制", value: "binary" },
        { text: "text / json / xml 等", value: "text" },
      ],
      textType: "json",
      textTypes: [
        { text: "text", value: "text" },
        { text: "json", value: "json" },
        { text: "xml", value: "xml" },
      ],
      text: {
        text: "",
        json: "",
        xml: "",
      },
      responseBodyType: "text",
      files: [],
      params: [],
      formData: [],
      headers: [],
      uploadReady: true,
      resultActiveName: "body",
      result: null,
      extendId: null,
      parentId: null,
      executeIng: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      let extend = this.extend || {};
      this.extendId = extend.extendId;
      if (this.extendId != null) {
        let find = await this.toolboxWorker.getExtend(this.extendId);
        if (find) {
          find.extend = find.extend || {};
          this.name = find.name;
          for (let k in find.extend) {
            this[k] = find.extend[k];
          }
        }
      }
      if (extend.executeId != null) {
        let find = await this.server.http.getExecute(
          this.toolboxWorker.getWorkParam({
            executeId: extend.executeId,
          })
        );
        if (find && find.data && find.data.request) {
          let request = find.data.request;
          this.method = request.method;
          this.path = request.path;
          this.formData = request.formData || [];
          this.headers = request.headers || [];
          this.params = request.params || [];
          this.files = request.files || [];
          this.bodyType = request.bodyType || [];
          if (request.bodyType == "text") {
            this.text[request.textType] = request.text;
          }
          this.initResult(find.data);
          this.result = find.data;
        }
      }
      this.ready = true;
    },
    initResult(result) {
      if (result.response.isJson) {
        this.responseBodyType = "format";
      }
      if (result.response.isXml) {
        this.responseBodyType = "format";
      }
    },
    getResponseLanguage(response) {
      response = response || {};
      if (response.isJson) {
        return "json";
      }
      if (response.isXml) {
        return "xml";
      }
      if (response.isCss) {
        return "css";
      }
      if (response.isHtml) {
        return "html";
      }
      if (response.isJavascript) {
        return "javascript";
      }
      return "";
    },
    downloadFile(data) {
      let url = this.source.api + "http/getExecuteFile?";
      url = this.tool.appendUrlBaseParam(url);
      url += "&toolboxId=" + encodeURIComponent(this.toolboxWorker.toolboxId);
      url += "&executeId=" + encodeURIComponent(data.request.executeId);
      url += "&isDownload=1";
      window.location.href = url;
    },
    getFileUrl(data) {
      let url = this.source.api + "http/getExecuteFile?";
      url = this.tool.appendUrlBaseParam(url);
      url += "&toolboxId=" + encodeURIComponent(this.toolboxWorker.toolboxId);
      url += "&executeId=" + encodeURIComponent(data.request.executeId);
      return url;
    },
    removeOne(list, one) {
      let index = list.indexOf(one);
      if (index >= 0) {
        list.splice(index, 1);
      }
    },
    onFileUpload(response) {
      this.uploadReady = false;
      this.$nextTick(() => {
        this.uploadReady = true;
      });
      if (response.code != 0) {
        this.tool.error(response.msg);
        return false;
      }
      response.data.files.forEach((one) => {
        this.files.push(one);
      });
    },
    textChangeText(v) {
      this.text.text = v;
    },
    textChangeJson(v) {
      this.text.json = v;
    },
    textChangeXml(v) {
      this.text.xml = v;
    },
    getRequest() {
      let request = {};
      request.requestActiveName = this.requestActiveName;
      request.method = this.method;
      request.path = this.path;
      request.params = this.params;
      request.headers = this.headers;
      request.bodyType = this.bodyType;
      request.textType = this.textType;
      request.text = this.text;
      request.files = this.files;
      request.formData = this.formData;
      return request;
    },
    async toSave() {
      let request = this.getRequest();
      request.parentId = this.parentId;
      let res = await this.toolboxWorker.saveExtend({
        name: this.name,
        extendId: this.extendId,
        extendType: "http-api",
        extend: request,
      });
      if (res && res.data) {
        if (res.data.extendId != this.extendId) {
          this.extendId = res.data.extendId;
          let keyValueMap = {};
          keyValueMap.id = res.data.extendId;
          await this.toolboxWorker.updateOpenTabExtend(this.tabId, keyValueMap);
        }
      }
    },
    async refresh() {},
    async toInvoke() {
      let request = this.getRequest();
      delete request.result;
      delete request.requestActiveName;
      delete request.text;
      if (request.bodyType != "form") {
        delete request.formData;
      }
      if (request.bodyType != "binary") {
        delete request.files;
      }
      if (request.bodyType != "text") {
        delete request.textType;
      }
      if (request.bodyType == "text") {
        request.text = this.text[request.textType];
      }
      request.name = this.name;
      let param = this.toolboxWorker.getWorkParam(request);
      param.extendId = this.extendId;
      this.executeIng = true;
      this.result = null;
      try {
        let res = await this.server.http.execute(param);
        if (res.code != 0) {
          this.tool.error(res.msg);
        } else {
          let result = res.data;
          this.initResult(result);
          this.$nextTick(() => {
            this.toolboxWorker.addHistory(result);
            this.result = result;
          });
          this.tool.success("执行成功");
        }
      } finally {
        this.executeIng = false;
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
.toolbox-http-invoke {
  width: 100%;
  height: 100%;
}

.toolbox-http-invoke-tabs-box {
  width: 100%;
  height: 100%;
}
.toolbox-http-invoke-tabs-box .el-tabs {
  height: 100%;
}
.toolbox-http-invoke-tabs-box .el-tabs__content {
  height: calc(100% - 55px);
}
.toolbox-http-invoke-tabs-box .el-tab-pane {
  height: 100%;
}
.toolbox-http-invoke-tabs-box .el-tabs__item {
  color: darkgrey;
  padding-left: 20px !important;
}
.toolbox-http-invoke-tabs-box .el-tabs__item.is-active {
  color: inherit;
}
.toolbox-http-invoke-tabs-box .el-tabs__active-bar {
  background-color: #ffffff;
}
.toolbox-http-invoke-tabs-box .el-tabs__nav-wrap::after {
  background-color: transparent;
}

.toolbox-http-invoke-tabs-box .el-radio__label {
  padding-left: 5px;
}
</style>
