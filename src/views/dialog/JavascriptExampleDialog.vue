<template>
  <el-dialog
    ref="modal"
    :title="title || '示例代码'"
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
      <JavascriptExample :source="source"> </JavascriptExample>
    </div>
  </el-dialog>
</template>

<script>
import JavascriptExample from "./JavascriptExample";

export default {
  components: { JavascriptExample },
  props: ["source"],
  data() {
    return {
      showDialog: false,
      title: null,
    };
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算
  computed: {},
  // 计算属性 数据变，直接会触发相应的操作
  watch: {},
  methods: {
    async show() {
      if (this.tool.isUseNewWindowOpenDialog()) {
        this.tool.newDialogWindow({
          type: "JavascriptExample",
          title: this.title || "示例代码",
        });
        return;
      }
      this.showDialog = true;
    },
    hide() {
      this.showDialog = false;
    },
  },
  // 在实例创建完成后被立即调用
  created() {},
  updated() {
    this.tool.showJavascriptExample = this.show;
  },
  mounted() {
    this.tool.showJavascriptExample = this.show;
  },
};
</script>

<style>
</style>
