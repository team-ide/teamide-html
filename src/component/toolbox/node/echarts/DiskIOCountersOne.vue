<template>
  <div class="echarts-view-disk-io-box">
    <div ref="view" style="width: 100%; height: 300px"></div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["source", "timeList", "diskStatList", "name"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    dispose() {
      if (this.$refs.view.echarts) {
        this.$refs.view.echarts.dispose();
        this.$refs.view.echarts = null;
      }
    },
    clear() {
      if (this.$refs.view.echarts) {
        this.$refs.view.echarts.clear();
      }
    },
    initView() {
      if (!this.$refs.view) {
        return;
      }
      let myChart = this.$refs.view.echarts;
      if (myChart) {
        // myChart.clear();
      } else {
        myChart = this.$echarts.init(this.$refs.view, "dark");
        this.$refs.view.echarts = myChart;
      }

      let legendData = [{ name: "读取" }, { name: "写入" }];
      let xAxisData = [];
      let rS = { name: "读取", type: "line", smooth: true, data: [] };
      let wS = { name: "写入", type: "line", smooth: true, data: [] };
      let seriesList = [rS, wS];

      let timeList = this.timeList || [];
      let list = this.diskStatList || [];

      list.forEach((one, i) => {
        let time = timeList[i];
        xAxisData.push(time);
        rS.data.push(one.readBytesSpeed);
        wS.data.push(one.writeBytesSpeed);
      });

      let option = {
        backgroundColor: "#0f1b26",
        title: {
          text: "磁盘（" + this.name + "）",
        },
        tooltip: {
          trigger: "axis",
          confine: true,
        },
        legend: {
          data: legendData,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          name: "时间",
          type: "category",
          boundaryGap: false,
          data: xAxisData,
        },
        yAxis: {
          name: "速度(M/秒)",
          type: "value",
        },
        series: seriesList,
      };
      myChart.setOption(option);
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
.echarts-view-disk-io-box {
  position: relative;
  width: 100%;
  height: 100%;
  background: #0f1b26;
}
</style>
