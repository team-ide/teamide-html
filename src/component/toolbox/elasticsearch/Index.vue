<template>
  <div class="toolbox-elasticsearch-editor">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout width="400px" class="">
          <Indexes
            ref="Indexes"
            :source="source"
            :toolboxWorker="toolboxWorker"
            :extend="extend"
            :indexesChange="indexesChange"
          >
          </Indexes>
        </tm-layout>
        <tm-layout-bar right></tm-layout-bar>
        <tm-layout width="auto">
          <Tabs
            :source="source"
            :toolboxWorker="toolboxWorker"
            :indexes="indexes"
          >
          </Tabs>
        </tm-layout>
      </tm-layout>
      <ReindexForm :source="source" :toolboxWorker="toolboxWorker">
      </ReindexForm>
      <DataForm :source="source" :toolboxWorker="toolboxWorker"> </DataForm>
      <MappingForm :source="source" :toolboxWorker="toolboxWorker">
      </MappingForm>
      <ShowInfo :source="source" :toolboxWorker="toolboxWorker"> </ShowInfo>
      <RequestRecords :source="source" :toolboxWorker="toolboxWorker">
      </RequestRecords>
    </template>
  </div>
</template>


<script>
import Indexes from "./Indexes";
import Tabs from "./Tabs";
import ReindexForm from "./ReindexForm";
import MappingForm from "./MappingForm";
import DataForm from "./DataForm";
import ShowInfo from "./ShowInfo";
import RequestRecords from "./RequestRecords";
export default {
  components: {
    Indexes,
    Tabs,
    ReindexForm,
    MappingForm,
    DataForm,
    ShowInfo,
    RequestRecords,
  },
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      ready: false,
      indexes: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {
      this.ready = true;
    },
    refresh() {
      this.$refs.Indexes.refresh();
    },
    indexesChange(indexes) {
      this.indexes = indexes || [];
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    let param = this.toolboxWorker.getWorkParam({});
    this.server.elasticsearch.close(param);
  },
};
</script>

<style>
.toolbox-elasticsearch-editor {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
