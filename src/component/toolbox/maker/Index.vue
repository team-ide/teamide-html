<template>
  <div class="toolbox-maker-editor">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout width="200px" class="">
          <Modelers
            ref="Modelers"
            :source="source"
            :toolboxWorker="toolboxWorker"
            :extend="extend"
          >
          </Modelers>
        </tm-layout>
        <tm-layout-bar right></tm-layout-bar>
        <tm-layout width="auto">
          <Tabs
            :source="source"
            :toolboxWorker="toolboxWorker"
            :extend="extend"
          >
          </Tabs>
        </tm-layout>
      </tm-layout>
    </template>
    <Base :source="source" :toolboxWorker="toolboxWorker" :extend="extend">
    </Base>
  </div>
</template>


<script>
import Modelers from "./Modelers";
import Tabs from "./Tabs";
import Base from "./Base";

export default {
  components: { Modelers, Tabs, Base },
  props: ["source", "toolboxWorker", "extend"],
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
    refresh() {
      this.$nextTick(() => {
        this.$refs.Modelers && this.$refs.Modelers.refresh();
      });
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    let param = this.toolboxWorker.getWorkParam({});
    this.server.maker.close(param);
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
