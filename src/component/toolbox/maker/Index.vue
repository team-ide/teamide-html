<template>
  <div class="toolbox-maker-editor">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout width="280px" class="">
          <Modelers
            ref="Modelers"
            :source="source"
            :toolboxWorker="toolboxWorker"
            :extend="extend"
            :worker="worker"
          >
          </Modelers>
        </tm-layout>
        <tm-layout-bar right></tm-layout-bar>
        <tm-layout width="auto">
          <Tabs
            :source="source"
            :toolboxWorker="toolboxWorker"
            :extend="extend"
            :worker="worker"
          >
          </Tabs>
        </tm-layout>
      </tm-layout>
    </template>
  </div>
</template>


<script>
import _worker from "./worker.js";

import Modelers from "./Modelers";
import Tabs from "./Tabs";

export default {
  components: { Modelers, Tabs },
  props: ["source", "toolboxWorker", "extend"],
  data() {
    let worker = _worker.newWorker({
      toolboxWorker: this.toolboxWorker,
    });
    return {
      worker,
      ready: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      await this.worker.build();
      this.ready = true;
    },
    async refresh() {
      await this.worker.build();
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.worker.close();
  },
};
</script>

<style>
.toolbox-maker-editor {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
