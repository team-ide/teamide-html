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
        { type: "yaml", text: "Yaml", disable: false },
        { type: "timestamp", text: "时间戳", disable: false },
        { type: "QRCode", text: "二维码", disable: false },
        { type: "javascript", text: "Javascript在线运行", disable: false },
        { type: "crontab", text: "Crontab", disable: true },
        { type: "urlEncode", text: "URL编码解码", disable: false },
        { type: "base64", text: "Base64", disable: false },
        { type: "md5", text: "MD5", disable: false },
        { type: "fileSearch", text: "文件搜索", disable: false },
        { type: "randomString", text: "随机字符串", disable: false },
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
        // onlyOpenOneKey: "tools:type:" + options.type,
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
