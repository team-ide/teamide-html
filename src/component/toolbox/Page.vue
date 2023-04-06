<template>
  <div class="page-box">
    <template v-if="extend != null">
      <template v-if="extend.page == 'userCenter'">
        <UserCenter
          :source="source"
          :toolboxWorker="toolboxWorker"
          :extend="extend"
        ></UserCenter>
      </template>
      <template v-else-if="extend.page == 'log'">
        <Logger
          :source="source"
          :toolboxWorker="toolboxWorker"
          :extend="extend"
        ></Logger>
      </template>
      <template v-else-if="extend.page == 'tools'">
        <Tools
          :source="source"
          :toolboxWorker="toolboxWorker"
          :extend="extend"
        ></Tools>
      </template>
    </template>
  </div>
</template>


<script>
import UserCenter from "./user/Center";
import Logger from "./logger/Log";
import Tools from "./tools/Index";

export default {
  components: { UserCenter, Logger, Tools },
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    init() {},
    refresh() {
      this.$nextTick(() => {});
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.page-box {
  width: 100%;
  height: 100%;
}
</style>
