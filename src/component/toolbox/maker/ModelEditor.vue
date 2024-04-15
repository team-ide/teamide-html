<template>
  <div class="toolbox-maker-model-editor" v-if="ready">
    <tm-layout height="100%">
      <tm-layout height="100px">
        <div class="pdlr-10 pdt-10">
          <div class="tm-btn tm-btn-xs bg-grey-6" @click="refresh()">
            重新加载
          </div>
          <div class="tm-btn tm-btn-xs bg-green" @click="save()">保存</div>
        </div>
      </tm-layout>
      <tm-layout height="auto">
        <template v-if="this.modelType == 'constant'"></template>
      </tm-layout>
    </tm-layout>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "extend", "worker"],
  data() {
    return {
      ready: false,
      modelType: null,
      modelName: null,
      model: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      if (this.extend) {
        this.modelType = this.extend.modelType;
        this.modelName = this.extend.modelName;
      }
      if (
        this.tool.isEmpty(this.modelType) ||
        this.tool.isEmpty(this.modelName)
      ) {
        this.tool.warn("参数丢失，请重新打开");
        return;
      }
      let model = await this.worker.get(this.modelType, this.modelName);
      if (model == null) {
        this.tool.warn("数据丢失，请重新打开");
        return;
      }
      model.name = this.modelName;
      this.model = model;
      this.ready = true;
    },
    refresh() {
      this.ready = false;
      this.$nextTick(() => {
        this.init();
      });
    },
    async save() {
      let model = this.model;
      await this.worker.save(this.modelType, this.modelName, model);
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-maker-model-editor {
  width: 100%;
  height: 100%;
  position: relative;
}
.toolbox-maker-model-editor-header {
  height: 100px;
  position: relative;
}
.toolbox-maker-model-editor-body {
  height: 100px;
  position: relative;
}
</style>
