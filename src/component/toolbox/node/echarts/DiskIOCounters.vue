<template>
  <div class="echarts-view-disk-io-list-box">
    <template v-for="(one, index) in diskList">
      <DiskIOCountersOne
        :key="index"
        ref="view"
        :source="source"
        :timeList="timeList"
        :name="one.name"
        :diskStatList="one.diskStatList"
      ></DiskIOCountersOne>
    </template>
  </div>
</template>

<script>
import DiskIOCountersOne from "./DiskIOCountersOne.vue";

export default {
  components: { DiskIOCountersOne },
  props: ["source", "timeList", "diskIOCountersStatsList"],
  data() {
    return {
      diskList: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    dispose() {
      let list = this.$refs.view || [];
      list.forEach((one) => {
        one.dispose && one.dispose();
      });
    },
    clear() {
      let list = this.$refs.view || [];
      list.forEach((one) => {
        one.clear && one.clear();
      });
    },
    toInitView() {
      let list = this.$refs.view || [];
      list.forEach((one) => {
        one.initView && one.initView();
      });
    },
    initView() {
      let list = this.diskIOCountersStatsList || [];
      let diskList = [];
      let diskMap = {};
      list.forEach((diskS) => {
        diskS.forEach((one) => {
          let find = diskMap[one.name];
          if (find == null) {
            find = {
              name: one.name,
              diskStatList: [],
            };
            diskMap[one.name] = find;
            diskList.push(find);
          }
          find.diskStatList.push({
            readBytesSpeed: one.readBytesSpeed,
            writeBytesSpeed: one.writeBytesSpeed,
          });
        });
      });
      this.diskList = diskList;
      this.$nextTick(() => {
        this.toInitView();
      });
    },
    init() {},
  },
  created() {},
  updated() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.dispose();
  },
};
</script>

<style>
.echarts-view-disk-io-list-box {
  position: relative;
  width: 100%;
  height: 100%;
  background: #0f1b26;
}
</style>
