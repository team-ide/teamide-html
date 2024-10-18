<template>
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
      <div
        v-if="source.hasPower('toolbox')"
        class="workspace-header-nav pdlr-0"
      >
        <el-dropdown
          trigger="click"
          class="workspace-header-dropdown"
          ref="showTabGroupDropdown"
        >
          <span class="el-dropdown-link" style="padding: 5px 10px">
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
          <el-dropdown-menu
            slot="dropdown"
            class="workspace-header-dropdown-menu"
          >
            <MenuBox class="menu-mini header-group-menu-box">
              <template
                v-if="source.showTabGroups && source.showTabGroups.length > 0"
              >
                <template v-for="(one, index) in source.showTabGroups">
                  <MenuItem
                    :key="index"
                    @click="
                      tool.changeShowTabGroup(one);
                      $refs.showTabGroupDropdown.hide();
                    "
                  >
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
        v-if="source.hasPower('node') || source.hasPower('node/netProxy')"
        class="workspace-header-nav pdlr-0"
      >
        <el-dropdown
          trigger="click"
          class="workspace-header-dropdown"
          ref="nodeDropdown"
        >
          <span class="el-dropdown-link" style="padding: 5px 10px">
            节点|透传<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu
            slot="dropdown"
            class="workspace-header-dropdown-menu"
          >
            <MenuBox class="menu-mini">
              <MenuItem
                v-if="source.hasPower('node')"
                @click="
                  tool.openNodeContext();
                  $refs.nodeDropdown.hide();
                "
              >
                节点
              </MenuItem>
              <MenuItem
                v-if="source.hasPower('node/netProxy')"
                @click="
                  tool.openNodeNetProxyContext();
                  $refs.nodeDropdown.hide();
                "
              >
                网络代理|透传
              </MenuItem>
            </MenuBox>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div
        v-if="source.hasPower('terminal')"
        class="workspace-header-nav pdlr-0"
      >
        <el-dropdown
          trigger="click"
          class="workspace-header-dropdown"
          ref="terminalDropdown"
        >
          <span class="el-dropdown-link" style="padding: 5px 10px">
            终端<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu
            slot="dropdown"
            class="workspace-header-dropdown-menu"
          >
            <MenuBox class="menu-mini">
              <template v-if="source.setting.terminalLocalEnable">
                <MenuItem @click="tool.openTerminal('local')">本地</MenuItem>
              </template>
              <template v-else>
                <MenuItem :disabled="true">未开启本地</MenuItem>
              </template>
              <template
                v-if="source.sshToolboxList && source.sshToolboxList.length > 0"
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
                        @click="tool.openTerminal('ssh', one)"
                      >
                        {{ one.name }}
                      </MenuItem>
                    </template>
                  </MenuSubBox>
                </MenuItem>
              </template>
              <template
                v-if="
                  source.nodeList &&
                  source.nodeList.length > 0 &&
                  source.setting.terminalNodeEnable
                "
              >
                <MenuItem>
                  节点
                  <MenuSubBox slot="MenuSubBox">
                    <template v-for="(one, index) in source.nodeList">
                      <MenuItem
                        :key="index"
                        @click="tool.openTerminal('node', one)"
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
        v-if="source.hasPower('fileManager')"
        class="workspace-header-nav pdlr-0"
      >
        <el-dropdown
          trigger="click"
          class="workspace-header-dropdown"
          ref="fileManagerDropdown"
        >
          <span class="el-dropdown-link" style="padding: 5px 10px">
            文件管理器<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu
            slot="dropdown"
            class="workspace-header-dropdown-menu"
          >
            <MenuBox class="menu-mini">
              <template v-if="source.setting.fileManagerLocalEnable">
                <MenuItem @click="tool.openFileManager('local')">本地</MenuItem>
              </template>
              <template v-else>
                <MenuItem :disabled="true">未开启本地</MenuItem>
              </template>
              <template
                v-if="source.sshToolboxList && source.sshToolboxList.length > 0"
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
                        @click="tool.openFileManager('ssh', one)"
                      >
                        {{ one.name }}
                      </MenuItem>
                    </template>
                  </MenuSubBox>
                </MenuItem>
              </template>
              <template
                v-if="
                  source.nodeList &&
                  source.nodeList.length > 0 &&
                  source.setting.fileManagerNodeEnable
                "
              >
                <MenuItem>
                  节点
                  <MenuSubBox slot="MenuSubBox">
                    <template v-for="(one, index) in source.nodeList">
                      <MenuItem
                        :key="index"
                        @click="tool.openFileManager('node', one)"
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
        @click="tool.openPage('log', '日志')"
      >
        日志
      </div>
      <div
        v-if="source.hasPower('tools')"
        class="workspace-header-nav"
        @click="tool.openPage('tools', '小工具')"
      >
        小工具
      </div>
      <div
        v-if="source.hasPower('setting')"
        class="workspace-header-nav"
        @click="tool.openPage('setting', '系统设置')"
      >
        系统设置
      </div>

      <div v-if="source.hasElectron" class="workspace-header-nav pdlr-0">
        <el-dropdown
          trigger="click"
          class="workspace-header-dropdown"
          ref="otherServerDropdown"
        >
          <span class="el-dropdown-link" style="padding: 5px 10px">
            其它服务<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu
            slot="dropdown"
            class="workspace-header-dropdown-menu"
          >
            <MenuBox class="menu-mini">
              <template v-for="(server, index) in source.otherServers">
                <MenuItem
                  :key="index"
                  @click="
                    tool.openOtherServer(server);
                    $refs.otherServerDropdown.hide();
                  "
                  :title="`新窗口打开${server.name}`"
                >
                  {{ server.name }}
                </MenuItem>
              </template>
              <MenuItem
                @click="
                  tool.showOtherServers();
                  $refs.nodeDropdown.hide();
                "
              >
                管理
              </MenuItem>
            </MenuBox>
          </el-dropdown-menu>
        </el-dropdown>
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
          v-if="source.hasPower('register') && source.setting.registerEnable"
          @click="tool.toRegister()"
        >
          注 册
        </div>
      </template>
      <template v-else>
        <div class="workspace-header-nav pdlr-0">
          <el-dropdown
            trigger="click"
            class="workspace-header-dropdown"
            ref="userDropdown"
          >
            <span class="el-dropdown-link" style="padding: 5px 10px">
              {{ source.login.user.name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu
              slot="dropdown"
              class="workspace-header-dropdown-menu"
            >
              <MenuBox>
                <MenuItem
                  @click="
                    tool.openPage('userCenter', '个人中心');
                    $refs.userDropdown.hide();
                  "
                >
                  个人中心
                </MenuItem>
                <MenuItem
                  @click="
                    tool.openPage('userSetting', '个人设置');
                    $refs.userDropdown.hide();
                  "
                >
                  个人设置
                </MenuItem>
                <MenuItem
                  v-if="source.hasPower('logout')"
                  @click="
                    tool.toLogout();
                    $refs.userDropdown.hide();
                  "
                >
                  退出登录
                </MenuItem>
              </MenuBox>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div
          class="workspace-header-nav pdlr-0"
          @click="tool.openPage('userSetting', '个人设置')"
          title="个人设置"
        >
          <i class="mdi mdi-account-wrench ft-18"></i>
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
</template>

<script>
export default {
  components: {},
  props: ["source", "mainItemsWorker", "showTabGroupTitle"],
  data() {
    return {
      otherServers: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {
      this.source.initUserToolboxCount();
      this.source.initUserToolboxSSHList();
      this.source.initUserNodeList();
    },
  },
  created() {},
  updated() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.header-group-menu-box {
  max-height: 548px;
  overflow-y: auto;
}
</style>
