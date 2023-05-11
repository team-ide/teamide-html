<template>
  <div></div>
</template>

<script>
export default {
  components: {},
  props: ["source", "toolboxWorker"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    show(zsession, term, callback) {
      this.zsession = zsession;
      this.term = term;
      this.callback = callback;
      this.downloadFile();
      //**B00000000000000
      //zsentry consume error:Error: Unhandled header: ZRQINIT
      //rz waiting to receive.**B0100000023be50
//zsentry consume error:Error: Unhandled header: ZRINIT
    },
    stop() {
      if (this.last_xfer) {
        this.tool.warn("文件下载正在停止");
        this.last_xfer.skip();
        this.last_xfer = null;
        this.callback && this.callback();
      }
    },
    downloadFile() {
      this.zsession.on("offer", (xfer) => {
        try {
          this.last_xfer = xfer;
          // console.log("zsession on offer", xfer);
          // if (xfer.get_details().size > 20 * 1024 * 1024 * 1024) {
          //   xfer.skip();
          //   that.tool.warn(`${xfer.get_details().name} 超过 20 G, 无法下载`);
          //   return;
          // }
          xfer.startTime = new Date().getTime();
          let FILE_BUFFER = [];
          xfer.on("input", (payload) => {
            // console.log("xfer on input", payload);
            this.updateProgress(xfer);
            FILE_BUFFER.push(new Uint8Array(payload));
          });
          xfer.on("complete", (arg) => {
            // console.log("xfer on complete", arg);
          });

          xfer
            .accept()
            .then(
              (arg) => {
                // console.log("xfer.accept then 1:", arg);
                this.last_xfer = null;
                this.saveFile(xfer, FILE_BUFFER);
                this.term.write("\r\n");
              },
              (arg) => {
                // console.log("xfer.accept then 2:", arg);
              }
            )
            .catch((err) => {
              console.log("xfer.accept err", err);
            });
        } catch (e) {
          this.stop();
        }
      });
      this.zsession.on("session_end", () => {
        this.stop();
      });
      this.zsession.start();
    },
    bytesHuman(bytes, precision) {
      if (!/^([-+])?|(\.\d+)(\d+(\.\d+)?|(\d+\.)|Infinity)$/.test(bytes)) {
        return "-";
      }
      if (bytes === 0) return "0";
      if (typeof precision === "undefined") precision = 2;
      const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB", "BB"];
      const num = Math.floor(Math.log(bytes) / Math.log(1024));
      const value = (bytes / Math.pow(1024, Math.floor(num))).toFixed(
        precision
      );
      let res = `${value} ${units[num]}`;
      let fSize = 10 - res.length;
      for (let i = 0; i < fSize; i++) {
        res = " " + res;
      }
      return res;
    },
    updateProgress(xfer) {
      let detail = xfer.get_details();
      let name = detail.name;
      let total = detail.size;
      let offset = xfer.get_offset();
      let percent;
      if (total === 0 || total === offset) {
        percent = 100;
      } else {
        percent = ((offset / total) * 100).toFixed(2);
      }
      let percentStr = "" + percent;
      let fSize = 10 - percentStr.length;
      for (let i = 0; i < fSize; i++) {
        percentStr = " " + percentStr;
      }

      let sleep = 0;
      let nowTime = new Date().getTime();
      let startTime = xfer.startTime;
      if (nowTime - startTime > 0) {
        sleep = ((offset * 1000) / (nowTime - startTime)).toFixed(2);
      }

      this.term.write(
        "\r" +
          "下载文件" +
          name +
          " " +
          this.bytesHuman(total) +
          " " +
          this.bytesHuman(offset) +
          " " +
          this.bytesHuman(sleep) +
          "/s " +
          percentStr +
          "%"
      );
    },
    saveFile(xfer, buffer) {
      let name = xfer.get_details().name;
      let href = null;
      try {
        let blob = new Blob(buffer, { type: "application/octet-stream" });
        let downloadElement = document.createElement("a");
        href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = name; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
      } catch (e) {}
      if (href != null) {
        window.URL.revokeObjectURL(href); //释放blob对象
      }
      this.callback && this.callback();
    },
  },
  created() {},
  mounted() {},
};
</script>

<style>
</style>
