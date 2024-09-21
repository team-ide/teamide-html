<template>
  <div class="toolbox-thrift-tabs">
    <div class="default-tabs-container">
      <WorkspaceTabs :source="source" :itemsWorker="toolboxWorker.itemsWorker">
      </WorkspaceTabs>
    </div>
    <div class="default-spans-container">
      <WorkspaceSpans :source="source" :itemsWorker="toolboxWorker.itemsWorker">
        <template v-slot:span="{ item }">
          <template v-if="item.extend == null"> </template>
          <template v-else-if="item.extend.type == 'invoke'">
            <Invoke
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
              :tabId="item.tabId"
              :config="config"
            >
            </Invoke>
          </template>
          <template v-else-if="item.extend.type == 'config'">
            <Config
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
              :tabId="item.tabId"
              :config="config"
            >
            </Config>
          </template>
        </template>
      </WorkspaceSpans>
    </div>
  </div>
</template>


<script>
import Invoke from "./Invoke";
import Config from "./Config";

export default {
  components: { Invoke, Config },
  props: ["source", "toolboxWorker", "config"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    init() {},
    refresh() {},
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-thrift-tabs {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
