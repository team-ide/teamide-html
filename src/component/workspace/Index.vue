<template>
  <div
    class="workspace-container"
    :class="{
      'workspace-theme-dark': theme.isDark,
    }"
    :style="{
      backgroundColor: theme.backgroundColor,
    }"
  >
    <div class="workspace-header">
      <div class="workspace-header-nav-box">
        <!-- 
        <div class="workspace-header-title">
          <a class="tm-link color-white" href="https://github.com/team-ide" target="_blank">
            Team · IDE
          </a>
        </div> 
        -->
        <div
          v-if="source.hasPower('toolbox')"
          class="workspace-header-nav"
          @click="tool.showSwitchToolboxContext()"
        >
          工具箱
          <span class="color-green mgl-2"> ({{ source.toolboxCount }}) </span>
        </div>
        <div v-if="source.hasPower('toolbox')" class="workspace-header-nav">
          <el-dropdown
            trigger="click"
            class="terminal-dropdown"
            ref="showTabGroupDropdown"
          >
            <span class="el-dropdown-link" style="padding: 5px 0px">
              <Icon
                class="color-green ft-14 mdi-eye"
                style="vertical-align: -1px"
              >
              </Icon>
              <span class="color-green mgl-2 ft-12">
                {{ showTabGroupTitle }}
                ({{ mainItemsWorker.showCount }})
              </span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="terminal-dropdown-menu">
              <MenuBox class="menu-mini">
                <template
                  v-if="source.showTabGroups && source.showTabGroups.length > 0"
                >
                  <template v-for="(one, index) in source.showTabGroups">
                    <MenuItem :key="index" @click="changeShowTabGroup(one)">
                      <template v-if="one.select">
                        <Icon
                          class="color-green ft-20 mdi-circle-medium"
                          style=""
                        >
                        </Icon>
                        <span class="color-green">
                          {{ one.name }}
                        </span>
                      </template>
                      <template v-else>
                        <Icon
                          class="color-grey-6 ft-20 mdi-circle-medium"
                          style=""
                        >
                        </Icon>
                        <span class="color-grey-6">
                          {{ one.name }}
                        </span>
                      </template>
                    </MenuItem>
                  </template>
                </template>
              </MenuBox>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div
          v-if="source.hasPower('node')"
          class="workspace-header-nav"
          @click="openNodeContext()"
        >
          节点
        </div>
        <div
          v-if="source.hasPower('node/netProxy')"
          class="workspace-header-nav"
          @click="openNodeNetProxyContext()"
        >
          网络代理|透传
        </div>
        <div v-if="source.hasPower('terminal')" class="workspace-header-nav">
          <el-dropdown
            trigger="click"
            class="terminal-dropdown"
            ref="terminalDropdown"
          >
            <span class="el-dropdown-link" style="padding: 5px 0px">
              终端<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="terminal-dropdown-menu">
              <MenuBox class="menu-mini">
                <MenuItem @click="openTerminal('local')">本地</MenuItem>
                <template
                  v-if="
                    source.sshToolboxList && source.sshToolboxList.length > 0
                  "
                >
                  <MenuItem>
                    SSH
                    <MenuSubBox
                      slot="MenuSubBox"
                      style="max-height: 500px; overflow-y: scroll"
                    >
                      <template v-for="(one, index) in source.sshToolboxList">
                        <MenuItem
                          :key="index"
                          @click="openTerminal('ssh', one)"
                        >
                          {{ one.name }}
                        </MenuItem>
                      </template>
                    </MenuSubBox>
                  </MenuItem>
                </template>
                <template v-if="source.nodeList && source.nodeList.length > 0">
                  <MenuItem>
                    节点
                    <MenuSubBox slot="MenuSubBox">
                      <template v-for="(one, index) in source.nodeList">
                        <MenuItem
                          :key="index"
                          @click="openTerminal('node', one)"
                        >
                          {{ one.name }}
                        </MenuItem>
                      </template>
                    </MenuSubBox>
                  </MenuItem>
                </template>
              </MenuBox>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-if="source.hasPower('fileManager')" class="workspace-header-nav">
          <el-dropdown
            trigger="click"
            class="file-manager-dropdown"
            ref="fileManagerDropdown"
          >
            <span class="el-dropdown-link" style="padding: 5px 0px">
              文件管理器<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu
              slot="dropdown"
              class="file-manager-dropdown-menu"
            >
              <MenuBox class="menu-mini">
                <MenuItem @click="openFileManager('local')">本地</MenuItem>
                <template
                  v-if="
                    source.sshToolboxList && source.sshToolboxList.length > 0
                  "
                >
                  <MenuItem>
                    SSH
                    <MenuSubBox
                      slot="MenuSubBox"
                      style="max-height: 500px; overflow-y: scroll"
                    >
                      <template v-for="(one, index) in source.sshToolboxList">
                        <MenuItem
                          :key="index"
                          @click="openFileManager('ssh', one)"
                        >
                          {{ one.name }}
                        </MenuItem>
                      </template>
                    </MenuSubBox>
                  </MenuItem>
                </template>
                <template v-if="source.nodeList && source.nodeList.length > 0">
                  <MenuItem>
                    节点
                    <MenuSubBox slot="MenuSubBox">
                      <template v-for="(one, index) in source.nodeList">
                        <MenuItem
                          :key="index"
                          @click="openFileManager('node', one)"
                        >
                          {{ one.name }}
                        </MenuItem>
                      </template>
                    </MenuSubBox>
                  </MenuItem>
                </template>
              </MenuBox>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div
          v-if="source.hasPower('log')"
          class="workspace-header-nav"
          @click="openPage('log', '日志')"
        >
          日志
        </div>
        <div class="workspace-header-nav" @click="openPage('tools', '小工具')">
          小工具
        </div>
        <div style="flex: 1"></div>
        <template v-if="source.login.user == null">
          <div
            class="workspace-header-nav"
            v-if="source.hasPower('login')"
            @click="tool.toLogin()"
          >
            登 录
          </div>
          <div
            class="workspace-header-nav"
            v-if="source.hasPower('register')"
            @click="tool.toRegister()"
          >
            注 册
          </div>
        </template>
        <template v-else>
          <div class="workspace-header-nav">
            <el-dropdown
              trigger="click"
              class="user-dropdown"
              ref="userDropdown"
            >
              <span class="el-dropdown-link" style="padding: 5px 0px">
                {{ source.login.user.name }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" class="user-dropdown-menu">
                <MenuBox>
                  <MenuItem @click="openPage('userCenter', '个人中心')">
                    个人中心
                  </MenuItem>
                  <MenuItem
                    v-if="source.hasPower('logout')"
                    @click="tool.toLogout()"
                  >
                    退出登录
                  </MenuItem>
                </MenuBox>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
        <div
          v-if="source.hasPower('updateCheck')"
          class="workspace-header-nav"
          @click="tool.showUpdateCheck()"
        >
          <template v-if="source.hasNewVersion"> 有新版本 </template>
          <template v-else> 检测新版本 </template>
        </div>
      </div>
    </div>
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
  </div>
</template>

<script>
import ToolboxContext from "./ToolboxContext";

export default {
  components: { ToolboxContext },
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
        backgroundColor: "#383838",
      },
    };
  },
  computed: {},
  watch: {
    "source.login.userId"() {
      this.initUserData();
    },
  },
  methods: {
    async initUserData() {
      await this.source.initLoginUserData();
      await this.initOpens();
      this.initShowTabGroup();
    },
    init() {
      this.initUserData();
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
      this.$refs.showTabGroupDropdown && this.$refs.showTabGroupDropdown.hide();
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
    openPage(page, title) {
      this.tool.openByOption({
        extend: {
          toolboxType: "page",
          page: page,
          title: title,
          onlyOpenOneKey: "page:" + page,
        },
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
      this.$refs.terminalDropdown && this.$refs.terminalDropdown.hide();
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
      this.$refs.fileManagerDropdown && this.$refs.fileManagerDropdown.hide();
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
  },
  mounted() {
    this.tool.openByOption = this.openByOption;
    this.tool.openPage = this.openPage;
    this.tool.openTerminal = this.openTerminal;
    this.tool.openFileManager = this.openFileManager;

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
.workspace-container.workspace-theme-dark {
  color: #d9d9d9;
}
.workspace-header {
  width: 100%;
  height: 30px;
  margin: 0px;
  padding: 0px;
  position: relative;
  border-bottom: 1px solid #4e4e4e;
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
.workspace-header-nav:hover {
  background-color: #505050;
}

.file-manager-dropdown.el-dropdown {
  color: unset;
  font-size: unset;
  display: flex;
  white-space: nowrap;
  align-items: center;
}
.file-manager-dropdown-menu.el-dropdown-menu {
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 0 0;
  background: transparent;
  top: 35px !important;
}
.file-manager-dropdown-menu .menu-box a {
  cursor: pointer;
}

.terminal-dropdown.el-dropdown {
  color: unset;
  font-size: unset;
  display: flex;
  white-space: nowrap;
  align-items: center;
}
.terminal-dropdown-menu.el-dropdown-menu {
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 0 0;
  background: transparent;
  top: 35px !important;
}
.terminal-dropdown-menu .menu-box a {
  cursor: pointer;
}

.user-dropdown.el-dropdown {
  color: unset;
  font-size: unset;
  display: flex;
  white-space: nowrap;
  align-items: center;
}
.user-dropdown-menu.el-dropdown-menu {
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 0 0;
  background: transparent;
  top: 35px !important;
}
.user-dropdown-menu .menu-box a {
  cursor: pointer;
}

.default-tabs-container {
  width: 100%;
  height: 30px;
  position: relative;
  border-bottom: 1px solid #4e4e4e;
}
.default-spans-container {
  width: 100%;
  height: calc(100% - 30px);
  position: relative;
}
</style>
