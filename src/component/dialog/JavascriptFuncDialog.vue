<template>
  <el-dialog
    ref="modal"
    :title="title || '表达式'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    :append-to-body="true"
    :visible="showDialog"
    :before-close="hide"
    width="1200px"
    top="40px"
  >
    <div class="mgt--20">
      <div style="height: 720px !important">
        <Editor
          ref="Editor"
          :source="source"
          :value="text"
          language="markdown"
        ></Editor>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import marked from "marked";

export default {
  components: {},
  props: ["source"],
  data() {
    return {
      showDialog: false,
      text: null,
      title: null,
    };
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算
  computed: {},
  // 计算属性 数据变，直接会触发相应的操作
  watch: {},
  methods: {
    async show() {
      this.showDialog = true;
      await this.initJavascriptFunc();
      this.$nextTick(() => {
        this.initText();
      });
    },
    hide() {
      this.showDialog = false;
    },
    initText() {
      let text = "";
      text += "# 内置 基础表达式 \n\n";

      text += "### 表达式 \n\n";
      text += "* ${xx} \n";
      text += "  * 获取 `xx` 的值";

      text += "\n";
      this.modules.forEach((one) => {
        if (one.name != "util") {
          return;
        }
        text += "### " + one.comment + " \n\n";

        one.funcList = one.funcList || [];
        one.funcList.forEach((func) => {
          text += "* `" + one.name + "." + func.name + "` \n\n";
          text += "  * 说明：" + func.comment + " \n";
          text += "\n";
        });
      });
      this.text = text;
      this.$refs.Editor.setValue(this.text);
    },
    async initJavascriptFunc() {
      let res = await this.server.javascript.getModules();
      this.modules = res.data || [];
    },
  },
  // 在实例创建完成后被立即调用
  created() {},
  // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用
  mounted() {},
};
</script>

<style>
</style>
