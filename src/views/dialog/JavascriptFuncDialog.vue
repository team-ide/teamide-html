<template>
  <el-dialog
    ref="modal"
    :title="title || '表达式|内置函数等'"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :show-close="true"
    :append-to-body="true"
    :visible="showDialog"
    :before-close="hide"
    :destroy-on-close="true"
    :fullscreen="true"
    class="app-dialog"
  >
    <div class="pd-10" style="height: 100%">
      <JavascriptFunc :source="source"> </JavascriptFunc>
    </div>
  </el-dialog>
</template>

<script>
import JavascriptFunc from "./JavascriptFunc";

export default {
  components: { JavascriptFunc },
  props: ["source"],
  data() {
    return {
      showDialog: false,
      title: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async show() {
      if (this.tool.isUseNewWindowOpenDialog()) {
        this.tool.newDialogWindow({
          type: "JavascriptFunc",
          title: this.title || "表达式|内置函数等",
        });
        return;
      }
      this.showDialog = true;
    },
    hide() {
      this.showDialog = false;
    },
  },
  created() {},
  updated() {
    this.tool.showJavascriptFunc = this.show;
  },
  mounted() {
    this.tool.showJavascriptFunc = this.show;
  },
};
</script>

<style>
</style>
