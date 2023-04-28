<template>
  <el-dialog
    ref="modal"
    :title="title || '数据'"
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
      <div style="height: 620px !important">
        <Editor
          ref="Editor"
          :source="source"
          :value="text"
          language="markdown"
        ></Editor>
      </div>
    </div>
    <div class="mgt-10">
      <div
        v-if="onSave != null"
        class="tm-btn bg-teal-8 ft-18 pdtb-5"
        @click="doSave"
      >
        确认
      </div>
      <div class="tm-btn bg-teal-8 ft-18 pdtb-5" @click="toView">预览</div>
    </div>
  </el-dialog>
</template>

<script>
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
        this.text = data;
        this.$refs.Editor.setValue(this.text);
      });
    },
    toView() {
      let text = this.$refs.Editor.getValue();
      this.tool.showMarkdownView(text);
    },
    hide() {
      this.showDialog = false;
      this.onCancel && this.onCancel();
    },
    doSave() {
      this.showDialog = false;
      let text = this.$refs.Editor.getValue();
      this.onSave &&
        this.onSave({
          text: text,
        });
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
