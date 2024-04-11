<template>
  <div class="toolbox-terminal-box toolbox-connection-box">
    <div style="height: calc(100% - 120px); display: flex">
      <div style="height: 100%; flex: 1; overflow: hidden">
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
    <div style="height: 120px; overflow: hidden">
      <div
        style="
          width: calc(100% - 80px);
          overflow: hidden;
          display: inline-block;
        "
      >
        <textarea
          v-model="commandText"
          placeholder="请输入发送的指令"
          style="height: 116px; width: 100%; resize: none"
        ></textarea>
      </div>
      <div
        class="pdt-10 text-center"
        style="
          width: 80px;
          overflow: hidden;
          display: inline-block;
          float: right;
        "
      >
        <div class="tm-btn tm-btn-sm bg-green mgl-0 mgt-5" @click="sendCommand()">发送</div>
        <div class="tm-btn tm-btn-sm bg-orange mgl-0 mgt-5" @click="reconnect()">重连</div>
        <div class="tm-btn tm-btn-sm bg-grey mgl-0 mgt-5" @click="termClean()">清屏</div>
      </div>
    </div>
  </div>
</template>


<script>
import _worker from "./worker.js";
import "teamide-xterm/css/xterm.css";
import { Terminal } from "teamide-xterm";
import { FitAddon } from "teamide-xterm-addon-fit";
import { SearchAddon } from "teamide-xterm-addon-search";
import { CanvasAddon } from "teamide-xterm-addon-canvas";

// import { AttachAddon } from "teamide-xterm-addon-attach";

// https://juejin.cn/post/6918911964009725959

export default {
  components: {},
  props: ["source", "toolboxWorker", "extend"],
  data() {
    let worker = _worker.newWorker({
      toolboxWorker: this.toolboxWorker,
      onSocketOpen: this.onSocketOpen,
      onSocketClose: this.onSocketClose,
      onSocketError: this.onSocketError,
      onSocketData: this.onSocketData,
    });
    return {
      worker: worker,
      commandText: "",

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
  },
  methods: {
    async init() {
      this.$nextTick(() => {
        this.initTerm();
        this.worker.init();
      });
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
    termClean() {
      this.term.clear();
    },
    sendCommand() {
      let commandText = this.commandText || "";
      commandText += "\n";
      this.commandText = "";
      this.term.write(commandText);
      this.worker.sendDataToWS(commandText);
    },
    onSocketData(data) {
      if (typeof data === "string") {
        this.term.write(data);
      } else {
        this.term.write(new Uint8Array(data));
      }
    },
    getTheme() {
      let theme = {
        background: "#2a2a2a",
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
      let color = this.source.userSetting.terminalBackgroudColor;
      if (
        this.tool.isEmpty(color) &&
        this.source.cssData &&
        this.source.cssData.bodyBackgroudColor6
      ) {
        color = this.source.cssData.bodyBackgroudColor6;
      }

      if (this.tool.isNotEmpty(color)) {
        theme.background = color;
      }
      return theme;
    },
    initTerm() {
      if (this.term != null) {
        this.term.dispose();
      }
      let box = this.$refs.terminalXtermBox;
      let terminalScrollback = 10000;
      if (
        this.source.userSetting &&
        this.source.userSetting.terminalScrollback
      ) {
        terminalScrollback = Number(this.source.userSetting.terminalScrollback);
      }
      if (terminalScrollback < 0) {
        terminalScrollback = 10000;
      }

      this.term = new Terminal({
        logLevel: "error",
        useStyle: true,
        cursorBlink: false, //光标闪烁
        cursorStyle: "bar", // 光标样式 'block' | 'underline' | 'bar'
        windowsMode: true,
        disableStdin: true, //是否应禁用输入
        scrollback: terminalScrollback, //终端中的回滚量
        // rows: this.rows, //行数
        // cols: this.cols, // 不指定行数，自动回车后光标从下一行开始
        convertEol: true, //启用时，光标将设置为下一行的开头
        // disableStdin: false, //是否应禁用输入
        // // cursorStyle: "underline", //光标样式
        theme: this.getTheme(),
      });
      this.term.setBindKeysBefore(this.bindKeysBefore);
      this.term.setBindKeysAfter(this.bindKeysAfter);

      this.fitAddon = new FitAddon();
      window.term = this.term;
      this.term.loadAddon(this.fitAddon);

      this.canvasAddon = new CanvasAddon();
      this.term.loadAddon(this.canvasAddon);

      this.term.open(box, true);

      this.fitAddon.fit();

      this.term.focus();
      this.worker.cols = this.term.cols;
      this.worker.rows = this.term.rows;

      this.term.onData((data) => {
        console.log("onData", data);
        if (this.checkIsExit(data)) {
          if (typeof data === "string") {
            if (data == "\r") {
              data = "\r\n";
            }
            this.term.write(data);
          } else {
            this.term.write(new Uint8Array(data));
          }
          this.worker.sendDataToWS(data);
        }
      });
      // if (this.term.onBell) {
      //   this.term.onBell((arg1, arg2, arg3) => {
      //     console.log("onBell:", arg1, arg2, arg3);
      //   });
      // }
      if (this.term.onLineFeed) {
        this.term.onLineFeed(() => {});
      }

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
    bindKeysAfter() {
      // console.log("bindKeysAfter", this.term.textarea);
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
      }
    },
    writeCommand(txt) {
      this.worker.sendDataToWS(txt);
      this.onFocus();
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
        // this.worker.changeSize();
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
          }, 300);
        }
      });
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.isDestroyed = true;
    let t = this.term;
    this.term = null;
    if (t != null) {
      try {
        t.dispose();
      } catch (e) {}
    }
    this.worker.close();
    this.unbindTermEvent();
    this.term = null;
    this.worker = null;
  },
};
</script>

<style>
.toolbox-connection-box .xterm-helpers .xterm-helper-textarea {
  display: none;
}
</style>
