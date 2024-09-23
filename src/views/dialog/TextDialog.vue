<template>
  <el-dialog
    ref="modal"
    :title="title || '文案'"
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
          language="html"
        ></Editor>
      </div>
    </div>
    <div class="pd-10">
      <div
        v-if="onSave != null"
        class="tm-btn bg-teal-8 ft-13 mgr-10"
        @click="doSave"
      >
        {{ saveText || "保存" }}
      </div>
      <div class="tm-btn bg-grey ft-13" @click="hide">关闭</div>
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
      saveText: null,
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
      this.saveText = options.saveText;
      this.showDialog = true;
      this.$nextTick(() => {
        this.text = "";
        if (data != null) {
          try {
            if (typeof data == "string") {
              if (data != "") {
                try {
                  let json = this.tool.JSONbig.parse(data);
                  this.text = this.tool.JSONbig.stringify(json, null, "    ");
                } catch (e) {
                  this.text = data;
                }
              }
            } else {
              this.text = this.tool.JSONbig.stringify(data, null, "    ");
            }
          } catch (e) {
            this.text = e.toString();
          }
        }
        this.$refs.Editor.setValue(this.text);
      });
    },
    hide() {
      this.showDialog = false;
      this.onCancel && this.onCancel();
    },
    doSave() {
      this.showDialog = false;
      let text = this.$refs.Editor.getValue();
      var jsonData = null;
      var jsonError = null;
      try {
        jsonData = this.tool.JSONbig.parse(text);
      } catch (e) {
        jsonError = e.toString();
      }
      this.onSave &&
        this.onSave({
          text: text,
          jsonData: jsonData,
          jsonError: jsonError,
        });
    },
  },
  // 在实例创建完成后被立即调用
  created() {},
  updated() {
    this.tool.showText = this.show;
  },
  mounted() {
    this.tool.showText = this.show;
  },
};
</script>

<style>
</style>
