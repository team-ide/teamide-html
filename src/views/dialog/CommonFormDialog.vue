<template>
  <div>
    <template v-for="(dialog, index) in dialogs">
      <el-dialog
        :key="index"
        :title="`${dialog.title || '表单'}`"
        :close-on-click-modal="false"
        :close-on-press-escape="true"
        :show-close="true"
        :append-to-body="true"
        :visible="dialog.showDialog"
        :before-close="dialog.remove"
        :destroy-on-close="true"
        :fullscreen="true"
        class="app-dialog"
      >
        <CommonForm
          :source="source"
          :onSave="dialog.onSave"
          :options="dialog.options"
          :onSuccess="dialog.remove"
        >
        </CommonForm>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import CommonForm from "./CommonForm";

export default {
  components: { CommonForm },
  props: ["source"],
  data() {
    return {
      dialogs: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    async listen(onSave, listenKey) {
      let res = await this.tool.electronOnListen({
        listenKey: listenKey,
      });
      if (res != null && res.data != null) {
        onSave(res.data);
      }
    },
    async show(options) {
      options = options || {};
      let onSave = options.onSave;
      delete options.onSave;
      if (this.tool.isUseNewWindowOpenDialog()) {
        let listenKeys = [];
        if (onSave != null) {
          let listenKey = "" + this.tool.getNumber();
          listenKeys.push(listenKey);
          this.listen(onSave, listenKey);
        }
        this.tool.newDialogWindow({
          type: "Form",
          title: options.title || "表单",
          cacheKey: this.tool.getNumber(),
          cacheData: options,
          listenKeys: listenKeys,
        });
        return;
      }
      let dialog = {};
      dialog.showDialog = true;
      dialog.saveText = options.saveText;
      dialog.title = options.title;
      dialog.options = options;
      dialog.onSave = onSave;

      dialog.remove = () => {
        this.remove(dialog);
      };
      this.dialogs.push(dialog);
    },

    remove(dialog) {
      dialog.showDialog = false;
      this.$nextTick(() => {
        let index = this.dialogs.indexOf(dialog);
        if (index >= 0) {
          this.dialogs.splice(index, 1);
        }
      });
    },
  },
  created() {},
  updated() {
    this.tool.showForm = this.show;
  },
  mounted() {
    this.tool.showForm = this.show;
  },
};
</script>

<style>
</style>
