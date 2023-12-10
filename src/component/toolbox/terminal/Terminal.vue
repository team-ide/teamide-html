<template>
  <div class="toolbox-terminal-box">
    <div style="height: calc(100% - 30px); display: flex">
      <div
        v-if="terminalInfoOpen"
        style="height: 100%"
        class="app-scroll-bar"
        :style="{ width: terminalInfoWidthValue }"
      >
        <template v-if="systemInfoLoading">
          <div class="color-orange text-center ft-12 pdt-20">信息加载中...</div>
        </template>
        <template v-else-if="systemInfo == null">
          <div class="color-orange text-center ft-12 pdt-20">
            未能识别终端信息
          </div>
        </template>
        <template v-else>
          <div class="pdlr-5 pdtb-3">
            <div class="tm-link color-grey ft-12" @click="loadSystemInfo()">
              刷新
            </div>
          </div>
          <div
            class="ft-12 pdtb-3 pdlr-5"
            style="user-select: text; line-height: 20px"
          >
            <div
              v-if="tool.isNotEmpty(systemInfo.hostInfoStat.hostname)"
              class="system-info-line"
            >
              <div class="system-info-lable">主机:</div>
              <div class="system-info-value">
                {{ systemInfo.hostInfoStat.hostname }}
              </div>
            </div>
            <div
              v-if="tool.isNotEmpty(systemInfo.hostInfoStat.platform)"
              class="system-info-line"
            >
              <div class="system-info-lable">平台:</div>
              <div class="system-info-value">
                {{ systemInfo.hostInfoStat.platform }}
              </div>
            </div>
            <div
              v-if="tool.isNotEmpty(systemInfo.hostInfoStat.platformFamily)"
              class="system-info-line"
            >
              <div class="system-info-lable">平台架构:</div>
              <div class="system-info-value">
                {{ systemInfo.hostInfoStat.platformFamily }}
              </div>
            </div>
            <div
              v-if="tool.isNotEmpty(systemInfo.hostInfoStat.platformVersion)"
              class="system-info-line"
            >
              <div class="system-info-lable">平台版本:</div>
              <div class="system-info-value">
                {{ systemInfo.hostInfoStat.platformVersion }}
              </div>
            </div>
            <div
              v-if="tool.isNotEmpty(systemInfo.hostInfoStat.kernelArch)"
              class="system-info-line"
            >
              <div class="system-info-lable">内核:</div>
              <div class="system-info-value">
                {{ systemInfo.hostInfoStat.kernelArch }}
              </div>
            </div>
            <div
              v-if="tool.isNotEmpty(systemInfo.hostInfoStat.kernelVersion)"
              class="system-info-line"
            >
              <div class="system-info-lable">内核版本:</div>
              <div class="system-info-value">
                {{ systemInfo.hostInfoStat.kernelVersion }}
              </div>
            </div>
            <template v-if="systemInfo.memory != null">
              <div class="system-info-line">
                <div class="system-info-lable">内存:</div>
                <div class="system-info-value">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="16"
                    :percentage="systemInfo.memory.usedPercent"
                  ></el-progress>
                </div>
              </div>
              <div class="system-info-line">
                <div class="system-info-lable"></div>
                <div class="system-info-value">
                  {{ systemInfo.memory.free }} GB /
                  {{ systemInfo.memory.total }} GB
                </div>
              </div>
            </template>
            <template v-if="systemInfo.disks != null">
              <template v-for="(one, index) in systemInfo.disks">
                <div :key="'disk-' + index" class="system-info-line">
                  <div class="system-info-lable">路径-{{ index + 1 }}:</div>
                  <div class="system-info-value">{{ one.path }}</div>
                </div>
                <div :key="'used-' + index" class="system-info-line">
                  <div class="system-info-lable"></div>
                  <div class="system-info-value">
                    <el-progress
                      :text-inside="true"
                      :stroke-width="16"
                      :percentage="one.usedPercent"
                    ></el-progress>
                  </div>
                </div>
                <div :key="'total-' + index" class="system-info-line">
                  <div class="system-info-lable"></div>
                  <div class="system-info-value">
                    {{ one.used }} GB / {{ one.total }} GB
                  </div>
                </div>
              </template>
            </template>
            <template v-if="systemInfo.cpuInfoStats != null">
              <template v-for="(one, index) in systemInfo.cpuInfoStats">
                <div :key="'cpu-' + index" class="system-info-line">
                  <div class="system-info-lable">CPU-{{ index + 1 }}:</div>
                  <div class="system-info-value">{{ one.cores }} 核</div>
                </div>
                <div :key="'vendorId-' + index" class="system-info-line">
                  <div class="system-info-lable"></div>
                  <div class="system-info-value">{{ one.vendorId }}</div>
                </div>
                <div :key="'modelName-' + index" class="system-info-line">
                  <div class="system-info-lable"></div>
                  <div class="system-info-value">
                    {{ one.modelName }}
                  </div>
                </div>
              </template>
            </template>
          </div>
        </template>
      </div>
      <div style="height: 100%; flex: 1">
        <div v-show="showSearch" class="terminal-search-box">
          <input
            ref="searchInput"
            class="terminal-search-input"
            v-model="searchText"
            @change="doSearch()"
          />
          <span class="pdlr-5 terminal-search-text">
            <template v-if="searchCount <= 0">
              <span class="color-orange">暂无匹配</span>
            </template>
            <template v-else>
              <span class="">
                第
                <span class="color- pdlr-2">
                  <template v-if="searchIndex >= 0">
                    {{ searchIndex + 1 }}
                  </template>
                  <template v-else> ? </template>
                </span>
                项，共
                <span class="color- pdlr-2">{{ searchCount }}</span>
                项
              </span>
            </template>
          </span>
          <span class="terminal-search-navs">
            <template v-if="searchCount > 0">
              <i
                class="terminal-search-nav mdi mdi-arrow-up-thin"
                title="匹配上一个"
                @click="toSearchUp()"
              ></i>
              <i
                class="terminal-search-nav mdi mdi-arrow-down-thin"
                title="匹配下一个"
                @click="toSearchDown()"
              ></i>
            </template>
            <i
              class="terminal-search-nav mdi mdi-close"
              title="关闭搜索"
              @click="toHideSearch()"
            ></i>
          </span>
        </div>
        <div
          class="terminal-xterm-box"
          ref="terminalXtermBox"
          style="
            padding-top: 0px;
            padding-right: 0px;
            padding-bottom: 0px;
            padding-left: 0px;
          "
        />
        <div class="terminal-xterm-box-back" ref="terminalXtermBoxBack" />
      </div>
    </div>
    <div style="height: 30px">
      <div class="pdt-2 pdlr-10">
        <div
          v-if="!terminalInfoOpen"
          class="ft-12 tm-link color-grey mglr-5"
          @click="showTerminalInfo()"
        >
          显示终端信息
        </div>
        <div
          v-else
          class="ft-12 tm-link color-grey mglr-5"
          @click="hideTerminalInfo()"
        >
          隐藏终端信息
        </div>
        <div class="ft-12 tm-link color-grey mglr-5" @click="openFtpWindow()">
          文件管理器
        </div>
        <div class="ft-12 tm-link color-grey mglr-5" @click="openLogs()">
          终端历史记录
        </div>
        <div class="ft-12 tm-link color-grey mglr-5" @click="reconnect()">
          重新连接
        </div>
        <span
          v-if="tool.isNotEmpty(worker.lastUser)"
          class="mgl-10 ft-12 color-orange"
          style="user-select: text"
          >用户：{{ worker.lastUser }}</span
        >
        <span
          v-if="tool.isNotEmpty(worker.lastDir)"
          class="mgl-10 ft-12 color-orange"
          style="user-select: text"
          >目录：{{ worker.lastDir }}</span
        >
      </div>
    </div>
    <template v-if="isOpenFTP">
      <div
        class="toolbox-terminal-file-manager-box"
        :class="{ 'toolbox-terminal-file-manager-box-show': isShowFTP }"
        :style="{
          width: `${ftpWidth}px`,
          height: `${ftpHeight}px`,
        }"
      >
        <div
          ref="ftpBoxTopLine"
          class="toolbox-terminal-file-manager-box-top-line"
        ></div>
        <div
          ref="ftpBoxLeftLine"
          class="toolbox-terminal-file-manager-box-left-line"
        ></div>
        <div class="toolbox-terminal-file-manager-box-header">
          <div class=""></div>
          <div
            style="
              display: inline-block;
              position: absolute;
              top: 0px;
              right: 3px;
              z-index: 1;
            "
          >
            <span
              title="关闭"
              class="tm-link color-write mgr-0"
              @click="hideFTP()"
            >
              <i class="mdi mdi-close ft-21"></i>
            </span>
          </div>
        </div>
        <div class="toolbox-terminal-file-manager-box-body">
          <FileManagerIndex
            :source="source"
            :toolboxWorker="toolboxWorker"
            :extend="extend"
          ></FileManagerIndex>
        </div>
      </div>
    </template>
    <Download
      ref="Download"
      :source="source"
      :toolboxWorker="toolboxWorker"
    ></Download>
    <Upload
      ref="Upload"
      :source="source"
      :toolboxWorker="toolboxWorker"
      :worker="worker"
    ></Upload>
    <ConfirmPaste
      :source="source"
      :toolboxWorker="toolboxWorker"
    ></ConfirmPaste>
    <template v-if="worker != null">
      <Logs
        ref="Logs"
        :source="source"
        :toolboxWorker="toolboxWorker"
        :worker="worker"
      ></Logs>
    </template>
    <!--   -->
    <div
      v-if="worker.isDownloading"
      class="color-orange-9 ft-13 text-center"
      style="position: relative; bottom: 70px; width: 300px; margin: 0px auto"
    >
      有文件正在下载，可以使用`Ctrl+C`停止
    </div>
    <div
      v-if="worker.isUploading"
      class="color-orange-9 ft-13 text-center"
      style="position: relative; bottom: 70px; width: 300px; margin: 0px auto"
    >
      有文件正在上传，可以使用`Ctrl+C`停止
    </div>
  </div>
</template>


<script>
import _worker from "./worker.js";
import "teamide-xterm/css/xterm.css";
import Zmodem from "@/component/zmodem.js";
import { Terminal } from "teamide-xterm";
import { FitAddon } from "xterm-addon-fit";
import { SearchAddon } from "xterm-addon-search";
import { CanvasAddon } from "xterm-addon-canvas";

// import { AttachAddon } from "xterm-addon-attach";

// https://juejin.cn/post/6918911964009725959

import FileManagerIndex from "../file-manager/Index.vue";
import Download from "./Download.vue";
import Upload from "./Upload.vue";
import ConfirmPaste from "./ConfirmPaste.vue";
import Logs from "./Logs.vue";

export default {
  components: {
    FileManagerIndex,
    Download,
    Upload,
    ConfirmPaste,
    Logs,
  },
  props: ["source", "toolboxWorker", "place", "placeId", "extend"],
  data() {
    let worker = _worker.newWorker({
      workerId: this.toolboxWorker.workerId,
      place: this.place,
      placeId: this.placeId,
      onSocketOpen: this.onSocketOpen,
      onSocketClose: this.onSocketClose,
      onSocketError: this.onSocketError,
      onSocketData: this.onSocketData,
    });
    return {
      worker: worker,
      ftpWidth: 900,
      ftpHeight: 600,
      terminalInfoWidthValue: "220px",
      terminalInfoOpen: false,
      systemInfo: null,
      systemInfoLoading: false,

      isOpenFTP: false,
      isShowFTP: true,
      showSearch: false,
      searchText: "",
      searchList: [],
      searchSelect: null,
      searchIndex: -1,
      searchCount: -1,
      searchOptions: {
        decorations: {
          // 匹配的背景色，必须使用#RRGGBB格式
          matchBackground: "#00B8F5",
          // 匹配的边框颜色
          matchBorder: "",
          // 匹配的概览标尺颜色
          matchOverviewRuler: "#00B8F5",
          // 当前活动匹配的背景色，必须使用#RRGGBB格式
          activeMatchBackground: "#FF8000",
          // 当前活动匹配的边框颜色
          activeMatchBorder: "",
          // 当前活动匹配的概览标尺颜色
          activeMatchColorOverviewRuler: "#FF8000",
        },
      },
    };
  },
  computed: {},
  watch: {
    searchText() {
      if (this.showSearch) {
        this.doSearch();
      }
    },
    terminalInfoOpen() {
      this.$nextTick(() => {
        this.doChangeSize();
      });
    },
  },
  methods: {
    async init() {
      if (this.extend) {
        this.worker.lastUser = this.extend.lastUser;
        this.worker.lastDir = this.extend.lastDir;
      }
      this.$nextTick(() => {
        this.initTerm();
        this.worker.init();
      });
    },
    showTerminalInfo() {
      this.terminalInfoOpen = true;
      this.startSystemMonitor();
    },
    hideTerminalInfo() {
      this.terminalInfoOpen = false;
    },
    onFocus() {
      this.term && this.term.focus();
    },
    refresh() {},
    toShowSearch() {
      let copiedText = this.term.getSelection();
      if (this.tool.isNotEmpty(copiedText)) {
        this.searchText = copiedText;
      }
      if (this.showSearch) {
      } else {
        this.showSearch = true;
      }
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
      this.doSearch();
    },
    toHideSearch() {
      this.showSearch = false;
      this.clearSearch();
    },
    openLogs() {
      this.$refs.Logs.show(() => {
        this.onFocus();
      });
    },
    doSearch() {
      try {
        if (this.doSearchIng) {
          return;
        }
        this.doSearchIng = true;
        this.searchSelect = null;
        this.searchList.splice(0, this.searchList.length);
        let searchText = this.searchText;

        if (this.tool.isEmpty(searchText)) {
          this.clearSearch();
          return;
        }
        if (this.searchAddon != null) {
          // 销毁
          this.searchAddon.dispose();
        }
        // this.term.options({ allowProposedApi: true });
        this.term.options.allowProposedApi = true;
        this.searchAddon = new SearchAddon();
        this.term.loadAddon(this.searchAddon);
        this.searchAddon.onDidChangeResults((result) => {
          result = result || {};
          this.searchIndex = result.resultIndex;
          this.searchCount = result.resultCount;
        });
        this.searchAddon.findNext(searchText, this.searchOptions);
      } catch (error) {
      } finally {
        this.doSearchIng = false;
      }

      // let bufferActive = this.term.buffer.active;
      // let maxRows = bufferActive.baseY + this.term.rows;
      // console.log(bufferActive);
      // console.log(this.term.buffer);

      // for (let i = 0; i < maxRows; i++) {
      //   let line = bufferActive.getLine(i);
      //   if (!line) {
      //     break;
      //   }
      //   let lineText = line._line.translateToString();
      //   if (this.tool.isEmpty(lineText) || lineText.trim().length == 0) {
      //     continue;
      //   }
      //   let reg = new RegExp(searchText, "g", "i", "m");
      //   let text = lineText;
      //   let res = reg.exec(text);
      //   while (res) {
      //     let matchData = {};
      //     matchData.lineIndex = i;
      //     matchData.str = res[0];
      //     matchData.start = res.index;
      //     matchData.end = matchData.start + matchData.str.length;
      //     this.searchList.push(matchData);
      //     res = reg.exec(lineText);
      //   }
      // }
      // this.toSearchUp();
    },
    toSearchDown() {
      let searchText = this.searchText;
      this.searchAddon.findNext(searchText, this.searchOptions);
      // let index = this.searchList.indexOf(this.searchSelect);
      // index++;
      // if (index >= this.searchList.length) {
      //   index = 0;
      // }
      // this.toSearchSelect(this.searchList[index]);
    },
    toSearchUp() {
      let searchText = this.searchText;
      this.searchAddon.findPrevious(searchText, this.searchOptions);
      // let index = this.searchList.indexOf(this.searchSelect);
      // index--;
      // if (index < 0) {
      //   index = this.searchList.length - 1;
      // }
      // this.toSearchSelect(this.searchList[index]);
    },
    toSearchSelect(select) {
      this.searchSelect = select;
      if (!select) {
        return;
      }
      let line = this.term.buffer.active.getLine(select.lineIndex);
      if (!line) {
        return;
      }
      this.term.scrollToLine(select.lineIndex);
      this.term.select(
        select.start,
        select.lineIndex,
        select.end - select.start
      );
    },
    clearSearch() {
      if (this.searchAddon != null) {
        // 销毁
        this.searchAddon.dispose();
        this.searchAddon = null;
      }
      this.searchCount = -1;
      this.searchIndex = -1;
      this.term.options.allowProposedApi = false;
      // this.term.options({ allowProposedApi: false });
    },
    onChangeOpenDir(openDir) {
      let data = this.extend || {};
      if (this.tool.isEmpty(openDir)) {
        openDir = "";
      }
      if (this.tool.isEmpty(openDir) && this.tool.isEmpty(data.openDir)) {
        return;
      }
      if (openDir == data.openDir) {
        return;
      }
      data.openDir = openDir;
      var keyValueMap = {};
      keyValueMap["openDir"] = openDir;
      this.toolboxWorker.updateExtend(keyValueMap);
    },
    openFtpWindow() {
      if (this.isOpenFTP && this.isShowFTP) {
        this.hideFTP();
      } else {
        this.isOpenFTP = true;
        this.isShowFTP = true;
      }
      this.$nextTick(this.bindDrapFTPEvent);
    },
    unbindDrapFTPEvent() {
      this.$refs["ftpBoxLeftLine"] &&
        this.$refs["ftpBoxLeftLine"].removeEventListener(
          "mousedown",
          this.leftLineMousedown
        );
      this.$refs["ftpBoxTopLine"] &&
        this.$refs["ftpBoxTopLine"].removeEventListener(
          "mousedown",
          this.topLineMousedown
        );
    },
    bindDrapFTPEvent() {
      if (this.bindDrapFTPEvented) {
        return;
      }
      this.bindDrapFTPEvented = true;
      let leftLine = this.$refs.ftpBoxLeftLine;
      leftLine.addEventListener("mousedown", this.leftLineMousedown);
      let topLine = this.$refs.ftpBoxTopLine;
      topLine.addEventListener("mousedown", this.topLineMousedown);
    },
    leftLineMousedown(e) {
      this.lineLeftClientX = e.clientX;
      document.addEventListener("mouseup", this.documentMouseupEvent);
      document.addEventListener("mousemove", this.documentMousemoveLeftEvent);
    },
    topLineMousedown(e) {
      this.lineTopClientY = e.clientY;
      document.addEventListener("mouseup", this.documentMouseupEvent);
      document.addEventListener("mousemove", this.documentMousemoveTopEvent);
    },
    documentMouseupEvent() {
      document.removeEventListener("mouseup", this.documentMouseupEvent);
      document.removeEventListener(
        "mousemove",
        this.documentMousemoveLeftEvent
      );
      document.removeEventListener("mousemove", this.documentMousemoveTopEvent);
    },
    documentMousemoveLeftEvent(e) {
      let clientX = e.clientX;
      this.ftpWidth =
        Number(this.ftpWidth) - Number(clientX - this.lineLeftClientX);
      this.lineLeftClientX = clientX;
    },
    documentMousemoveTopEvent(e) {
      let clientY = e.clientY;
      this.ftpHeight =
        Number(this.ftpHeight) - Number(clientY - this.lineTopClientY);
      this.lineTopClientY = clientY;
    },
    hideFTP() {
      this.isShowFTP = false;
    },
    onSocketData(data) {
      try {
        this.zsentry.consume(data);
      } catch (e) {
        try {
          this.worker.isUploading = false;
          this.worker.isDownloading = false;
          if (this.last_session) {
            this.last_session.close();
          }
        } catch (e) {}
        if (this.term == null) {
          return;
        }
        this.term.write("\r\nzsentry consume error:" + e.toString());
        this.term.write("\r\n关闭当前会话");
        this.zsentry = this.NewSentry();
        this.worker.closeSocket();
      }
      // if (typeof data === "string") {
      //   this.term.write(data);
      // } else {
      //   this.term.write(new Uint8Array(data));
      // }
    },
    getTheme() {
      let theme = {
        background: "#1c2431",
        foreground: "#cccccc",
        selectionBackground: "#399ef440",
        black: "#666666",
        blue: "#399ef4",
        brightBlack: "#666666",
        brightBlue: "#399ef4",
        brightCyan: "#21c5c7",
        brightGreen: "#4eb071",
        brightMagenta: "#b168df",
        brightRed: "#da6771",
        brightWhite: "#efefef",
        brightYellow: "#fff099",
        cyan: "#21c5c7",
        green: "#4eb071",
        magenta: "#b168df",
        red: "#da6771",
        white: "#efefef",
        yellow: "#fff099",
      };
      if (this.source.userSetting.theme == "light") {
        theme = {
          background: "#ffffff",
          foreground: "#333333",
          cursor: "#333333",
          cursorAccent: "#ffffff",
          selectionBackground: "#add6ff",
          black: "#000000",
          blue: "#0451a5",
          brightBlack: "#666666",
          brightBlue: "#0451a5",
          brightCyan: "#0598bc",
          brightGreen: "#14ce14",
          brightMagenta: "#bc05bc",
          brightRed: "#cd3131",
          brightWhite: "#a5a5a5",
          brightYellow: "#b5ba00",
          cyan: "#0598bc",
          green: "#00bc00",
          magenta: "#bc05bc",
          red: "#cd3131",
          white: "#555555",
          yellow: "#949800",
        };
      }
      return theme;
    },
    initTerm() {
      if (this.term != null) {
        this.term.dispose();
      }
      let box = this.$refs.terminalXtermBox;

      this.term = new Terminal({
        useStyle: true,
        cursorBlink: true, //光标闪烁
        cursorStyle: "underline", // 光标样式 'block' | 'underline' | 'bar'
        width: 500,
        height: 400,
        windowsMode: true,
        scrollback: 100000000, //终端中的回滚量
        // rows: this.rows, //行数
        // cols: this.cols, // 不指定行数，自动回车后光标从下一行开始
        convertEol: true, //启用时，光标将设置为下一行的开头
        // disableStdin: false, //是否应禁用输入
        // // cursorStyle: "underline", //光标样式
        theme: this.getTheme(),
        // theme: {
        //   foreground: "#ECECEC", //字体
        //   background: "#000000", //背景色
        //   cursor: "help", //设置光标
        //   lineHeight: 20,
        // },
      });
      this.term.setBindKeysBefore(this.bindKeysBefore);
      this.term.setBindKeysAfter(this.bindKeysAfter);

      this.fitAddon = new FitAddon();
      // window.term = this.term;
      this.term.loadAddon(this.fitAddon);

      this.canvasAddon = new CanvasAddon();
      this.term.loadAddon(this.canvasAddon);

      this.term.open(box, true);

      this.fitAddon.fit();

      this.term.focus();
      this.worker.cols = this.term.cols;
      this.worker.rows = this.term.rows;

      this.term.onData((data) => {
        if (this.checkIsExit(data)) {
          this.worker.sendDataToWS(data);
        }
      });
      // this.term.onBell((arg1, arg2, arg3) => {
      //   console.log("onBell:", arg1, arg2, arg3);
      // });
      this.term.onTitleChange((title) => {
        if (this.tool.isEmpty(title)) {
          return;
        }
        let ss = title.split("@");
        if (ss.length != 2) {
          return;
        }
        let user = ss[0].trim();
        ss = ss[1].split(":");
        if (ss.length != 2) {
          return;
        }
        let dir = ss[1].trim();
        if (this.tool.isEmpty(user) || this.tool.isEmpty(dir)) {
          return;
        }
        if (this.worker.userAndDirReadyIng) {
          return;
        }
        if (this.worker.lastUser == user && this.worker.lastDir == dir) {
          this.worker.userAndDirReady = true;
          return;
        }
        if (!this.worker.userAndDirReady) {
          this.worker.userAndDirReadyIng = true;
          this.worker.userAndDirReady = true;
          let command = ``;
          let lastUser = this.worker.lastUser;
          let lastDir = this.worker.lastDir;
          if (this.tool.isNotEmpty(lastUser) && lastUser != user) {
            if (user != "root") {
              command += "sudo -i" + "\n";
            }
            if (lastUser != "root") {
              command += "su " + lastUser + "\n";
            }
          }
          if (this.tool.isNotEmpty(lastDir) && lastDir != dir) {
            command += "cd " + lastDir + "\n";
          }
          if (this.tool.isEmpty(lastUser)) {
            this.worker.lastUser = user;
          }
          if (this.tool.isEmpty(lastDir)) {
            this.worker.lastDir = dir;
          }
          if (command != "") {
            this.worker.sendDataToWS(command);
            window.setTimeout(() => {
              delete this.worker.userAndDirReadyIng;
            }, 1000);
          } else {
            delete this.worker.userAndDirReadyIng;
          }
        } else {
          this.worker.lastUser = user;
          this.worker.lastDir = dir;
          var keyValueMap = {};
          keyValueMap["lastUser"] = user;
          keyValueMap["lastDir"] = dir;
          this.toolboxWorker.updateExtend(keyValueMap);
        }
      });
      // this.term.onLineFeed((arg1, arg2, arg3) => {
      //   console.log("onLineFeed:", arg1, arg2, arg3);
      // });
      // this.term.onCursorMove((arg1, arg2, arg3) => {
      //   console.log("onCursorMove:", arg1, arg2, arg3);
      // });
      // this.term.onWriteParsed((arg1, arg2, arg3) => {
      //   console.log("onWriteParsed:", arg1, arg2, arg3);
      // });
      // this.term.onRender((arg1, arg2, arg3) => {
      //   console.log("onRender:", arg1, arg2, arg3);
      // });
      this.term.onBinary((data) => {
        if (this.checkIsExit(data)) {
          this.worker.sendDataToWS(data);
        }
      });

      this.term.attachCustomKeyEventHandler((event) => {
        if (this.tool.keyIsCtrlV(event)) {
          return false;
        }
        return true;
      });
      // this.term.onKey((arg) => {
      //   console.log(arg);
      // });

      this.zsentry = this.NewSentry();

      this.terminal_back_width = this.tool
        .jQuery(this.$refs.terminalXtermBoxBack)
        .width();
      this.terminal_back_height = this.tool
        .jQuery(this.$refs.terminalXtermBoxBack)
        .height();

      this.changeSizeTimer();

      // this.xtermRows = box.getElementsByClassName("xterm-rows")[0];
    },
    bindKeysBefore() {
      // console.log("bindKeysBefore", this.term.textarea);
      // this.term.textarea.addEventListener(
      //   "copy",
      //   (ev) => {
      //     ev.stopPropagation();
      //     if (ev.clipboardData) {
      //       const text = ev.clipboardData.getData("text/plain");
      //       console.log("paste:", text);
      //     }
      //   },
      //   true
      // );
      // console.log(this.term);
      this.term.textarea.addEventListener(
        "paste",
        this.pasteEventListener,
        true
      );
      this.term.element.addEventListener(
        "paste",
        this.pasteEventListener,
        true
      );

      this.term.element.addEventListener("keydown", this.onKeydown, true);
      this.term.element.addEventListener("mouseup", this.onMouseup, true);
      this.term.element.addEventListener("mousedown", this.onMousedown, true);
      this.term.textarea.addEventListener(
        "contextmenu",
        this.onContextmenu,
        true
      );
      this.term.element.addEventListener(
        "contextmenu",
        this.onContextmenu,
        true
      );
      // window.term = this.term;
    },
    unbindTermEvent() {
      if (this.term) {
        this.term.textarea.removeEventListener(
          "paste",
          this.pasteEventListener
        );
        this.term.element.removeEventListener("paste", this.pasteEventListener);
        this.term.element.removeEventListener("keydown", this.onKeydown);
        this.term.element.removeEventListener("mouseup", this.onMouseup);
        this.term.element.removeEventListener("mousedown", this.onMousedown);
        this.term.textarea.removeEventListener(
          "contextmenu",
          this.onContextmenu
        );
        this.term.element.removeEventListener(
          "contextmenu",
          this.onContextmenu
        );
      }
    },
    pasteEventListener(ev) {
      // console.log("pasteEventListener", ev);
      this.tool.stopEvent();
      if (ev.clipboardData) {
        const text = ev.clipboardData.getData("text/plain");
        this.toPaste(text);
      } else {
        this.doEventPaste();
      }
    },
    bindKeysAfter() {
      // console.log("bindKeysAfter", this.term.textarea);
    },
    NewSentry() {
      let worker = this.worker;
      return new Zmodem.Sentry({
        // 发送终端
        // 发送的处理程序 到终端对象的流量。接收可迭代对象（例如，数组）包含八位字节数。
        to_terminal: (octets) => {
          this.term.write(octets);
        },
        // 属于 Zmodem 相关流
        // 处理程序检测事件。接收新的检测对象。
        on_detect: (detection) => {
          let zsession = detection.confirm();
          this.last_session = zsession;
          this.worker.isUploading = false;
          this.worker.isDownloading = false;
          if (zsession.type === "receive") {
            this.worker.isDownloading = true;
            this.$refs.Download.show(zsession, this.term, () => {
              this.worker.isDownloading = false;
              this.onFocus();
            });
          } else if (zsession.type === "send") {
            this.worker.isUploading = true;
            this.$refs.Upload.show(zsession, this.term, () => {
              this.worker.isUploading = false;
              this.onFocus();
            });
          }
          zsession.on("session_end", (arg) => {
            // console.log("zsession session_end", arg);
            this.worker.isUploading = false;
            this.worker.isDownloading = false;
            delete this.last_session;
          });
        },
        // 撤回
        // 于收回的处理程序事件。不接收任何输入
        on_retract: () => {
          console.log("on_retract 撤回");
        },
        // 将流量发送到的处理程序对等方。例如，如果您的应用程序使用 WebSocket 进行通信到对等方，使用它将数据发送到 WebSocket 实例。
        sender: async (octets) => {
          await worker.uploadSocketSend(octets);
        },
      });
    },
    checkIsExit(data) {
      if (this.worker.socket == null) {
        return false;
      }
      return true;
    },
    async onSocketOpen() {
      // const attachAddon = new AttachAddon(this.worker.socket);
      // this.term.loadAddon(attachAddon);
    },
    reconnect() {
      this.term.write("\r\n终端会话连接中，请稍后！\r\n");
      this.worker.refresh();
    },
    onSocketClose() {
      if (this.isDestroyed) {
        return;
      }
      this.term.write("\r\n终端会话已关闭，输入回车重新连接！\r\n");
      // this.worker.refresh();
    },
    onSocketError() {},
    async onKeydown(e) {
      // let key = arg.key;
      // console.log(key);
      if (this.tool.keyIsCtrlC(e)) {
        this.doEventCopy();
      } else if (this.tool.keyIsCtrlF(e)) {
        this.tool.stopEvent(e);
        // 搜索
        this.toShowSearch();
      } else {
        if (
          !this.tool.keyIsCtrl(e) &&
          !this.tool.keyIsShift(e) &&
          !this.tool.keyIsAlt(e)
        ) {
          if (this.worker.socket == null) {
            this.tool.stopEvent(e);

            if (this.worker.building) {
              return;
            }
            if (this.tool.keyIsEnter(e)) {
              this.term.write("\r\n终端会话连接中，请稍后！\r\n");
              this.worker.refresh();
              return;
            }
            this.term.write("\r\n终端会话已关闭，输入回车重新连接！\r\n");
            return;
          }
        }
        if (this.tool.keyIsCtrlV(e)) {
          // 已经监听了 粘贴 事件 所以 这里不用调用 粘贴
          // this.doEventPaste();
        }
      }
    },
    initNextHeaderHandler(session) {
      // session._next_header_handler = session._next_header_handler || {};
      // session._next_header_handler["ZRPOS"] = () => {
      //   this.initNextHeaderHandler(session);
      // };
      // session._next_header_handler["ZRPOS_HEADER"] = () => {
      //   this.initNextHeaderHandler(session);
      // };
    },
    async doEventCopy() {
      let copiedText = this.term.getSelection();
      if (this.tool.isNotEmpty(copiedText)) {
        this.tool.stopEvent();
        let res = await this.tool.clipboardWrite(copiedText);
        if (res.success) {
          // this.tool.success("复制成功");
        } else {
          this.tool.warn("复制失败，请允许访问剪贴板！");
        }
        this.term.select(0, 0, 0);
        this.term.focus();
      } else {
        if (this.worker.isDownloading) {
          this.$refs.Download.stop();
        }
        if (this.worker.isUploading) {
          this.$refs.Upload.stop();
        }
      }
    },
    async doEventPaste(options) {
      let readResult = await this.tool.readClipboardText(options);
      if (readResult.success) {
        if (this.tool.isNotEmpty(readResult.text)) {
          this.tool.stopEvent();
          this.toPaste(readResult.text);
        }
      } else {
        this.tool.warn("粘贴失败，请允许访问剪贴板！");
      }
    },
    toPaste(text) {
      if (this.tool.isEmpty(text)) {
        return;
      }
      if (text.indexOf("\n") >= 0) {
        text = text.replace(/(\r\n|\n|\r|↵)/g, `\n`);
        this.toolboxWorker.showConfirmPaste(
          text,
          (txt) => {
            txt = txt.replace(/(\r\n|\n|\r|↵)/g, `\n`);
            this.worker.sendDataToWS(txt);
            this.onFocus();
            // this.tool.success("粘贴成功");
          },
          () => {
            this.onFocus();
          }
        );
      } else {
        this.worker.sendDataToWS(text);
        // this.tool.success("粘贴成功");
      }
    },
    onKeyup(e) {},
    async onMousedown(e) {
      // let event = e || window.event;
      // this.tool.stopEvent(e);
      // console.log(event.button);
    },
    async onContextmenu(e) {
      let event = e || window.event;
      this.tool.stopEvent(event);
      let copiedText = this.term.getSelection();
      if (this.tool.isNotEmpty(copiedText)) {
        await this.doEventCopy();
      } else {
        this.doEventPaste({
          onClipboardFail: () => {
            this.tool.warn("剪切板访问失败，请使用`Ctrl + V`粘贴");
            this.term.focus();
          },
        });
      }
      this.term.focus();
    },
    async onMouseup(e) {},
    doChangeSize() {
      // console.log("doChangeSize");
      this.terminal_back_width = this.tool
        .jQuery(this.$refs.terminalXtermBoxBack)
        .width();
      this.terminal_back_height = this.tool
        .jQuery(this.$refs.terminalXtermBoxBack)
        .height();
      this.tool.jQuery(this.term.element).css({
        width: parseInt(this.terminal_back_width),
        height: parseInt(this.terminal_back_height),
      });
      this.fitAddon.fit();
      // console.log(this.term.element);

      if (
        this.term.cols != this.worker.cols ||
        this.term.rows != this.worker.rows
      ) {
        this.worker.cols = this.term.cols;
        this.worker.rows = this.term.rows;
        this.worker.changeSize();
      }
    },
    changeSizeTimer() {
      if (this.isDestroyed || this.changeSizeTimerIng) {
        return;
      }
      this.changeSizeTimerIng = true;

      this.$nextTick(() => {
        // console.log("listenResize");
        try {
          if (
            this.tool.jQuery(this.$refs.terminalXtermBoxBack).width() !=
              this.terminal_back_width ||
            this.tool.jQuery(this.$refs.terminalXtermBoxBack).height() !=
              this.terminal_back_height
          ) {
            this.doChangeSize();
          }
        } catch (e) {
        } finally {
          // 窗口尺寸变化时，终端尺寸自适应
          window.setTimeout(() => {
            this.changeSizeTimerIng = false;
            this.changeSizeTimer();
          }, 100);
        }
      });
    },
    async startSystemMonitor() {
      if (
        this.startSystemMonitorIng ||
        this.isDestroyed ||
        !this.terminalInfoOpen
      ) {
        return;
      }
      this.startSystemMonitorIng = true;
      try {
        await this.loadSystemMonitor();
      } catch (e) {
      } finally {
        this.startSystemMonitorIng = false;
        setTimeout(this.startSystemMonitor, 50000);
      }
    },
    async loadSystemMonitor() {
      if (this.systemInfo == null) {
        await this.loadSystemInfo();
      }
      if (this.systemInfo == null) {
        return;
      }
      // let data = await this.worker.systemMonitor();
      // console.log("systemMonitor:", data);
    },
    async loadSystemInfo() {
      this.systemInfoLoading = true;
      let data = await this.worker.systemInfo();
      if (data != null) {
        //data.monitorData = await this.worker.systemMonitor();
        if (data.disks != null) {
          data.disks.forEach((one) => {
            one.total = Number((one.total || 0) / 1024 / 1024 / 1024).toFixed(
              2
            );
            one.used = Number((one.used || 0) / 1024 / 1024 / 1024).toFixed(2);
            one.free = Number((one.free || 0) / 1024 / 1024 / 1024).toFixed(2);
            one.usedPercent = Number(one.usedPercent || 0).toFixed(2);
          });
        }
        if (data.memory != null) {
          data.memory.available = Number(
            (data.memory.available || 0) / 1024 / 1024 / 1024
          ).toFixed(2);
          data.memory.cached = Number(
            (data.memory.cached || 0) / 1024 / 1024 / 1024
          ).toFixed(2);
          data.memory.free = Number(
            (data.memory.free || 0) / 1024 / 1024 / 1024
          ).toFixed(2);
          data.memory.shared = Number(
            (data.memory.shared || 0) / 1024 / 1024 / 1024
          ).toFixed(2);
          data.memory.total = Number(
            (data.memory.total || 0) / 1024 / 1024 / 1024
          ).toFixed(2);
          data.memory.usedPercent = Number(
            ((data.memory.total - data.memory.free - data.memory.cached) *
              100) /
              data.memory.total
          ).toFixed(2);
        }
      }

      // console.log(data);

      this.systemInfo = data;
      this.systemInfoLoading = false;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.isDestroyed = true;
    if (this.term != null) {
      try {
        this.term.dispose();
      } catch (e) {}
    }
    this.worker.close();
    this.unbindDrapFTPEvent();
    this.unbindTermEvent();
    this.term = null;
    this.worker = null;
  },
};
</script>

<style>
.toolbox-terminal-box {
  width: 100%;
  height: 100%;
}

.toolbox-terminal-box .terminal-xterm-box {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.toolbox-terminal-box .terminal-xterm-box-back {
  width: calc(100% - 20px) !important;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: -1;
}

.toolbox-terminal-box .terminal-xterm-box .terminal {
  width: 100% !important;
  height: 100% !important;
}
.toolbox-terminal-box .terminal-xterm-box .xterm-viewport {
  width: 100% !important;
  background-color: transparent !important;
}
.toolbox-terminal-box .terminal-xterm-box .xterm-screen {
  width: calc(100% - 20px) !important;
  height: 100% !important;
  margin: 0px 5px;
}
.toolbox-terminal-box .terminal-xterm-box .xterm-text-layer {
  width: 100% !important;
}
.toolbox-terminal-box .terminal-xterm-box .xterm-selection-layer {
  width: 100% !important;
}
.toolbox-terminal-box .terminal-xterm-box .xterm-link-layer {
  width: 100% !important;
}
.toolbox-terminal-box .terminal-xterm-box .xterm-cursor-layer {
  width: 100% !important;
}

.toolbox-terminal-box
  .terminal-xterm-box
  .xterm
  .xterm-viewport::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.toolbox-terminal-box
  .terminal-xterm-box
  .xterm
  .xterm-viewport:hover::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.toolbox-terminal-box
  .terminal-xterm-box
  .xterm
  .xterm-viewport::-webkit-scrollbar-thumb {
  border-radius: 0px;
}
.toolbox-terminal-box
  .terminal-xterm-box
  .xterm
  .xterm-viewport::-webkit-scrollbar-track {
  border-radius: 0;
}

.toolbox-terminal-file-manager-box {
  position: absolute;
  right: 20px;
  bottom: 40px;
  transition: all 0s;
  transform: scale(0);
  z-index: -1;
}

.toolbox-terminal-file-manager-box.toolbox-terminal-file-manager-box-show {
  transform: scale(1);
  z-index: 10;
}
.toolbox-terminal-file-manager-box-top-line {
  position: absolute;
  top: 0px;
  left: -2px;
  right: -1px;
  margin-top: -2px;
  height: 2px;
  cursor: row-resize;
  z-index: 1;
}
.toolbox-terminal-file-manager-box-left-line {
  position: absolute;
  left: 0px;
  top: -2px;
  bottom: -1px;
  width: 2px;
  margin-left: -2px;
  cursor: col-resize;
  z-index: 1;
}

.toolbox-terminal-file-manager-box-header {
  height: 0px;
}
.toolbox-terminal-file-manager-box-body {
  height: calc(100% - 30px);
}

.terminal-search-box {
  position: absolute;
  right: 10px;
  top: 0px;
  height: 30px;
  background: #303030;
  z-index: 10;
  font-size: 12px;
  user-select: none;
}

.terminal-search-box .terminal-search-input {
  color: #ffffff;
  width: 200px;
  border: 1px solid #4e4e4e;
  background-color: transparent;
  height: 30px;
  line-height: 30px;
  padding-left: 5px;
  padding-right: 5px;
  box-sizing: border-box;
  outline: none;
  font-size: 13px;
  margin: 0px 5px 0px 0px;
  user-select: text;
  vertical-align: 1px;
}
.terminal-search-box .terminal-search-text {
  line-height: 30px;
  vertical-align: 0px;
}

.terminal-search-box .terminal-search-navs {
  line-height: 30px;
  padding-right: 5px;
}
.terminal-search-box .terminal-search-navs .terminal-search-nav {
  font-size: 16px;
  padding: 0px 2px;
  cursor: pointer;
  line-height: 30px;
  vertical-align: -1px;
}

.system-info-line {
  display: flex;
}

.system-info-line .system-info-lable {
  width: 60px;
  text-align: right;
  padding-right: 5px;
}

.system-info-line .system-info-value {
  flex: 1;
  overflow: hidden;
  word-wrap: break-word;
}
</style>
