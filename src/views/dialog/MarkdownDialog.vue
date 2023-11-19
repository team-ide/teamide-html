<template>
  <el-dialog
    ref="modal"
    :title="title || '数据'"
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
    <div class="pd-10" style="height: calc(100% - 60px)">
      <div style="height: 100%">
        <Editor
          ref="Editor"
          :source="source"
          :value="text"
          language="markdown"
        ></Editor>
      </div>
    </div>
    <div class="pd-10">
      <div
        v-if="onSave != null"
        class="tm-btn bg-teal-8 ft-13 mgr-10"
        @click="doSave"
      >
        确认
      </div>
      <div class="tm-btn bg-teal-8 ft-13" @click="toView">预览</div>
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
