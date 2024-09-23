<template>
  <el-dialog
    ref="modal"
    :title="title || '配置同步'"
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
    <div style="height: 100%">
      <Sync :source="source" :hide="hide" :options="options" :onSave="onSave">
      </Sync>
    </div>
  </el-dialog>
</template>

<script>
import Sync from "./Sync";

export default {
  components: { Sync },
  props: ["source"],
  data() {
    return {
      showDialog: false,
      title: null,
      onSave: null,
      options: null,
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
        onSave(this.tool.JSONbig.parse(res.data));
      }
    },
    async show(options) {
      options = options || {};
      this.options = options;
      this.title = options.title;
      let onSave = options.onSave;
      delete options.onSave;
      this.onSave = null;
      if (this.tool.isUseNewWindowOpenDialog()) {
        let listenKeys = [];

        if (onSave != null) {
          let listenKey = "" + this.tool.getNumber();
          listenKeys.push(listenKey);
          this.listen(onSave, listenKey);
        }
        this.tool.newDialogWindow({
          type: "Sync",
          title: this.title || "同步配置",
          cacheKey: this.tool.getNumber(),
          cacheData: options,
          listenKeys: listenKeys,
        });
        return;
      }

      this.showDialog = true;
      if (onSave) {
        this.onSave = (arg) => {
          this.hide();
          onSave(arg);
        };
      }
    },
    hide() {
      this.showDialog = false;
    },
  },
  created() {},
  updated() {
    this.tool.showSync = this.show;
  },
  mounted() {
    this.tool.showSync = this.show;
  },
};
</script>

<style>
</style>
