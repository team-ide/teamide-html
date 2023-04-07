<template>
  <div class="tools-page">
    <tm-layout>
      <tm-layout width="200px">
        <div class="pdlr-10">
          <template v-for="(one, index) in tools">
            <div :key="index" class="pdtb-5">
              <div
                class="tm-link color-green"
                :class="{ 'tm-disabled': one.disable }"
                @click="toOpenTab(one)"
              >
                {{ one.text }}
              </div>
            </div>
          </template>
        </div>
      </tm-layout>
      <tm-layout-bar right></tm-layout-bar>
      <tm-layout width="auto">
        <Tabs :source="source" :toolboxWorker="toolboxWorker"> </Tabs>
      </tm-layout>
    </tm-layout>
  </div>
</template>


<script>
import Tabs from "./Tabs";

export default {
  components: { Tabs },
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      tools: [
        { type: "json", text: "JSON", disable: false },
        { type: "timestamp", text: "时间戳", disable: false },
        { type: "crontab", text: "Crontab", disable: true },
        { type: "yaml", text: "Yaml", disable: true },
        { type: "urlEncode", text: "URL编码解码", disable: true },
        { type: "base64", text: "Base64", disable: true },
        { type: "md5", text: "MD5", disable: true },
        { type: "filehash", text: "文件hash", disable: true },
        { type: "randomNumber", text: "随机数", disable: true },
        { type: "randomString", text: "随机字符串", disable: true },
        { type: "generatePassword", text: "生成密码", disable: true },
      ],
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {},
    refresh() {
      this.$nextTick(() => {});
    },
    toOpenTab(options) {
      let extend = {
        name: options.text,
        title: options.text,
        type: options.type,
        onlyOpenOneKey: "tools:type:" + options.type,
      };
      Object.assign(extend, options);
      this.toolboxWorker.openTabByExtend(extend);
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.tools-page {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
