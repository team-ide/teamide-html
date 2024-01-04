<template>
  <div id="app">
    <template v-if="source.ready">
      <InfoBox :source="source"></InfoBox>
      <SystemInfoBox :source="source"></SystemInfoBox>
      <AlertBox :source="source"></AlertBox>
      <div class="workspace-page" v-if="openWorkspace">
        <Workspace :source="source"> </Workspace>
      </div>
      <DialogPage :source="source" v-if="openDialogPage"> </DialogPage>

      <Login v-show="source.login.show" :source="source"></Login>
      <Register v-show="source.register.show" :source="source"></Register>
      <UpdateCheck :source="source" v-if="openWorkspace"></UpdateCheck>
    </template>
    <template v-else>
      <div v-if="source.status == 'connecting'"></div>
      <div v-if="source.status == 'connected'"></div>
      <div
        v-if="source.status == 'error'"
        style="
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0px;
          background: #454a4e;
          color: #e61d1d;
        "
      >
        <h4 style="padding: 20px 20px; font-size: 25px">服务器连接异常！</h4>
        <hr />
        <p style="padding: 20px 20px; font-size: 20px">我们很遗憾的通知您：</p>
        <p style="text-indent: 60px; margin-top: 10px; font-size: 20px">
          服务器暂时无法正常访问，请您不要着急，我们正在紧急修复中！！！
        </p>
      </div>
    </template>
    <Contextmenu :contextmenu="contextmenu" ref="Contextmenu"></Contextmenu>
    <JSONDataDialog :source="source"></JSONDataDialog>
    <MarkdownDialog :source="source"></MarkdownDialog>
    <MarkdownViewDialog :source="source"></MarkdownViewDialog>
    <JavascriptFuncDialog :source="source"></JavascriptFuncDialog>
    <JavascriptExampleDialog :source="source"></JavascriptExampleDialog>
    <TextDialog :source="source"></TextDialog>
    <CommonFormDialog :source="source"></CommonFormDialog>
    <div class="editor-for-copy" ref="editorForCopy"></div>
  </div>
</template>

<script>
import source from "@/source";

import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import UpdateCheck from "@/views/UpdateCheck.vue";
import Workspace from "@/views/workspace/Index.vue";

import DialogPage from "@/views/dialog/Page";

import JSONDataDialog from "@/views/dialog/JSONDataDialog";
import MarkdownDialog from "@/views/dialog/MarkdownDialog";
import MarkdownViewDialog from "@/views/dialog/MarkdownViewDialog";
import JavascriptFuncDialog from "@/views/dialog/JavascriptFuncDialog";
import JavascriptExampleDialog from "@/views/dialog/JavascriptExampleDialog";
import TextDialog from "@/views/dialog/TextDialog";
import CommonFormDialog from "@/views/dialog/CommonFormDialog";

export default {
  components: {
    Login,
    Register,
    UpdateCheck,
    JSONDataDialog,
    MarkdownDialog,
    MarkdownViewDialog,
    JavascriptFuncDialog,
    JavascriptExampleDialog,
    TextDialog,
    Workspace,
    DialogPage,
    CommonFormDialog,
  },
  props: [],
  data() {
    return {
      source,
      contextmenu: { menus: [] },
      openWorkspace: false,
      openDialogPage: false,
    };
  },
  computed: {},
  watch: {
    "source.ready"() {
      if (!this.source.ready) {
        return;
      }
      if (this.source.login.user == null) {
        this.tool.toLogin();
      }
    },
    "source.login.user"() {
      if (this.source.login.user == null) {
        if (this.source.login.userId != null) {
          this.source.login.userId = null;
        }
      } else {
        if (this.source.login.userId != this.source.login.user.userId) {
          this.source.login.userId = this.source.login.user.userId;
        }
      }
    },
  },
  methods: {
    async init() {
      if (this.$route.path == "/dialog") {
        this.openDialogPage = true;
      } else {
        this.openWorkspace = true;
      }
      if (!this.openWorkspace) {
        if (this.$route.query.mainWindowKey) {
          this.source.isOtherWindow = true;
          this.source.mainWindowKey = this.$route.query.mainWindowKey;
          let jwt = await this.tool.electronGetCache(source.mainWindowKey);
          this.tool.setJWT(jwt);
        }
      }
      await this.tool.initSession();
      this.tool.newDialogWindow = async (options) => {
        options = options || {};
        options.windowKey = this.tool.generatekey(20);
        options.url = this.source.url + "#/dialog?type=" + options.type;
        options.url += "&mainWindowKey=" + this.source.mainWindowKey;
        options.url += "&windowKey=" + options.windowKey;
        if (options.title) {
          options.url += "&title=" + options.title;
        }
        if (options.cacheKey) {
          options.url += "&cacheKey=" + options.cacheKey;
        }
        if (options.listenKeys) {
          options.url += "&listenKeys=" + JSON.stringify(options.listenKeys);
        }
        return await this.tool.electronDo({
          method: "new-window",
          options: options,
        });
      };
      this.tool.newWindow = async (options) => {
        options = options || {};
        return await this.tool.electronDo({
          method: "new-window",
          options: options,
        });
      };

      // this.tool.copyByEditor = (text) => {
      //   if (this.monacoInstance == null) {
      //     let monaco = window.monaco;
      //     this.monacoInstance = monaco.editor.create(this.$refs.editorForCopy, {
      //       theme: "vs-dark", //官方自带三种主题vs, hc-black, or vs-dark
      //       minimap: { enabled: false }, // 缩略导航
      //       value: "", //编辑器初始显示文字
      //       language: "html",
      //       selectOnLineNumbers: false, //显示行号
      //       roundedSelection: false,
      //       cursorStyle: "line", //光标样式
      //       automaticLayout: false, //自动布局
      //       glyphMargin: false, //字形边缘
      //       useTabStops: false,
      //       fontSize: 13, //字体大小
      //       autoIndent: false, //自动布局
      //       // quickSuggestionsDelay: 500, //代码提示延时
      //       contextmenu: false,
      //     });
      //   }
      //   this.monacoInstance.setValue(text || "");
      //   this.monacoInstance.setSelection({
      //     startLineNumber: 0,
      //     startColumn: 0,
      //     endLineNumber: 999999,
      //     endColumn: 999999,
      //   });
      //   let action = this.monacoInstance.getAction(
      //     "editor.action.clipboardCopyWithSyntaxHighlightingAction"
      //   );
      //   if (action) {
      //     action.run();
      //     return { success: true };
      //   } else {
      //     return { success: false };
      //   }
      // };
    },
    showContextmenu(menus) {
      let e = window.event;
      this.tool.stopEvent(e || window.event);
      this.contextmenu.menus = menus;
      this.$refs.Contextmenu.show(e);
    },
    onKeyDown(event) {
      event = event || window.event;
      if (this.tool.keyIsCtrlS(event)) {
        this.tool.stopEvent(event);
      }
    },
    onKeyUp(event) {
      event = event || window.event;
      if (this.source.eventIsUserKey(event)) {
        this.tool.stopEvent(event);
        return;
      }
      if (this.tool.keyIsCtrlS(event)) {
        this.tool.stopEvent(event);
      }
    },
    bindEvent() {
      if (this.bindEvented) {
        return;
      }
      this.bindEvented = true;
      window.addEventListener("keydown", (e) => {
        this.onKeyDown(e);
      });
      window.addEventListener("keyup", (e) => {
        this.onKeyUp(e);
      });
      window.document.body.addEventListener("contextmenu", (e) => {
        let tags = ["input", "textarea", "canvas"];
        if (tags.indexOf(("" + e.target.tagName).toLowerCase()) >= 0) {
          return;
        }
        this.tool.stopEvent(e || window.event);
        // this.showContextmenu([{text:"测试菜单"}])
      });
    },
  },
  // 在实例创建完成后被立即调用
  created() {},
  updated() {
    this.tool.showContextmenu = this.showContextmenu;
  },
  // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用
  mounted() {
    this.tool.showContextmenu = this.showContextmenu;
    this.bindEvent();
    this.init();
  },
  beforeDestroy() {},
};
</script>

<style>
html,
body {
  height: 100%;
  width: 100%;
  user-select: none;
  padding: 0px;
  margin: 0px;
}
#app {
  user-select: none;
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0px;
}
*,
:after,
:before {
  box-sizing: border-box;
}
.el-message {
  user-select: text;
}
.el-message-box {
  user-select: text;
}

.tm-link {
  text-decoration: none !important; /* 去除默认的下划线 */
}
.mdi {
  vertical-align: middle;
}
.editor-for-copy {
  transform: scale(0);
  width: 100px;
  height: 100px;
}

.workspace-page {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  position: relative;
}

.app-dialog {
  user-select: text;
}
.app-dialog.el-dialog__wrapper {
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
}
.app-dialog.el-dialog__wrapper .el-dialog.is-fullscreen .el-dialog__header {
  padding: 15px 10px 5px;
}
.app-dialog.el-dialog__wrapper .el-dialog.is-fullscreen .el-dialog__body {
  height: calc(100% - 44px);
  padding: 0px;
  overflow: auto;
}
</style>
