<template>
  <el-dialog
    ref="modal"
    :title="`文件上传`"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :show-close="true"
    :append-to-body="true"
    :visible="showDialog"
    :before-close="hide"
    :destroy-on-close="true"
    :fullscreen="true"
    class="app-dialog"
  >
    <div class="pd-10" style="height: 100%">
      <div
        class="terminal-upload-box"
        @drop="onDrop"
        @dragover="onDragover"
        @dragleave="onDragleave"
        draggable="true"
      >
        <div style="top: 40%; position: relative">
          <i class="mdi mdi-upload ft-20"></i>
          <div class="mgt-10 ft-16">
            将文件拖到此处 ，或
            <div class="tm-link color-green" @click="toClickUpload">
              点击上传
            </div>
          </div>
        </div>
      </div>
    </div>
    <input
      type="file"
      multiple
      id="input-for-upload"
      @change="uploadInputChange"
      ref="input-for-upload"
      style="
        width: 0px;
        height: 0px;
        position: fixed;
        left: -100px;
        top: -100px;
      "
    />
  </el-dialog>
</template>

<script>
import Zmodem from "zmodem.js";
export default {
  components: {},
  props: ["source", "toolboxWorker", "worker"],
  data() {
    return {
      showDialog: false,
      isFileSelect: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    show(zsession, term, callback) {
      this.isFileSelect = false;
      this.zsession = zsession;
      this.term = term;
      this.callback = callback;
      this.showDialog = true;
      this.callStopped = false;
    },
    hide() {
      if (!this.isFileSelect) {
        // this.tool
        //   .confirm("是否取消上传？")
        //   .then(async () => {
        this.showDialog = false;

        this.term.write("\r\n取消上传\r\n");
        this.tool.warn("取消上传");
        // zsession 每 5s 发送一个 ZACK 包，5s 后会出现提示最后一个包是 ”ZACK“ 无法正常关闭
        // 这里直接设置 _last_header_name 为 ZRINIT，就可以强制关闭了
        this.zsession._last_header_name = "ZRINIT";
        this.zsession.close();
        // this.toolboxWorker.writeEvent("shell cancel upload file");
        // })
        // .catch((e) => {});
      } else {
        this.showDialog = false;
      }
      this.callback && this.callback();
    },
    onSuccess() {
      this.tool.success("文件上传完成");
      this.callback && this.callback();
    },
    async stop() {
      if (this.callStopped) {
        return;
      }
      this.callStopped = true;
      try {
        await this.zsession.close();
      } catch (e) {}
      this.term.write("\r\n停止上传\r\n");
      this.tool.warn("停止上传");
      this.callback && this.callback();
    },
    toClickUpload() {
      this.$refs["input-for-upload"].value = null;
      this.$refs["input-for-upload"].click();
    },
    uploadInputChange() {
      let upload = this.$refs["input-for-upload"];

      this.doUpload(upload.files);
    },
    doUpload(files) {
      this.isFileSelect = true;
      this.showDialog = false;
      // this.term.write("\r\n注意：显示文件上传的进度为本地到应用服务的进度\r\n");

      this.send_block_files(this.zsession, files, {
        on_offer_response: (obj, xfer) => {
          if (xfer) {
            this.term.write("\r\n");
          } else {
            this.term.write(
              "\r\n文件(" +
                obj.upload_number +
                "/" +
                obj.upload_file_count +
                ") " +
                obj.name +
                " 已跳过（请检查文件是否已存在或是否有权限上传）\r\n"
            );
            if (obj.upload_number == obj.upload_file_count) {
              this.onSuccess();
            }
          }
        },
        on_progress: (obj, xfer) => {
          try {
            if (xfer.fileProgress == null) {
              let detail = xfer.get_details();
              let total = detail.size;
              xfer.fileProgress = this.worker.getFileProgress({
                total: total,
              });
            }
            this.updateProgress(xfer);
          } catch (error) {}
        },
        on_file_complete: (obj) => {
          this.term.write(
            "\r\n文件(" +
              obj.upload_number +
              "/" +
              obj.upload_file_count +
              ") " +
              obj.name +
              " 上传成功\r\n"
          );
          if (obj.upload_number == obj.upload_file_count) {
            this.onSuccess();
          }
        },
      })
        .then(this.zsession.close.bind(this.zsession))
        .then(() => {
          // res();
        });
    },
    onDragover(e) {
      this.tool.stopEvent(e);
    },
    onDragleave(e) {
      this.tool.stopEvent(e);
    },
    onDrop(e) {
      this.tool.stopEvent(e);
      let files = [];
      let endCall = () => {
        this.doUpload(files);
      };
      if (
        e.dataTransfer &&
        e.dataTransfer.items &&
        e.dataTransfer.items.length > 0
      ) {
        let itemsLength = e.dataTransfer.items.length;
        Array.prototype.forEach.call(
          e.dataTransfer.items,
          async (one, index) => {
            if (one.webkitGetAsEntry) {
              let webkitGetAsEntry = one.webkitGetAsEntry();
              this.uploadEntryFile(files, webkitGetAsEntry, () => {
                if (index == itemsLength - 1) {
                  endCall();
                }
              });
              return;
            }
            let file = one.getAsFile();
            if (file != null) {
              files.push(file);
              if (index == e.dataTransfer.items.length - 1) {
                endCall();
              }
            }
          }
        );
      }
    },
    uploadEntryFile(files, entry, endCall) {
      if (entry.isFile) {
        entry.file(
          (file) => {
            files.push(file);
            endCall();
          },
          (e) => {
            console.log(e);
          }
        );
      } else {
        let reader = entry.createReader();
        reader.readEntries(
          (entries) => {
            let entriesLength = entries.length;
            entries.forEach((entry, index) =>
              this.uploadEntryFile(files, entry, () => {
                if (index == entriesLength - 1) {
                  endCall();
                }
              })
            );
          },
          (e) => {
            console.log(e);
          }
        );
      }
    },
    updateProgress(xfer) {
      if (this.callStopped) {
        return;
      }
      let detail = xfer.get_details();
      let name = detail.name;
      let offset = xfer.get_offset();
      let ss = xfer.fileProgress(offset);

      let str =
        "上传文件(" +
        detail.obj.upload_number +
        "/" +
        detail.obj.upload_file_count +
        ") " +
        name +
        ss;
      this.term.write("\r" + str);
    },
    send_block_files(session, files, options) {
      let that = this;
      if (!options) options = {};

      //Populate the batch in reverse order to simplify sending
      //the remaining files/bytes components.
      var batch = [];
      var total_size = 0;
      for (var f = files.length - 1; f >= 0; f--) {
        files[f].upload_number = f + 1;
        files[f].upload_file_count = files.length;
        var fobj = files[f];
        total_size += fobj.size;
        batch[f] = {
          obj: fobj,
          name: fobj.name,
          size: fobj.size,
          mtime: new Date(fobj.lastModified),
          files_remaining: files.length - f,
          bytes_remaining: total_size,
          startTime: new Date().getTime(),
        };
      }

      var file_idx = 0;
      function promise_callback() {
        var cur_b = batch[file_idx];

        if (!cur_b) {
          return Promise.resolve(); //batch done!
        }

        file_idx++;

        return session.send_offer(cur_b).then((xfer) => {
          if (options.on_offer_response) {
            options.on_offer_response(cur_b.obj, xfer);
          }

          if (xfer === undefined) {
            return promise_callback(); //skipped
          }

          return new Promise(function (res) {
            var block = 32 * 1024;
            var fileSize = cur_b.size;
            var fileLoaded = 0;
            var reader = new FileReader();
            reader.onerror = function reader_onerror(e) {
              throw "File read error: " + e;
            };
            function readBlob() {
              var blob;
              if (cur_b.obj.slice) {
                blob = cur_b.obj.slice(fileLoaded, fileLoaded + block + 1);
              } else if (cur_b.obj.mozSlice) {
                blob = cur_b.obj.mozSlice(fileLoaded, fileLoaded + block + 1);
              } else if (cur_b.obj.webkitSlice) {
                blob = cur_b.obj.webkitSlice(
                  fileLoaded,
                  fileLoaded + block + 1
                );
              } else {
                blob = cur_b.obj;
              }
              reader.readAsArrayBuffer(blob);
            }
            var piece;
            reader.onload = async function reader_onload(e) {
              if (that.callStopped) {
                xfer.end().then(function () {
                  // that.term.write("\r\n停止上传\r\n");
                  res(promise_callback());
                });
                return;
              }
              fileLoaded += e.total;
              if (fileLoaded < fileSize) {
                if (e.target.result) {
                  if (session.aborted()) {
                    throw new Zmodem.Error("aborted");
                  }
                  piece = new Uint8Array(e.target.result);
                  await xfer.send(piece);
                  if (options.on_progress && piece.length) {
                    options.on_progress(cur_b.obj, xfer, piece);
                  }
                }
                readBlob();
              } else {
                //
                if (e.target.result) {
                  piece = new Uint8Array(e.target.result);
                  if (session.aborted()) {
                    throw new Zmodem.Error("aborted");
                  }
                  xfer.end(piece).then(function () {
                    if (options.on_progress && piece.length) {
                      options.on_progress(cur_b.obj, xfer, piece);
                    }
                    if (options.on_file_complete) {
                      options.on_file_complete(cur_b.obj, xfer);
                    }
                    res(promise_callback());
                  });
                }
              }
            };
            readBlob();
          });
        });
      }

      return promise_callback();
    },
  },
  created() {},
  mounted() {},
};
</script>

<style>
.terminal-upload-box {
  width: 100%;
  margin: 0px auto;
  text-align: center;
  border: 2px dashed #ddd;
  height: 100%;
}
</style>
