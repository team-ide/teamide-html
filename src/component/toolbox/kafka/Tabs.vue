<template>
  <div class="toolbox-kafka-tabs">
    <div class="default-tabs-container">
      <WorkspaceTabs :source="source" :itemsWorker="toolboxWorker.itemsWorker">
      </WorkspaceTabs>
    </div>
    <div class="default-spans-container">
      <WorkspaceSpans :source="source" :itemsWorker="toolboxWorker.itemsWorker">
        <template v-slot:span="{ item }">
          <template v-if="item.extend == null"></template>
          <template v-else-if="item.extend.type == 'data'">
            <TopicData
              :source="source"
              :toolboxWorker="toolboxWorker"
              :topic="item.extend.topic"
            >
            </TopicData>
          </template>
          <template v-else-if="item.extend.type == 'groups'">
            <Groups
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
            >
            </Groups>
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
import TopicData from "./TopicData";
import Groups from "./Groups";
export default {
  components: { TopicData, Groups },
  props: ["source", "toolboxWorker"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    init() {},
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-kafka-tabs {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
