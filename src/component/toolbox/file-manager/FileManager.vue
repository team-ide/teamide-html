<template>
  <div class="toolbox-file-manager-box" tabindex="-1">
    <tm-layout height="100%">
      <tm-layout height="70px">
        <div class="pdtb-5 pdlr-10">
          <template v-if="fileWorker.isInputDir">
            <input
              ref="fileDirInput"
              class="toolbox-file-manager-dir-input"
              v-model="fileWorker.dir"
              title="回车确认"
              @keyup.enter="inputOnEnter"
              @blur="setIsInputDir(false)"
            />
          </template>
          <template v-else>
            <div
              class="toolbox-file-manager-dir-names-breadcrumb"
              @click="setIsInputDir(true)"
            >
              <el-breadcrumb separator="/">
                <template v-for="(one, index) in fileWorker.dirNames">
                  <el-breadcrumb-item :key="index">
                    <span @click="fileWorker.toDirName(index)">{{ one }}</span>
                  </el-breadcrumb-item>
                </template>
              </el-breadcrumb>
            </div>
          </template>
        </div>
        <div class="pdlr-10">
          <el-form size="mini" inline @submit.native.prevent>
            <el-form-item :label="title" class="mgb-0"> </el-form-item>
            <el-form-item
              label="Filter"
              class="mgb-0 toolbox-file-manager-filter-input"
            >
              <el-input
                ref="filterInput"
                v-model="fileWorker.filter"
                style="width: 150px"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </tm-layout>
      <tm-layout height="auto">
        <div
          class="toolbox-file-manager-files-box app-scroll-bar"
          @contextmenu.prevent="fileContextmenu"
          ref="filesBox"
          tabindex="0"
          @click="filesBoxClick"
        >
          <template v-if="fileWorker.fileList == null">
            <div class="text-center pdtb-10 ft-15">加载中...</div>
          </template>
          <template v-for="(one, index) in fileWorker.fileList">
            <div
              :key="'file-' + index"
              v-if="one.show"
              class="toolbox-file-manager-file-box"
              :class="{ 'toolbox-file-manager-file-select': one.select }"
              draggable="true"
              @dblclick="openFile(one)"
              :path="one.path"
            >
              <div class="file-icon">
                <i v-if="one.isDir" class="mdi mdi-folder color-orange-3"></i>
                <i
                  v-else
                  class="mdi mdi-file toolbox-file-manager-file-icon"
                ></i>
              </div>
              <div class="file-name">
                <template v-if="one.rename">
                  <input
                    class="toolbox-file-manager-rename-input"
                    v-model="one.newname"
                    @blur="onRenameBlur(one, $event)"
                    @keyup="onRenameKeyup(one, $event)"
                  />
                </template>
                <template v-else>
                  {{ one.name }}
                </template>
              </div>
              <div class="file-date">
                {{ one.dateTime }}
              </div>
              <div class="file-mode">
                {{ one.fileMode }}
              </div>
              <div class="file-size">
                <template v-if="!one.isDir">
                  <span class="file-size-unitSize">
                    {{ one.unitSize }}
                  </span>
                  <span class="file-size-unit">
                    {{ one.unit }}
                  </span>
                </template>
              </div>
            </div>
          </template>
        </div>
      </tm-layout>
    </tm-layout>
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
  </div>
</template>


<script>
import _worker from "./worker.js";

export default {
  components: {},
  props: [
    "source",
    "toolboxWorker",
    "place",
    "placeId",
    "openDir",
    "onChangeOpenDir",
    "title",
    "getWorkerByKey",
    "openFileEdit",
  ],
  data() {
    let fileWorker = _worker.newWorker({
      workerId: this.toolboxWorker.workerId,
      place: this.place,
      placeId: this.placeId,
      onChangeOpenDir: this.onChangeOpenDir,
      getWorkerByKey: this.getWorkerByKey,
    });
    if (this.tool.isNotEmpty(this.openDir)) {
      fileWorker.dir = this.openDir;
    }
    return {
      fileWorker: fileWorker,
    };
  },
  computed: {},
  watch: {
    "fileWorker.filter"() {
      this.fileWorker.filterFile();
    },
  },
  methods: {
    init() {
      this.fileWorker.refresh();
    },
    onFocus() {
      this.$el.focus();
    },
    refresh() {
      this.fileWorker.refresh();
    },
    openFile(file) {
      if (file == null) {
        return;
      }
      if (file.isDir) {
        this.fileWorker.openDir(file.path);
      } else {
        this.openFileEdit(this.fileWorker, file);
      }
    },
    setIsInputDir(isInputDir) {
      this.fileWorker.isInputDir = isInputDir;
      if (isInputDir) {
        this.$nextTick(() => {
          this.$refs["fileDirInput"].focus();
        });
      }
    },
    inputOnEnter(e) {
      e = e || window.event;
      var charCode = e.charCode ? e.charCode : e.which ? e.which : e.keyCode;
      if (charCode == 13 || charCode == 3) {
        this.fileWorker.refresh(true);
      }
    },
    filesBoxClick(e) {
      e = e || window.event;
      let file = this.fileWorker.getFileByTarget(e.target);
      if (file) {
        if (file.select) {
          let selectFiles = this.fileWorker.getSelectFiles();
          if (selectFiles.length <= 1) {
            this.fileWorker.setUnselect(file);
          } else {
            this.fileWorker.selectFile(file);
          }
        } else {
          this.fileWorker.selectFile(file);
        }
      } else {
        let selectFiles = this.fileWorker.getSelectFiles();
        selectFiles.forEach((one) => {
          this.fileWorker.setUnselect(one);
        });
      }
    },
    fileContextmenu(e) {
      e = e || window.event;
      let file = this.fileWorker.getFileByTarget(e.target);
      if (file && !file.select) {
        this.fileWorker.selectFile(file);
      }
      let files = this.fileWorker.getSelectFiles();
      let menus = [];

      menus.push({
        text: "刷新",
        onClick: () => {
          this.refresh();
        },
      });
      if (files.length == 1) {
        menus.push({
          text: "重命名",
          onClick: () => {
            this.toRename(files[0]);
          },
        });
        menus.push({
          text: "复制文件名",
          onClick: async () => {
            let res = await this.tool.clipboardWrite(files[0].name);
            if (res.success) {
              this.tool.success("复制成功");
            } else {
              this.tool.warn("复制失败，请允许访问剪贴板！");
            }
          },
        });
        menus.push({
          text: "复制文件路径",
          onClick: async () => {
            let res = await this.tool.clipboardWrite(files[0].path);
            if (res.success) {
              this.tool.success("复制成功");
            } else {
              this.tool.warn("复制失败，请允许访问剪贴板！");
            }
          },
        });
        if (!files[0].isDir) {
          menus.push({
            text: "打开",
            onClick: () => {
              this.openFile(files[0]);
            },
          });
          menus.push({
            text: "下载",
            onClick: () => {
              this.fileWorker.download(files[0].path);
            },
          });
        }
      }
      menus.push({
        text: "新建文件夹",
        onClick: () => {
          this.toInsertFile(true, files[0]);
        },
      });
      menus.push({
        text: "新建文件",
        onClick: () => {
          this.toInsertFile(false, files[0]);
        },
      });
      menus.push({
        text: "上传",
        onClick: () => {
          this.toClickUpload();
        },
      });
      if (files.length > 0) {
        menus.push({
          text: "删除",
          onClick: () => {
            this.toRemove(files);
          },
        });
      }

      this.tool.showContextmenu(menus);
      // e.preventDefault();
    },
    ondragstart(e) {
      e = e || window.event;
      if (this.fileWorker.getRenameFile() != null) {
        e.preventDefault();
        return;
      }
      let file = this.fileWorker.getFileByTarget(e.target);
      // e.preventDefault();
      if (file != null) {
        if (!file.select) {
          this.fileWorker.selectFile(file);
        }
        let files = this.fileWorker.getSelectFiles();

        e.dataTransfer.setData("files", this.tool.JSONbig.stringify(files));
      } else {
        e.dataTransfer.setData("files", "");
      }
      e.dataTransfer.setData("place", this.place);
      e.dataTransfer.setData("placeId", this.placeId);
      e.dataTransfer.setData("dir", this.fileWorker.dir);
      e.dataTransfer.setData("fileWorkerKey", this.fileWorker.fileWorkerKey);
    },
    ondragend(e) {
      // e.preventDefault();
      console.log("ondragend", e);
    },
    ondrag(e) {
      // e.preventDefault();
      console.log("ondrag", e);
    },
    ondragleave(e) {
      e.preventDefault();
    },
    ondragover(e) {
      e.preventDefault();
    },
    ondrop(e) {
      e.preventDefault();
      let putFile = this.fileWorker.getFileByTarget(e.target);
      let putDir = null;
      if (putFile != null && putFile.isDir) {
        putDir = putFile.path;
      } else {
        putDir = this.fileWorker.dir;
      }
      // console.log("ondrop", e);
      let files = e.dataTransfer.getData("files");
      if (this.tool.isNotEmpty(files)) {
        let place = e.dataTransfer.getData("place");
        let placeId = e.dataTransfer.getData("placeId");
        let dir = e.dataTransfer.getData("dir");
        let fileWorkerKey = e.dataTransfer.getData("fileWorkerKey");
        if (place == this.place && placeId == this.placeId && dir == putDir) {
          return;
        }
        let files = e.dataTransfer.getData("files");
        files = this.tool.JSONbig.parse(files);
        if (!putDir.endsWith("/")) {
          putDir += "/";
        }
        if (place != this.place || placeId != this.placeId) {
          let names = [];
          files.forEach((one) => {
            names.push(one.name);
          });
          this.tool
            .confirm("复制 [" + names.join(",") + "] 到 [" + putDir + "] ？")
            .then(async () => {
              files.forEach((one) => {
                this.fileWorker.copy({
                  path: putDir + one.name,
                  fromFileWorkerKey: fileWorkerKey,
                  fromPlace: place,
                  fromPlaceId: placeId,
                  fromPath: one.path,
                });
              });
            })
            .catch((e) => {});
        } else {
          let names = [];
          files.forEach((one) => {
            names.push(one.name);
          });
          this.tool
            .confirm(
              "移动 [ " + names.join(",") + " ] 到 [ " + putDir + " ] ？"
            )
            .then(async () => {
              files.forEach((one) => {
                this.fileWorker.move({
                  oldFileWorkerKey: fileWorkerKey,
                  oldPath: one.path,
                  newFileWorkerKey: this.fileWorker.fileWorkerKey,
                  newPath: putDir + one.name,
                });
              });
            })
            .catch((e) => {});
        }
      } else if (
        e.dataTransfer &&
        e.dataTransfer.items &&
        e.dataTransfer.items.length > 0
      ) {
        Array.prototype.forEach.call(e.dataTransfer.items, async (one) => {
          if (one.webkitGetAsEntry) {
            let webkitGetAsEntry = one.webkitGetAsEntry();
            this.uploadEntryFile(putDir, webkitGetAsEntry);
            return;
          }
          let file = one.getAsFile();
          if (file != null) {
            this.fileWorker.uploadFile(putDir, file);
          } else {
            console.log(one);
          }
        });
      }
    },
    uploadEntryFile(putDir, entry) {
      if (entry == null) {
        return;
      }
      if (entry.isFile) {
        entry.file(
          (file) => {
            this.fileWorker.uploadFile(putDir, file, entry.fullPath);
          },
          (e) => {
            console.log(e);
          }
        );
      } else {
        let reader = entry.createReader();
        reader.readEntries(
          (entries) => {
            entries.forEach((entry) => this.uploadEntryFile(putDir, entry));
          },
          (e) => {
            console.log(e);
          }
        );
      }
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
      let putDir = this.fileWorker.dir;
      Array.prototype.forEach.call(files, async (one) => {
        if (one.webkitGetAsEntry) {
          let webkitGetAsEntry = one.webkitGetAsEntry();
          this.uploadEntryFile(putDir, webkitGetAsEntry);
          return;
        }
        this.fileWorker.uploadFile(putDir, one);
      });
    },
    toRemove(files) {
      let names = [];
      files.forEach((one) => {
        names.push(one.name);
      });
      this.tool
        .confirm("删除[" + names.join(",") + "]后无法恢复，确定删除？")
        .then(async () => {
          files.forEach((one) => {
            this.fileWorker.remove(one.path);
          });
        })
        .catch((e) => {});
    },
    toInsertFile(isDir, afterFile) {
      let index = this.fileWorker.getFileIndex(afterFile);
      if (index < 0) {
        index = this.fileWorker.fileList.length - 1;
      }
      let newFile = {};
      newFile.name = "新建文件";
      if (isDir) {
        newFile.name = "新建文件夹";
      }
      newFile.isDir = isDir;
      newFile.path = this.fileWorker.dir + "/" + newFile.name;
      newFile.rename = false;
      newFile.size = newFile.size || 0;
      newFile.isNew = true;
      newFile.show = true;
      this.fileWorker.fileList.splice(index + 1, 0, newFile);
      this.$nextTick(() => {
        this.toRename(newFile);
      });
    },
    toRename(file) {
      file.newname = file.name;
      file.rename = true;
      this.toFocusFile(file);
      // this.$emit("rename", this.place, this.dir, file);
    },
    async doRename(file) {
      let fileIndex = this.fileWorker.getFileIndex(file);
      if (fileIndex < 0) {
        return;
      }
      if (this.tool.isEmpty(file.newname) && file.isNew) {
        this.fileWorker.fileList.splice(fileIndex, 1);
        return;
      }
      if (this.tool.isEmpty(file.newname) || file.name == file.newname) {
        if (!file.isNew) {
          file.rename = false;
          return;
        }
      }
      if (file.newname.indexOf("/") >= 0 || file.newname.indexOf("\\") >= 0) {
        this.tool.error("文件名输入有误，请重新输入！");
        this.toFocusFile(file);
        return;
      }
      let resFile = null;
      if (file.isNew) {
        resFile = await this.fileWorker.create(
          this.fileWorker.dir + "/" + file.newname,
          file.isDir
        );
      } else {
        resFile = await this.fileWorker.rename(
          file.path,
          this.fileWorker.dir + "/" + file.newname
        );
      }
      if (resFile != null) {
        this.fileWorker.fileList.splice(fileIndex, 1, resFile);
      } else {
        this.toFocusFile(file);
      }
    },
    toFocusFile(file) {
      this.$nextTick(() => {
        if (
          this.$el.getElementsByClassName(
            "toolbox-file-manager-rename-input"
          )[0]
        ) {
          setTimeout(() => {
            this.$el
              .getElementsByClassName("toolbox-file-manager-rename-input")[0]
              .focus();
          }, 100);
        }
      });
    },
    toBlurFile(file) {
      this.$nextTick(() => {
        if (
          this.$el.getElementsByClassName(
            "toolbox-file-manager-rename-input"
          )[0]
        ) {
          this.$el
            .getElementsByClassName("toolbox-file-manager-rename-input")[0]
            .blur();
        }
      });
    },
    onRenameBlur(file, event) {
      this.doRename(file);
    },
    onRenameKeyup(file, event) {
      event = event || window.event;
      if (event.keyCode == 13 || event.keyCode == 27) {
        this.toBlurFile(file);
      }
    },
    onKeydown(e) {
      if (this.tool.keyIsCtrlA()) {
        if (this.fileWorker.getRenameFile() != null) {
          return;
        }
        this.tool.stopEvent();
        this.fileWorker.toSelectAll();
        return;
      } else if (this.tool.keyIsCtrlF()) {
        this.tool.stopEvent();
        this.$refs["filterInput"].focus();
        return;
      } else if (this.tool.keyIsCtrlD() || this.tool.keyIsDelete()) {
        this.tool.stopEvent();
        let files = this.fileWorker.getSelectFiles();
        if (files != null && files.length > 0) {
          this.toRemove(files);
        }
        return;
      } else if (this.tool.keyIsF2()) {
        this.tool.stopEvent();
        let files = this.fileWorker.getSelectFiles();
        if (files != null && files.length > 0) {
          this.toRename(files[0]);
        }
        return;
      }
    },
    unbindEvent() {
      this.$refs["filesBox"] &&
        this.$refs["filesBox"].removeEventListener("keydown", this.onKeydown);
    },
    bindEvent() {
      if (this.bindEvented) {
        return;
      }
      this.bindEvented = true;
      this.$refs["filesBox"].addEventListener("keydown", this.onKeydown);
      this.$nextTick(() => {
        this.$refs.filesBox.ondragover = this.ondragover;
        this.$refs.filesBox.ondragleave = this.ondragleave;
        this.$refs.filesBox.ondrop = this.ondrop;
        this.$refs.filesBox.ondragstart = this.ondragstart;
      });
    },
  },
  created() {},
  mounted() {
    // document.ondragover = function (e) {
    //   e.preventDefault(); //只有在ondragover中阻止默认行为才能触发 ondrop 而不是 ondragleave
    // };
    // document.ondrop = function (e) {
    //   e.preventDefault(); //阻止 document.ondrop的默认行为  *** 在新窗口中打开拖进的图片
    // };
    this.init();
    this.bindEvent();
  },
  beforeDestroy() {
    this.isDestroyed = true;
    this.unbindEvent();
    this.fileWorker.close();
  },
};
</script>

<style>
.toolbox-file-manager-box {
  width: 100%;
  height: 100%;
  user-select: none;
  position: relative;
  outline: none;
  min-width: 400px;
}
.toolbox-file-manager-files-box {
  width: 100%;
  height: 100%;
  user-select: none;
}
.toolbox-file-manager-file-box {
  display: flex;
  line-height: 20px;
  font-size: 15px;
  cursor: context-menu;
  user-select: none;
  padding: 0px 5px;
}
.toolbox-file-manager-file-box .file-icon {
  padding: 0px 5px;
}
.toolbox-file-manager-file-box .file-name {
  padding: 0px 5px;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.toolbox-file-manager-file-box .file-date {
  padding: 0px 0px;
  font-size: 12px;
  width: 130px;
}
.toolbox-file-manager-file-box .file-mode {
  padding: 0px 0px;
  font-size: 12px;
  width: 80px;
}
.toolbox-file-manager-file-box .file-size {
  padding: 0px 0px;
  font-size: 12px;
  width: 90px;
  text-align: right;
}
.toolbox-file-manager-file-box .file-size .file-size-unit {
  width: 20px;
  display: inline-block;
  text-align: left;
}
.toolbox-file-manager-filter-input input {
  outline: none;
  box-sizing: border-box;
}
.toolbox-file-manager-dir-input {
  width: 100%;
  border: 0px dashed #ddd;
  height: 25px;
  line-height: 25px;
  padding-left: 0px;
  padding-right: 0px;
  box-sizing: border-box;
  outline: none;
  font-size: 15px;
}
.toolbox-file-manager-rename-input {
  width: 100%;
  line-height: 16px;
  box-sizing: border-box;
  outline: none;
}

.toolbox-file-manager-dir-names-breadcrumb {
  border: 0px dashed #ddd;
  height: 25px;
  line-height: 25px;
  font-size: 15px;
  cursor: text;
}
.toolbox-file-manager-dir-names-breadcrumb .el-breadcrumb {
  height: 25px;
  line-height: 25px;
}
.toolbox-file-manager-dir-names-breadcrumb
  .el-breadcrumb
  .el-breadcrumb__separator {
  margin: 0px;
}
.toolbox-file-manager-dir-names-breadcrumb
  .el-breadcrumb
  .el-breadcrumb__inner {
  margin: 0px;
}
.toolbox-file-manager-dir-names-breadcrumb
  .el-breadcrumb
  .el-breadcrumb__inner
  > span {
  cursor: pointer;
  display: inline-block;
}
</style>
