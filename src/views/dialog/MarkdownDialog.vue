<template>
  <el-dialog
    ref="modal"
    :title="title || 'Markdown Editor'"
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
    <div class="" style="height: 100%">
      <Markdown :source="source" :data="data"> </Markdown>
    </div>
  </el-dialog>
</template>

<script>
import Markdown from "./Markdown";

export default {
  components: { Markdown },
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
          type: "Markdown",
          title: this.title || "Markdown Editor",
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
    this.tool.showMarkdown = this.show;
  },
  mounted() {
    this.tool.showMarkdown = this.show;
  },
};
</script>

<style>
</style>
