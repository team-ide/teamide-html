<template>
  <el-dialog
    ref="modal"
    :title="`确认粘贴`"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :show-close="true"
    :append-to-body="true"
    :visible="showDialog"
    :before-close="hide"
    width="96%"
    top="40px"
  >
    <div>
      <div style="height: 620px !important">
        <Editor ref="Editor" :source="source" value="" language="html"></Editor>
      </div>
    </div>
    <div class="pdt-20">
      <div class="tm-btn bg-green ft-13 mgr-10" @click="doConfirm">确认</div>
      <div class="tm-btn bg-grey ft-13" @click="hide">取消</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: ["source", "toolboxWorker"],
  data() {
    return {
      showDialog: false,
      text: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    show(text, confirm, cancel) {
      this.text = text;
      this.confirm = confirm;
      this.cancel = cancel;
      this.showDialog = true;
      this.$nextTick(() => {
        this.$refs.Editor.setValue(this.text);
      });
    },
    doConfirm() {
      this.showDialog = false;
      let txt = this.$refs.Editor.getValue();
      this.confirm && this.confirm(txt);
    },
    doCancel() {
      this.hide();
    },
    hide() {
      this.showDialog = false;
      this.cancel && this.cancel();
    },
  },
  created() {},
  mounted() {
    this.toolboxWorker.showConfirmPaste = this.show;
    this.toolboxWorker.hideConfirmPaste = this.show;
  },
};
</script>

<style>
</style>
