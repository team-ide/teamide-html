<template>
  <div class="toolbox-http-editor">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout width="300px" class="">
          <Package
            ref="Package"
            :source="source"
            :toolboxWorker="toolboxWorker"
            :extend="extend"
          >
          </Package>
        </tm-layout>
        <tm-layout-bar right></tm-layout-bar>
        <tm-layout width="auto">
          <Tabs :source="source" :toolboxWorker="toolboxWorker"> </Tabs>
        </tm-layout>
      </tm-layout>
    </template>
    <PackCreate :source="source" :toolboxWorker="toolboxWorker"> </PackCreate>
  </div>
</template>


<script>
import Package from "./Package";
import Tabs from "./Tabs";
import PackCreate from "./PackCreate";
export default {
  components: {
    Package,
    Tabs,
    PackCreate,
  },
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
      this.$refs.Package.refresh();
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    let param = this.toolboxWorker.getWorkParam({});
    this.server.http.close(param);
  },
};
</script>

<style>
.toolbox-http-editor {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
