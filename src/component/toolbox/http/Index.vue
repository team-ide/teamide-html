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
            :config="config"
          >
          </Package>
        </tm-layout>
        <tm-layout-bar right></tm-layout-bar>
        <tm-layout width="auto">
          <Tabs
            :source="source"
            :toolboxWorker="toolboxWorker"
            :config="config"
          >
          </Tabs>
        </tm-layout>
      </tm-layout>
    </template>
  </div>
</template>


<script>
import Package from "./Package";
import Tabs from "./Tabs";
export default {
  components: {
    Package,
    Tabs,
  },
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      ready: false,
      config: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.config = await this.load();
      this.ready = true;
    },
    refresh() {
      this.$refs.Package.refresh();
    },
    async load() {
      let param = this.toolboxWorker.getWorkParam({
        extendType: "http-config",
      });
      let res = await this.server.toolbox.extend.query(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
        return null;
      }
      let dataList = res.data || [];
      if (dataList.length > 0) {
        return dataList[0];
      } else {
        res = await this.toolboxWorker.saveExtend({
          name: "HTTP配置",
          extendType: "http-config",
        });
        if (res.code != 0) {
          this.tool.error(res.msg);
          return null;
        }
        return res.data;
      }
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
