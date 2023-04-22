<template>
  <div class="toolbox-thrift-editor">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout width="400px" class="">
          <Services
            ref="Indexes"
            :source="source"
            :toolboxWorker="toolboxWorker"
            :extend="extend"
          >
          </Services>
        </tm-layout>
        <tm-layout-bar right></tm-layout-bar>
        <tm-layout width="auto">
          <Tabs :source="source" :toolboxWorker="toolboxWorker"> </Tabs>
        </tm-layout>
      </tm-layout>
    </template>
  </div>
</template>


<script>
import Services from "./Services";
import Tabs from "./Tabs";
export default {
  components: {
    Services,
    Tabs,
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
      this.$refs.Services.refresh();
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    let param = this.toolboxWorker.getWorkParam({});
    this.server.thrift.close(param);
  },
};
</script>

<style>
.toolbox-thrift-editor {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
