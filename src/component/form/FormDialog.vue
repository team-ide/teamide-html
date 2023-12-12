<template>
  <el-dialog
    ref="modal"
    :title="`${title_ || title}`"
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
    <FormBox
      style="height: 100%"
      class="pd-10"
      :source="source"
      ref="FormBox"
      :onSave="onSave"
      :saveText="saveText"
      :onSuccess="onSuccess"
      :formHeight="formHeight_"
      :checkShowPlaintextBtn="checkShowPlaintextBtn_"
    >
      <slot></slot>
    </FormBox>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: [
    "source",
    "title",
    "width",
    "wrap",
    "onSave",
    "saveText",
    "showName",
    "hideName",
    "formHeight",
  ],
  data() {
    return {
      showDialog: false,
      saveBtnDisabled: false,
      title_: null,
      formHeight_: null,
      checkShowPlaintextBtn_: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {
      if (this.tool.isNotEmpty(this.formHeight)) {
        this.formHeight_ = this.formHeight;
      } else {
        if (this.onSave != null) {
          this.formHeight_ = "calc(100% - 60px)";
        } else {
          this.formHeight_ = "100%";
        }
      }
      if (this.wrap) {
        if (this.showName) {
          this.wrap[this.showName] = this.show;
        }
        if (this.hideName) {
          this.wrap[this.hideName] = this.hide;
        }
      }
    },
    show(options) {
      this.showDialog = true;
      options = options || {};
      this.options = options;

      this.checkShowPlaintextBtn_ = options.checkShowPlaintextBtn;
      this.title_ = options.title;

      let formConfigList = [];
      let formList = options.form || [];
      if (!Array.isArray(formList)) {
        formList = [formList];
      }
      let dataList = options.data || [];
      if (!Array.isArray(dataList)) {
        dataList = [dataList];
      }
      formList.forEach((form, index) => {
        let formConfig = {};
        formConfig.form = form;
        formConfig.data = dataList[index];

        formConfigList.push(formConfig);
      });

      this.$nextTick(() => {
        this.$refs.FormBox.build(formConfigList, options);
      });
    },
    hide() {
      this.showDialog = false;
    },
    onSuccess() {
      this.hide();
    },
    onError() {},
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
</style>
