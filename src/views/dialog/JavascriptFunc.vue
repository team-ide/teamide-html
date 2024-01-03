<template>
  <div style="height: 100%">
    <Editor
      ref="Editor"
      :source="source"
      language="markdown"
      lineNumbers="off"
    ></Editor>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["source"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      await this.initJavascriptFunc();
      this.$nextTick(() => {
        this.initText();
      });
    },
    initText() {
      let text = "\n\n";
      text += "# 内置 基础表达式 \n\n";

      text += "### 表达式 \n\n";
      text += "* xx \n";
      text += "  * 获取 `xx` 的值";

      text += "\n";
      this.modules.forEach((one) => {
        // if (one.name != "util") {
        //   return;
        // }
        text += "\n";
        text += "### " + one.comment + " \n\n";

        one.funcList = one.funcList || [];
        one.funcList.forEach((func) => {
          text += "* `" + one.name + "." + func.name + "` \n\n";
          text +=
            "  * " +
            func.comment.replace(/(\r\n|\n|\r|↵)/g, `\r\n  * `) +
            " \n";
          text += "\n";
        });
        if (one.service != null && one.service.funcList) {
          text +=
            "### 使用 `" + one.name + ".newService` 新建服务对象 函数 \n\n";
          one.service.funcList.forEach((func) => {
            text += "* `" + one.service.name + "." + func.name + "` \n\n";
            text +=
              "  * " +
              func.comment.replace(/(\r\n|\n|\r|↵)/g, `\r\n  * `) +
              " \n";
            text += "\n";
          });
        }
      });
      this.$refs.Editor.setValue(text);
    },
    async initJavascriptFunc() {
      let res = await this.server.javascript.getModules();
      this.modules = res.data || [];
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
