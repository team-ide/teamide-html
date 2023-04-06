<template>
  <div class="tools-page">
    <tm-layout>
      <tm-layout width="300px">
        <div class="pdlr-10">
          <div>
            <div class="tm-link color-green">时间戳</div>
          </div>
          <div>
            <div class="tm-link color-green">crontab</div>
          </div>
          <div>
            <div class="tm-link color-green">JSON</div>
          </div>
          <div>
            <div class="tm-link color-green">Yaml</div>
          </div>
          <div>
            <div class="tm-link color-green">URL编码解码</div>
          </div>
          <div>
            <div class="tm-link color-green">Base64</div>
          </div>
          <div>
            <div class="tm-link color-green">MD5</div>
          </div>
          <div>
            <div class="tm-link color-green">文件hash</div>
          </div>
          <div>
            <div class="tm-link color-green">密码生成</div>
          </div>
          <div>
            <div class="tm-link color-green">随机数</div>
          </div>
          <div>
            <div class="tm-link color-green">随机姓名</div>
          </div>
          <div>
            <div class="tm-link color-green">随机字符串</div>
          </div>
        </div>
      </tm-layout>
      <tm-layout-bar right></tm-layout-bar>
      <tm-layout width="auto">小工具 </tm-layout>
    </tm-layout>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    async init() {},
    refresh() {
      this.$nextTick(() => {});
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
}
</style>
