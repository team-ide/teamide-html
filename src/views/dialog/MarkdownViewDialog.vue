<template>
  <el-dialog
    ref="modal"
    :title="title || 'Markdown View'"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :show-close="true"
    :append-to-body="true"
    :visible="showDialog"
    :before-close="hide"
    :destroy-on-close="true"
    class="app-dialog"
    :fullscreen="true"
  >
    <div class="" style="height: 100%">
      <MarkdownView :source="source" :data="data"> </MarkdownView>
    </div>
  </el-dialog>
</template>

<script>
import MarkdownView from "./MarkdownView";

export default {
  components: { MarkdownView },
  props: ["source"],
  data() {
    return {
      showDialog: false,
      data: null,
      title: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async show(data, options) {
      options = options || {};
      this.title = options.title;

      if (this.tool.isUseNewWindowOpenDialog()) {
        this.tool.newDialogWindow({
          type: "MarkdownView",
          title: this.title || "Markdown View",
          cacheKey: this.tool.getNumber(),
          cacheData: data,
        });
        return;
      }

      this.showDialog = true;
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
    this.tool.showMarkdownView = this.show;
  },
  mounted() {
    this.tool.showMarkdownView = this.show;
  },
};
</script>

<style>
</style>
