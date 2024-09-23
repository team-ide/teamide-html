<template>
  <div style="height: 100%" v-if="ready">
    <tm-layout height="600px" class="pd-10">
      <el-form size="mini" @submit.native.prevent label-width="200px">
        <el-form-item class="" label="请选择操作">
          <el-radio-group v-model="syncType">
            <el-radio
              v-for="(one, index) in syncTypes"
              :key="index"
              :label="one.value"
              class="mgr-10"
              v-remove-aria-hidden
            >
              {{ one.text }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="" label="请选择数据源">
          <el-radio-group v-model="syncSource">
            <el-radio
              v-for="(one, index) in syncSources"
              :key="index"
              :label="one.value"
              :disabled="one.disabled"
              class="mgr-10"
              v-remove-aria-hidden
            >
              {{ one.text }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="isImport()" class="" label="已存在操作">
          <el-radio-group v-model="existsDo">
            <el-radio
              v-for="(one, index) in existsDos"
              :key="index"
              :label="one.value"
              :disabled="one.disabled"
              class="mgr-10"
              v-remove-aria-hidden
            >
              {{ one.text }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="加密密钥">
          <el-input v-model="key" @change="keyChange()" style="width: 300px">
          </el-input>
        </el-form-item>
        <el-form-item v-if="isImport() && syncSource == 1" label="文件路径">
          <el-input v-model="path" readonly style="width: 300px"> </el-input>
          <el-upload
            v-if="uploadReady"
            :action="source.api + 'upload'"
            :limit="1"
            :data="{ place: 'other' }"
            :headers="{ JWT: tool.getJWT() }"
            name="file"
            :on-success="onFileUpload"
            :show-file-list="false"
            style="display: inline-block; margin-left: 10px"
          >
            <div class="tm-link color-teal-8">点击上传</div>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="info != null" label="用户配置">
          <el-input
            v-model="info.userSettingSize"
            readonly
            style="width: 300px"
          >
          </el-input>
        </el-form-item>
        <el-form-item v-if="info != null" label="工具分组">
          <el-input
            v-model="info.toolboxGroupSize"
            readonly
            style="width: 300px"
          >
          </el-input>
        </el-form-item>
        <el-form-item v-if="info != null" label="工具">
          <el-input v-model="info.toolboxSize" readonly style="width: 300px">
          </el-input>
        </el-form-item>
        <el-form-item v-if="info != null" label="工具扩展">
          <el-input
            v-model="info.toolboxExtendSize"
            readonly
            style="width: 300px"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div
        class="tm-btn bg-green mgr-20"
        v-if="syncType == 1"
        @click="toExport()"
      >
        导出
      </div>
      <div
        class="tm-btn bg-green mgr-20"
        v-if="syncType == 2"
        :class="{ 'tm-disabled': info == null }"
        @click="toImport()"
      >
        导入
      </div>
    </tm-layout>
    <tm-layout height="auto"> </tm-layout>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["source", "hide", "options", "onSave"],
  data() {
    return {
      ready: false,
      syncType: 1, // 1 导出 2 导入
      syncSource: 1, // 1 文件 2 Github
      syncTypes: [
        { text: "导出", value: 1 },
        { text: "导入", value: 2 },
      ],
      syncSources: [
        { text: "文件", value: 1 },
        { text: "Github Gist", value: 2, disabled: true },
      ],
      importFile: null,
      existsDo: 1,
      existsDos: [
        { text: "忽略", value: 1 },
        { text: "覆盖", value: 2 },
      ],
      key: null,
      path: null,
      uploadReady: true,
      info: null,
      userSetting: true,
      toolbox: true,
    };
  },
  computed: {},
  watch: {
    syncType() {
      this.initData();
    },
    syncSource() {
      this.initData();
    },
    importFile() {
      this.initData();
    },
    path() {
      this.initData();
    },
  },
  methods: {
    keyChange() {
      this.initData();
    },
    async init() {
      await this.initData();
      this.ready = true;
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
      this.path = response.data.files[0].path;
    },
    async initData() {
      if (this.isExport()) {
        await this.initExportData();
      }
      if (this.isImport()) {
        await this.initImportData();
      }
    },
    async initImportData() {
      if (this.tool.isEmpty(this.path)) {
        return;
      }

      let res = await this.server.sync.checkFile({
        path: this.path,
        key: this.key,
      });
      if (res.code != 0) {
        this.tool.error(res.msg);
        return;
      }
      this.info = res.data;
    },
    async initExportData() {},
    isExport() {
      return this.syncType == 1;
    },
    isImport() {
      return this.syncType == 2;
    },
    async toExport() {
      if (this.syncSource == 1) {
        let url = this.source.api + "sync/exportFile?";
        url = this.tool.appendUrlBaseParam(url);
        url += "&key=" + encodeURIComponent(this.key || "");
        url += "&userSetting=" + this.userSetting;
        url += "&toolbox=" + this.toolbox;
        window.location.href = url;
      }
    },
    async toImport() {
      let res = await this.server.sync.importFile({
        path: this.path,
        key: this.key,
        userSetting: this.userSetting,
        toolbox: this.toolbox,
        existsDo: this.existsDo,
      });
      if (res.code != 0) {
        this.tool.error(res.msg);
        return;
      }
      this.tool.success("导入成功");
    },
  },
  created() {},
  updated() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
</style>
