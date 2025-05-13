<template>
  <div></div>
</template>

<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "worker"],
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
          let detail = xfer.get_details();
          let total = detail.size;
          let fileProgress = this.worker.getFileProgress({
            total: total,
          });
          // console.log("zsession on offer", xfer);
          // if (xfer.get_details().size > 20 * 1024 * 1024 * 1024) {
          //   xfer.skip();
          //   that.tool.warn(`${xfer.get_details().name} 超过 20 G, 无法下载`);
          //   return;
          // }
          let FILE_BUFFER = [];
          xfer.on("input", (payload) => {
            if (xfer.isSaved) {
              return;
            }
            // console.log("xfer on input", payload.length);
            let offset = xfer.get_offset();
            this.updateProgress(fileProgress, detail, offset);
            FILE_BUFFER.push(new Uint8Array(payload));
            if (total == 0 || total <= offset) {
              window.setTimeout(() => {
                if (xfer.isSaved) {
                  return;
                }
                this.saveFile(xfer, FILE_BUFFER);
                xfer.skip();
              }, 500);
            }
          });
          xfer.on("complete", (arg) => {
            if (xfer.isSaved) {
              return;
            }
            let offset = xfer.get_offset();
            this.updateProgress(fileProgress, detail, offset);
            // console.log("xfer on complete", arg);
          });

          xfer
            .accept()
            .then(
              (arg) => {
                // console.log("xfer.accept then 1:", arg);
                if (xfer.isSaved) {
                  return;
                }
                this.saveFile(xfer, FILE_BUFFER);
              },
              (arg) => {
                console.log("xfer.accept then 2:", arg);
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
    updateProgress(fileProgress, detail, offset) {
      let name = detail.name;
      let ss = fileProgress(offset);
      let str = "下载文件 " + name + ss;
      this.term.write("\r" + str);
    },
    saveFile(xfer, buffer) {
      if (xfer.isSaved) {
        return;
      }
      xfer.isSaved = true;
      this.last_xfer = null;
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
      this.term.write("\r\n");
    },
  },
  created() {},
  mounted() {},
};
</script>

<style>
</style>
