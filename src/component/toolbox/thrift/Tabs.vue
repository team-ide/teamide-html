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
            >
            </Invoke>
          </template>
          <template v-else-if="item.extend.type == 'invokeReports'">
            <InvokeReports
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
              :tabId="item.tabId"
            >
            </InvokeReports>
          </template>
        </template>
      </WorkspaceSpans>
    </div>
  </div>
</template>


<script>
import Invoke from "./Invoke";
import InvokeReports from "./InvokeReports";

export default {
  components: { Invoke, InvokeReports },
  props: ["source", "toolboxWorker"],
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
