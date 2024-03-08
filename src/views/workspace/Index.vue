<template>
  <div
    class="workspace-container"
    :class="{
      'workspace-theme-dark': theme.isDark,
      'workspace-theme-light': !theme.isDark,
    }"
  >
    <Header
      ref="Header"
      :source="source"
      :mainItemsWorker="mainItemsWorker"
      :showTabGroupTitle="showTabGroupTitle"
    >
    </Header>
    <div class="workspace-main">
      <div class="workspace-main-tabs-container">
        <WorkspaceTabs
          ref="WorkspaceTabs"
          :source="source"
          :itemsWorker="mainItemsWorker"
          :onSequenceChange="onSequenceChange"
        >
        </WorkspaceTabs>
      </div>
      <div class="workspace-main-spans-container">
        <WorkspaceSpans :source="source" :itemsWorker="mainItemsWorker">
          <template v-slot:span="{ item }">
            <template v-if="item.isToolbox">
              <ToolboxEditor
                :source="source"
                :toolboxType="item.toolboxType"
                :toolboxId="item.toolboxId"
                :openId="item.openId"
                :extend="item.extend"
                :item="item"
              >
              </ToolboxEditor>
            </template>
          </template>
        </WorkspaceSpans>
      </div>
    </div>
    <ToolboxContext
      :source="source"
      :openByOption="openByOption"
    ></ToolboxContext>
    <OtherServer v-if="source.hasElectron" :source="source"></OtherServer>
  </div>
</template>

<script>
import ToolboxContext from "./ToolboxContext";
import OtherServer from "./OtherServer";
import Header from "./Header";
import themeCustom from "./theme-custom.js";

import "./theme-dark.css";
import "./theme-light.css";

export default {
  components: { ToolboxContext, OtherServer, Header },
  props: ["source"],
  data() {
    let mainItemsWorker = this.tool.newItemsWorker({
      onRemoveItem: this.onMainRemoveItem,
      onActiveItem: this.onMainActiveItem,
      toCopyItem: this.toMainCopyItem,
    });
    return {
      mainItemsWorker: mainItemsWorker,
      showTabGroupTitle: "",
      theme: {
        isDark: true,
      },
    };
  },
  computed: {},
  watch: {
    "source.login.userId"() {
      this.initUserData();
    },
    "source.userSetting.theme"() {
      this.initTheme();
    },
    "source.userSetting.color"() {
      this.initStyle();
    },
    "source.userSetting.backgroudColor"() {
      this.initStyle();
    },
    "source.userSetting.headerColor"() {
      this.initStyle();
    },
    "source.userSetting.headerBackgroudColor"() {
      this.initStyle();
    },
    "source.userSetting.headerTabColor"() {
      this.initStyle();
    },
    "source.userSetting.headerTabBackgroudColor"() {
      this.initStyle();
    },
    "source.userSetting.bodyColor"() {
      this.initStyle();
    },
    "source.userSetting.bodyBackgroudColor"() {
      this.initStyle();
    },
    "source.userSetting.bodyTabColor"() {
      this.initStyle();
    },
    "source.userSetting.bodyTabBackgroudColor"() {
      this.initStyle();
    },
    "source.userSetting.mainWindowAlwaysOnTop"() {
      this.initMainWindow();
    },
  },
  methods: {
    async initMainWindow() {
      if (this.tool.electronDo) {
        await this.tool.electronDo({
          method: "script-execute",
          script:
            `context.window.mainWindow.setAlwaysOnTop(` +
            this.source.userSetting.mainWindowAlwaysOnTop +
            `);`,
        });
        // console.log("script-execute result:", res);
      }
    },
    initStyle() {
      let cssData = {};
      let styleText = themeCustom.css;
      let userSetting = this.source.userSetting;
      if (this.tool.isNotEmpty(userSetting.color)) {
        // cssData["color"] = userSetting.color;
        cssData["headerColor"] = userSetting.color;
        cssData["headerTabColor"] = userSetting.color;
        cssData["bodyColor"] = userSetting.color;
        cssData["bodyTabColor"] = userSetting.color;
      }
      if (this.tool.isNotEmpty(userSetting.backgroudColor)) {
        // cssData["backgroudColor"] = userSetting.backgroudColor;
        cssData["headerBackgroudColor"] = userSetting.backgroudColor;
        cssData["headerTabBackgroudColor"] = userSetting.backgroudColor;
        cssData["bodyBackgroudColor"] = userSetting.backgroudColor;
        cssData["bodyTabBackgroudColor"] = userSetting.backgroudColor;
      }
      if (this.tool.isNotEmpty(userSetting.headerColor)) {
        cssData["headerColor"] = userSetting.headerColor;
      }
      if (this.tool.isNotEmpty(userSetting.headerBackgroudColor)) {
        cssData["headerBackgroudColor"] = userSetting.headerBackgroudColor;
      }
      if (this.tool.isNotEmpty(userSetting.headerTabColor)) {
        cssData["headerTabColor"] = userSetting.headerTabColor;
      }
      if (this.tool.isNotEmpty(userSetting.headerTabBackgroudColor)) {
        cssData["headerTabBackgroudColor"] =
          userSetting.headerTabBackgroudColor;
      }
      if (this.tool.isNotEmpty(userSetting.bodyColor)) {
        cssData["bodyColor"] = userSetting.bodyColor;
      }
      if (this.tool.isNotEmpty(userSetting.bodyBackgroudColor)) {
        cssData["bodyBackgroudColor"] = userSetting.bodyBackgroudColor;
      }

      if (this.tool.isNotEmpty(userSetting.bodyTabColor)) {
        cssData["bodyTabColor"] = userSetting.bodyTabColor;
      }
      if (this.tool.isNotEmpty(userSetting.bodyTabBackgroudColor)) {
        cssData["bodyTabBackgroudColor"] = userSetting.bodyTabBackgroudColor;
      }
      Object.keys(cssData).forEach((k) => {
        let v = cssData[k];
        let color = this.tool.style.addColor(v);
        if (color) {
          color.colors.forEach((one, inde) => {
            cssData[k + inde] = one;
            styleText = styleText.replaceAll(k + inde, one);
          });
        }
        styleText = styleText.replaceAll(k, v);
      });
      this.source.cssData = cssData;
      let dom = this.tool._userStyleDom;
      if (this.tool._userStyleDom == null) {
        dom = document.createElement("style");
        this.tool._userStyleDom = dom;
        dom.setAttribute("type", "text/css");
        document.head.appendChild(dom);
      } else {
      }
      dom.childNodes.forEach((one) => {
        dom.removeChild(one);
      });
      let textNode = document.createTextNode("");
      dom.appendChild(textNode);
      textNode.appendData(styleText);
    },
    initTheme() {
      this.theme.isDark = this.source.userSetting.theme == "dark";
    },
    async initUserData() {
      await this.initOpens();
      this.initShowTabGroup();
    },
    init() {
      this.initMainWindow();
      this.initStyle();
      this.initTheme();
      this.initUserData();

      this.source.workspaceTabClose = () => {
        if (this.mainItemsWorker.activeItem) {
          this.mainItemsWorker.toRemoveItem(this.mainItemsWorker.activeItem);
        }
      };
      this.source.workspaceSwitchTabUp = () => {
        this.mainItemsWorker.activeUpItem();
      };
      this.source.workspaceSwitchTabDown = () => {
        this.mainItemsWorker.activeDownItem();
      };
    },
    initShowTabGroup() {
      var isShowAll = false;
      var showToolboxTypes = [];
      var showToolboxGroups = [];
      let names = [];
      this.source.showTabGroups.forEach((one) => {
        if (!one.select) {
          return;
        }
        names.push(one.name);
        if (one.isAll) {
          isShowAll = true;
        } else if (one.isToolboxType) {
          showToolboxTypes.push(one.value);
        } else if (one.isToolboxGroup) {
          showToolboxGroups.push(one.value);
        }
      });
      let showTabGroupTitle = names.join(" | ");
      if (this.showTabGroupTitle == showTabGroupTitle) {
        return;
      }
      this.showTabGroupTitle = names.join(" | ");
      this.mainItemsWorker.items.forEach((one) => {
        if (isShowAll) {
          one.show = true;
        } else if (showToolboxTypes.indexOf(one.toolboxType) >= 0) {
          one.show = true;
        } else if (showToolboxGroups.indexOf(one.toolboxGroupId) >= 0) {
          one.show = true;
        } else {
          one.show = false;
        }
      });
      this.$refs.WorkspaceTabs.initTabs();
    },
    changeShowTabGroup(tabGroup) {
      if (tabGroup.isAll) {
        this.source.showTabGroups.forEach((one) => {
          if (!one.isAll) {
            one.select = false;
          } else {
            one.select = true;
          }
        });
      } else {
        tabGroup.select = !tabGroup.select;
        this.source.showTabGroups.forEach((one) => {
          if (one.isAll) {
            one.select = false;
          }
        });
      }
      let hasSelect = false;
      this.source.showTabGroups.forEach((one) => {
        if (one.select) {
          hasSelect = true;
        }
      });
      if (!hasSelect) {
        this.source.showTabGroups.forEach((one) => {
          if (one.isAll) {
            one.select = true;
          }
        });
      }
      this.initShowTabGroup();
      this.tool.hideToolboxContext();
    },
    async onSequenceChange(openItem, sequence) {
      if (openItem) {
        let res = await this.server.toolbox.updateOpenSequence({
          openId: openItem.openId,
          sequence: sequence,
        });
        if (res.code != 0) {
          this.tool.error(res.msg);
        }
      }
    },
    openNodeContext() {
      this.tool.openByOption({
        extend: {
          toolboxType: "node",
          type: "node-context",
          title: "节点",
          onlyOpenOneKey: "node:node-context",
        },
      });
    },
    openNodeNetProxyContext() {
      this.tool.openByOption({
        extend: {
          toolboxType: "node",
          type: "net-proxy-context",
          title: "网络透传",
          onlyOpenOneKey: "node:net-proxy-context",
        },
      });
    },
    openPage(page, title, extend) {
      extend = extend || {};
      extend.toolboxType = "page";
      extend.page = page;
      extend.title = title;
      if (extend.onlyOpenOneKey == null) {
        extend.onlyOpenOneKey = "page:" + page;
      }
      this.tool.openByOption({
        extend: extend,
      });
    },
    openTerminal(place, placeData) {
      let options = {};
      let extend = {
        toolboxType: "terminal",
        place: place,
        title: null,
        placeId: null,
      };
      if (place == "local") {
        extend.title = "终端-本地";
      } else if (place == "ssh") {
        extend.title = "" + placeData.name;
        extend.placeId = "" + placeData.toolboxId;
        options.toolboxId = placeData.toolboxId;
      } else if (place == "node") {
        extend.title = "" + placeData.name;
        extend.placeId = "" + placeData.serverId;
      } else {
        this.tool.error("暂不支持该配置作为终端");
        return;
      }
      options.extend = extend;
      this.tool.openByOption(options);
      this.$refs.Header.$refs.terminalDropdown &&
        this.$refs.Header.$refs.terminalDropdown.hide();
    },
    openFileManager(place, placeData) {
      let options = {};
      let extend = {
        toolboxType: "file-manager",
        place: place,
        title: null,
        placeId: null,
      };
      if (place == "local") {
        extend.title = "文件管理器-本地";
      } else if (place == "ssh") {
        extend.title = "" + placeData.name;
        extend.placeId = "" + placeData.toolboxId;
        options.toolboxId = placeData.toolboxId;
      } else if (place == "node") {
        extend.title = "" + placeData.name;
        extend.placeId = "" + placeData.serverId;
      } else {
        this.tool.error("暂不支持该配置作为文件管理器");
        return;
      }
      options.extend = extend;
      this.tool.openByOption(options);
      this.$refs.Header.$refs.fileManagerDropdown &&
        this.$refs.Header.$refs.fileManagerDropdown.hide();
    },
    addMainItem(item, fromItem) {
      this.mainItemsWorker.addItem(item, fromItem);
    },
    toMainActiveItem(item) {
      this.mainItemsWorker.toActiveItem(item);
    },
    getMainItems() {
      return this.mainItemsWorker.items || [];
    },
    toMainCopyItem(item) {
      let options = {
        fromItem: item,
        sequence: item.sequence,
        extend: item.extend,
      };
      if (this.tool.isNotEmpty(item.toolboxId)) {
        options.toolboxId = item.toolboxId;
      }
      this.openByOption(options);
    },
    async openByOption(options) {
      options = options || {};
      let extend = options.extend || {};
      if (options.toolboxId == null) {
        if (
          extend == null ||
          Object.keys(extend) == 0 ||
          this.tool.isEmpty(extend.toolboxType)
        ) {
          this.tool.error("根据扩展打开需要配置类型");
          return;
        }
        if (this.tool.isEmpty(extend.title)) {
          this.tool.error("根据扩展打开需要配置标题");
          return;
        }
      }
      if (this.tool.isNotEmpty(extend.onlyOpenOneKey)) {
        let items = this.getMainItems() || [];
        let find = null;
        items.forEach((item) => {
          if (
            item &&
            item.extend &&
            item.extend.onlyOpenOneKey == extend.onlyOpenOneKey
          ) {
            find = item;
          }
        });
        if (find != null) {
          this.toMainActiveItem(find);
          return;
        }
      }
      let param = {
        extend: JSON.stringify(extend || {}),
      };
      if (options.toolboxId) {
        param.toolboxId = options.toolboxId;
      }
      if (options.sequence) {
        param.sequence = options.sequence;
      }
      let res = await this.server.toolbox.open(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        let openData = res.data.open;
        let item = this.addMainItemByOpen(openData, options.fromItem);
        if (item != null) {
          this.$nextTick(() => {
            this.toMainActiveItem(item);
          });
        }
      }
    },
    addMainItemByOpen(open, fromItem) {
      let item = {};
      item.key = open.openId;
      item.name = open.toolboxName;
      item.title = open.toolboxName;
      item.show = true;
      item.isToolbox = true;
      item.toolboxType = open.toolboxType;
      item.toolboxId = open.toolboxId;
      item.toolboxGroupId = open.toolboxGroupId;
      item.sequence = open.sequence;
      item.extend = this.tool.getOptionJSON(open.extend);

      if (this.tool.isNotEmpty(item.extend.title)) {
        item.title = item.extend.title;
      }
      if (this.tool.isNotEmpty(item.extend.name)) {
        item.name = item.extend.name;
      }
      if (this.tool.isNotEmpty(item.extend.toolboxType)) {
        item.toolboxType = item.extend.toolboxType;
      }

      item.openId = open.openId;
      switch (item.toolboxType) {
        case "database":
          item.iconFont = "teamide-database";
          break;
        case "redis":
          item.iconFont = "teamide-redis";
          break;
        case "elasticsearch":
          item.iconFont = "teamide-elasticsearch";
          break;
        case "zookeeper":
          item.iconFont = "teamide-zookeeper";
          break;
        case "kafka":
          item.iconFont = "teamide-kafka";
          break;
        case "mongodb":
          item.iconFont = "teamide-mongodb";
          break;
        case "thrift":
          item.iconFont = "teamide-thrift";
          break;
        case "ssh":
          item.icon = "mdi-console";
          if (item.extend && item.extend.isFTP) {
            item.icon = "mdi-folder";
          }
          break;
        case "other":
          break;
        default:
          if (item.extend) {
            if (item.extend.toolboxType == "file-manager") {
              item.icon = "mdi-folder";
            } else if (item.extend.toolboxType == "terminal") {
              item.icon = "mdi-console";
            }
          }
      }
      this.addMainItem(item, fromItem);
      open.item = item;
      return item;
    },
    async initOpens() {
      let opens = [];
      if (this.source.login.user != null) {
        let res = await this.server.toolbox.queryOpens({});
        if (res.code != 0) {
          this.tool.error(res.msg);
        } else {
          opens = res.data.opens || [];
        }
      }
      opens.forEach((one) => {
        this.addMainItemByOpen(one);
      });
      // 激活最后
      let activeOpen = null;
      opens.forEach(async (one) => {
        if (activeOpen == null) {
          activeOpen = one;
        } else {
          if (
            new Date(one.openTime).getTime() >
            new Date(activeOpen.openTime).getTime()
          ) {
            activeOpen = one;
          }
        }
      });
      if (activeOpen != null) {
        this.toMainActiveItem(activeOpen.item);
      } else {
        if (this.source.login.user != null) {
          this.tool.showToolboxContext();
        }
      }
    },
    async onMainActiveItem(item) {
      if (item == null || this.tool.isEmpty(item.openId)) {
        return;
      }
      let res = await this.server.toolbox.open({
        openId: item.openId,
      });
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      this.tool.hideToolboxContext();
    },
    async onMainRemoveItem(item) {
      if (item == null || this.tool.isEmpty(item.openId)) {
        return;
      }
      let res = await this.server.toolbox.close({
        openId: item.openId,
      });
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      if (this.getMainItems().length == 0) {
        if (this.source.login.user != null) {
          this.tool.showToolboxContext();
        }
      }
    },
  },
  created() {},
  updated() {
    this.tool.openByOption = this.openByOption;
    this.tool.openPage = this.openPage;
    this.tool.openTerminal = this.openTerminal;
    this.tool.openFileManager = this.openFileManager;
    this.tool.openNodeNetProxyContext = this.openNodeNetProxyContext;
    this.tool.openNodeContext = this.openNodeContext;
    this.tool.changeShowTabGroup = this.changeShowTabGroup;
  },
  mounted() {
    this.tool.openByOption = this.openByOption;
    this.tool.openPage = this.openPage;
    this.tool.openTerminal = this.openTerminal;
    this.tool.openFileManager = this.openFileManager;
    this.tool.openNodeNetProxyContext = this.openNodeNetProxyContext;
    this.tool.openNodeContext = this.openNodeContext;
    this.tool.changeShowTabGroup = this.changeShowTabGroup;

    this.init();
  },
};
</script>

<style>
.workspace-container {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  position: relative;
}
.workspace-header {
  width: 100%;
  height: 30px;
  margin: 0px;
  padding: 0px;
  position: relative;
}
.workspace-main {
  width: 100%;
  height: calc(100% - 30px);
  margin: 0px;
  padding: 0px;
  position: relative;
}
.workspace-main-tabs-container {
  width: 100%;
  height: 30px;
  position: relative;
}
.workspace-main-spans-container {
  width: 100%;
  height: calc(100% - 30px);
  position: relative;
}
.workspace-header-nav-box {
  height: 100%;
  align-items: center;
  display: flex;
  white-space: nowrap;
  padding: 0px 0px;
}
.workspace-header-title {
  font-size: 15px;
  font-weight: 600;
  padding: 0px 10px;
  cursor: pointer;
}
.workspace-header-nav {
  height: 100%;
  font-size: 12px;
  padding: 0px 10px;
  cursor: pointer;
  white-space: nowrap;
  align-items: center;
  display: flex;
}

.workspace-header-dropdown.el-dropdown {
  color: unset;
  font-size: unset;
  display: flex;
  white-space: nowrap;
  align-items: center;
}

.workspace-header-dropdown-menu.el-dropdown-menu {
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 0 0;
  background: transparent;
  top: 35px !important;
}
.workspace-header-dropdown-menu .menu-box a {
  cursor: pointer;
}

.default-tabs-container {
  width: 100%;
  height: 30px;
  position: relative;
}
.default-spans-container {
  width: 100%;
  height: calc(100% - 30px);
  position: relative;
}

/* 滚动条样式*/
.app-scroll-bar {
  overflow: scroll;
}

.app-scroll-bar::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.app-scroll-bar:hover::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.app-scroll-bar::-webkit-scrollbar-thumb {
  border-radius: 0px;
}
.app-scroll-bar::-webkit-scrollbar-track {
  border-radius: 0;
}
.app-scroll-bar::-webkit-scrollbar-corner {
  background: transparent;
}

.app-scroll-bar-textarea textarea::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.app-scroll-bar-textarea textarea:hover::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.app-scroll-bar-textarea textarea::-webkit-scrollbar-thumb {
  border-radius: 0px;
}
.app-scroll-bar-textarea textarea::-webkit-scrollbar-track {
  border-radius: 0;
}
.app-scroll-bar-textarea textarea::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
