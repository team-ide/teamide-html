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
      <template v-else-if="extend.page == 'setting'">
        <Setting
          :source="source"
          :toolboxWorker="toolboxWorker"
          :extend="extend"
        ></Setting>
      </template>
      <template v-else-if="extend.page == 'userSetting'">
        <UserSetting
          :source="source"
          :toolboxWorker="toolboxWorker"
          :extend="extend"
        ></UserSetting>
      </template>
      <template v-else-if="extend.page == 'datamove'">
        <DataMove :source="source" :options_="extend.options"></DataMove>
      </template>
    </template>
  </div>
</template>


<script>
import UserCenter from "./user/Center";
import UserSetting from "./user/Setting";
import Logger from "./logger/Log";
import Tools from "./tools/Index";
import Setting from "./setting/Index";

export default {
  components: { UserCenter, Logger, Tools, Setting, UserSetting },
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
