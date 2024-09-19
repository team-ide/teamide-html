<template>
  <div style="width: 100%; height: 100%">
    <div
      class="report-endpoint-minute-echart"
      style="width: 100%; height: 100%"
      ref="report-endpoint-minute-echart"
    ></div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["dataList", "report", "options", "dataListVersion"],
  data() {
    return {};
  },
  watch: {
    dataListVersion() {
      this.initView();
    },
  },
  methods: {
    init() {
      this.initView();
    },
    initView() {
      let list = this.dataList || [];
      this.initReportEndpointMinuteEchart(list);
    },
    initReportEndpointMinuteEchart(list) {
      let echartKey = "report-endpoint-minute-echart";
      let $el = this.$refs[echartKey];
      if (this[echartKey] == null) {
        this[echartKey] = this.$echarts.init($el);
      } else {
        this[echartKey].clear();
      }
      let echart = this[echartKey];
      echart.getZr().off("click");
      echart.getZr().on("click", (params) => {
        var pointInPixel = [params.offsetX, params.offsetY];
        // 判断给定的点是否在指定的坐标系
        if (echart.containPixel("grid", pointInPixel)) {
          const xIndex = echart.convertFromPixel({ seriesIndex: 0 }, [
            params.offsetX,
            params.offsetY,
          ])[0];
          const find = xDataList[xIndex];
          if (!find) {
            return;
          }
          // this.tool.showTraceList({
          //   serviceName: this.reportEndpoint.serviceName,
          //   endpointName: this.reportEndpoint.endpointName,
          //   segmentIds: find.topSegmentIds,
          //   segments: find.topSegments,
          // });
        }
      });

      let series = [];
      let seriesMap = {};
      let xAxisData = [];
      let xDataList = [];
      let legendData = [];
      let keys = [
        { key: "count", text: "总次数" },
        // { key: "errorCount", text: "异常数" },
        { key: "tps", text: "TPS" },
        { key: "avg", text: "Avg" },
        { key: "min", text: "Min" },
        { key: "max", text: "Max" },
        { key: "t50", text: "T50" },
        { key: "t90", text: "T90" },
        { key: "t99", text: "T99" },
      ];
      keys.forEach((one) => {
        let sery = {
          name: one.text,
          key: one.key,
          type: "line",
          smooth: true,
          // stack: "Total",
          data: [],
          dataMinuteMap: {},
        };
        legendData.push(sery.name);
        seriesMap[one.key] = sery;
        series.push(sery);
      });
      list.forEach((one) => {
        let dataMinute = this.tool.formatDate(
          new Date(one.startTime / 1000000),
          "hh:mm:ss"
        );
        keys.forEach((key) => {
          let sery = seriesMap[key.key];
          if (xAxisData.indexOf(dataMinute) < 0) {
            xAxisData.push(dataMinute);
            xDataList.push(one);
          }
          sery.dataMinuteMap[dataMinute] = one;
        });
      });
      xAxisData.forEach((dataMinute) => {
        series.forEach((sery) => {
          let find = sery.dataMinuteMap[dataMinute];
          let value = 0;
          if (find) {
            value = find[sery.key];
          }
          value = Number(value).toFixed(1);
          sery.data.push(value);
        });
      });
      let showLegend = true;
      let showToolbox = true;
      if (this.options) {
        if (this.options.showLegend != null) {
          showLegend = this.options.showLegend;
        }
        if (this.options.showToolbox != null) {
          showToolbox = this.options.showToolbox;
        }
      }

      let option = {
        title: {
          text: "",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          confine: true, //限制tootip在容器内
          formatter: function (params) {
            params.sort(function (a, b) {
              return b.value - a.value; //倒序
            });
            //使用formatter函数修改需要的样式
            let listItem = "";
            let lineSize = Math.ceil(params.length / 20);
            let lineIndex = 0;
            if (lineSize <= 0) {
              lineSize = 1;
            }
            let xDataIndex = -1;
            params.forEach((one) => {
              if (listItem == "") {
                listItem += "<span>时间：" + one.name + "</span><br/>";
                listItem +=
                  "<span class='ft-12'>点击查看耗时较长的调用</span><br/>";
                xDataIndex = xAxisData.indexOf(one.name);
                let data = xDataList[xDataIndex];
                if (data) {
                  listItem +=
                    "<span class='ft-12'>总数：" + data.count + "</span><br/>";
                  listItem +=
                    "<span class='ft-12'>异常数：" +
                    data.errorCount +
                    "</span><br/>";
                }
              }
              if (one.seriesName == "TPS" || one.seriesName == "总次数") {
                listItem +=
                  '<i style="display: inline-block;width: 10px;height: 10px;background: ' +
                  one.color +
                  ';margin-right: 5px;border-radius: 50%;}"></i><span style="display:inline-block;">' +
                  one.seriesName +
                  "</span>：" +
                  one.value +
                  "&nbsp;";
              } else {
                listItem +=
                  '<i style="display: inline-block;width: 10px;height: 10px;background: ' +
                  one.color +
                  ';margin-right: 5px;border-radius: 50%;}"></i><span style="display:inline-block;">' +
                  one.seriesName +
                  "</span>：" +
                  one.value +
                  "&nbsp;毫秒&nbsp;&nbsp;&nbsp;";
              }
              lineIndex++;
              if (lineIndex >= lineSize) {
                listItem += "<br>";
                lineIndex = 0;
              }
            });
            return '<div class="showBox">' + listItem + "</div>";
          },
        },
        grid: {
          left: "10px",
          right: "20px",
          bottom: "10px",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxisData,
        },
        yAxis: {
          type: "value",
        },
        series: series,
      };
      if (showLegend) {
        option.legend = {
          data: legendData,
        };
      }
      if (showToolbox) {
        option.toolbox = {
          feature: {
            saveAsImage: {},
          },
        };
      }
      echart.setOption(option);
    },
  },
  mounted() {
    this.init();
  },
  beforeCreate() {},
};
</script>

<style >
.report-endpoint-minute-echart {
  position: relative;
}
</style>
