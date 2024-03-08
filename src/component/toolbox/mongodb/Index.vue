<template>
  <div class="toolbox-mongodb-editor">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout width="400px" class="">
          <DatabaseList
            ref="DatabaseList"
            :source="source"
            :toolboxWorker="toolboxWorker"
            :extend="extend"
          >
          </DatabaseList>
        </tm-layout>
        <tm-layout-bar right></tm-layout-bar>
        <tm-layout width="auto">
          <Tabs :source="source" :toolboxWorker="toolboxWorker"> </Tabs>
        </tm-layout>
      </tm-layout>
    </template>
    <DataForm :source="source" :toolboxWorker="toolboxWorker"> </DataForm>
  </div>
</template>


<script>
import DatabaseList from "./DatabaseList";
import DataForm from "./DataForm";

import Tabs from "./Tabs";
export default {
  components: {
    DatabaseList,
    Tabs,
    DataForm,
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
      this.$refs.DatabaseList.refresh();
    },
    async loadDatabases() {
      let param = this.toolboxWorker.getWorkParam({});
      let res = await this.server.mongodb.database.list(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || [];
      return list;
    },
    async loadCollections(databaseName) {
      let param = this.toolboxWorker.getWorkParam({
        databaseName: databaseName,
      });

      let res = await this.server.mongodb.collection.list(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || [];
      return list;
    },
  },
  created() {
    this.toolboxWorker.loadDatabases = this.loadDatabases;
    this.toolboxWorker.loadCollections = this.loadCollections;
  },
  mounted() {
    this.toolboxWorker.loadDatabases = this.loadDatabases;
    this.toolboxWorker.loadCollections = this.loadCollections;
    this.init();
  },
  beforeDestroy() {
    let param = this.toolboxWorker.getWorkParam({});
    this.server.mongodb.close(param);
  },
};
</script>

<style>
.toolbox-mongodb-editor {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
