<template>
  <div class="toolbox-redis-tabs">
    <div class="default-tabs-container">
      <WorkspaceTabs :source="source" :itemsWorker="toolboxWorker.itemsWorker">
      </WorkspaceTabs>
    </div>
    <div class="default-spans-container">
      <WorkspaceSpans :source="source" :itemsWorker="toolboxWorker.itemsWorker">
        <template v-slot:span="{ item }">
          <template v-if="item.extend.type == 'data'">
            <Data
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
            >
            </Data>
          </template>
          <template v-else-if="item.extend.type == 'datamove'">
            <DataMove
              :source="source"
              :options_="item.extend.options"
            ></DataMove>
          </template>
        </template>
      </WorkspaceSpans>
    </div>
  </div>
</template>


<script>
import Data from "./Data.vue";

export default {
  components: { Data },
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
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-redis-tabs {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
