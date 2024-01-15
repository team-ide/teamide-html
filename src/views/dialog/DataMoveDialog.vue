<template>
  <el-dialog
    ref="modal"
    :title="title || '数据迁移'"
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
      <DataMove ref="DataMove" :source="source"></DataMove>
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
      title: null,
    };
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算
  computed: {},
  // 计算属性 数据变，直接会触发相应的操作
  watch: {},
  methods: {
    async show(options) {
      options = options || {};
      this.title = options.title;

      if (this.tool.isUseNewWindowOpenDialog()) {
        this.tool.newDialogWindow({
          type: "DataMove",
          title: this.title || "数据迁移",
          cacheKey: this.tool.getNumber(),
          cacheData: options,
        });
        return;
      }
      this.showDialog = true;
      this.$nextTick(() => {
        this.$refs.DataMove.setOptions(options);
      });
    },
    hide() {
      this.showDialog = false;
    },
  },
  // 在实例创建完成后被立即调用
  created() {},
  updated() {
    this.tool.showDataMove = this.show;
  },
  mounted() {
    this.tool.showDataMove = this.show;
  },
};
</script>

<style>
</style>
