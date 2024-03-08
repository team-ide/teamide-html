<template>
  <div class="toolbox-mongodb-tabs">
    <div class="default-tabs-container">
      <WorkspaceTabs :source="source" :itemsWorker="toolboxWorker.itemsWorker">
      </WorkspaceTabs>
    </div>
    <div class="default-spans-container">
      <WorkspaceSpans :source="source" :itemsWorker="toolboxWorker.itemsWorker">
        <template v-slot:span="{ item }">
          <template v-if="item.extend == null || item.extend.type == 'data'">
            <CollectionData
              :source="source"
              :toolboxWorker="toolboxWorker"
              :databaseName="item.extend.databaseName"
              :collectionName="item.extend.collectionName"
            >
            </CollectionData>
          </template>
          <template v-else-if="item.extend.type == 'index'">
            <CollectionIndex
              :source="source"
              :toolboxWorker="toolboxWorker"
              :databaseName="item.extend.databaseName"
              :collectionName="item.extend.collectionName"
            >
            </CollectionIndex>
          </template>
        </template>
      </WorkspaceSpans>
    </div>
  </div>
</template>


<script>
import CollectionData from "./CollectionData";
import CollectionIndex from "./CollectionIndex";

export default {
  components: { CollectionData, CollectionIndex },
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
.toolbox-mongodb-tabs {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
