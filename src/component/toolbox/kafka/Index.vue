<template>
  <div class="toolbox-kafka-editor">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout width="400px" class="">
          <Topics
            ref="Topics"
            :source="source"
            :toolboxWorker="toolboxWorker"
            :extend="extend"
          >
          </Topics>
        </tm-layout>
        <tm-layout-bar right></tm-layout-bar>
        <tm-layout width="auto">
          <Tabs :source="source" :toolboxWorker="toolboxWorker"> </Tabs>
        </tm-layout>
      </tm-layout>
    </template>
    <ShowInfo :source="source" :toolboxWorker="toolboxWorker"> </ShowInfo>
  </div>
</template>


<script>
import Topics from "./Topics";
import Tabs from "./Tabs";
import ShowInfo from "./ShowInfo";
export default {
  components: { Topics, Tabs, ShowInfo },
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
      this.$refs.Topics.refresh();
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    let param = this.toolboxWorker.getWorkParam({});
    this.server.kafka.close(param);
  },
};
</script>

<style>
.toolbox-kafka-editor {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
