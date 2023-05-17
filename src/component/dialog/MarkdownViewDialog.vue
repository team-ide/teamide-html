<template>
  <el-dialog
    ref="modal"
    :title="title || '数据'"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :show-close="true"
    :append-to-body="true"
    :visible="showDialog"
    :before-close="hide"
    width="96%"
    top="0px"
    class="markdown-view-dialog"
  >
    <div class="mgt--20">
      <article
        class="markdown-body"
        style="text-align: left"
        v-html="text"
      ></article>
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
      onSave: null,
      onCancel: null,
    };
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算
  computed: {},
  // 计算属性 数据变，直接会触发相应的操作
  watch: {},
  methods: {
    async show(data, options) {
      options = options || {};
      this.onSave = options.onSave;
      this.onCancel = options.onCancel;
      this.title = options.title;
      this.showDialog = true;
      this.$nextTick(() => {
        // let blog = marked(data);
        this.text = marked.parse(data);
      });
    },
    hide() {
      this.showDialog = false;
      this.onCancel && this.onCancel();
    },
  },
  // 在实例创建完成后被立即调用
  created() {},
  // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用
  mounted() {},
};
</script>

<style>
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  /* max-width: 980px; */
  /* padding: 45px; */
  max-width: 100%;
  margin: 0 auto;
  box-shadow: 2px 4px 6px gray;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-bottom: 0px;
}

.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 100%;
  margin: 0 auto;
  padding: 45px;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}
.markdown-view-dialog .el-dialog {
  margin-bottom: 0px;
  user-select: text;
}
</style>
