<template>
  <div class="toolbox-maker-tabs">
    <div class="default-tabs-container">
      <WorkspaceTabs :source="source" :itemsWorker="toolboxWorker.itemsWorker">
      </WorkspaceTabs>
    </div>
    <div class="default-spans-container">
      <WorkspaceSpans :source="source" :itemsWorker="toolboxWorker.itemsWorker">
        <template v-slot:span="{ item }">
          <template v-if="item.extend.type == 'model-editor'">
            <ModelEditor
              :source="source"
              :extend="item.extend"
              :toolboxWorker="toolboxWorker"
              :worker="worker"
            >
            </ModelEditor>
          </template>
          <template v-else-if="item.extend.type == 'datamove'">
            <DataMove :source="source" :options_="item.extend.options">
            </DataMove>
          </template>
        </template>
      </WorkspaceSpans>
    </div>
  </div>
</template>


<script>
import ModelEditor from "./ModelEditor";

export default {
  components: { ModelEditor },
  props: ["source", "toolboxWorker", "worker", "extend"],
  data() {
    return {
      ready: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {
      this.ready = true;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-maker-tabs {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
