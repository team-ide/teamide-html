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
    <div class="pd-10" style="height: 100%">
      <JSONData :source="source" :data="data" :onSave="onSave"> </JSONData>
    </div>
  </el-dialog>
</template>

<script>
import JSONData from "./JSONData";

export default {
  components: { JSONData },
  props: ["source"],
  data() {
    return {
      showDialog: false,
      title: null,
      onSave: null,
      data: null,
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
    async show(data, options) {
      options = options || {};
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
          type: "JSONData",
          title: this.title || "数据",
          cacheKey: this.tool.getNumber(),
          cacheData: data,
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
      this.$nextTick(() => {
        this.data = data;
      });
    },
    hide() {
      this.showDialog = false;
    },
  },
  created() {},
  updated() {
    this.tool.showJSONData = this.show;
  },
  mounted() {
    this.tool.showJSONData = this.show;
  },
};
</script>

<style>
</style>
