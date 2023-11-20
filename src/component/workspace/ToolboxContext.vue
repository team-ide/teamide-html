<template>
  <div
    class="toolbox-context-box"
    :class="{ 'toolbox-context-box-show': showBox }"
  >
    <template v-if="showBox">
      <div class="toolbox-context-box-header">
        <div class="ft-16 pdl-10 pdt-5">
          工具箱
          <span class="color-orange mgl-20 ft-12"
            >请右击进行操作，点击某个分组，查看一分组的各类工具</span
          >
        </div>
        <div
          style="
            display: inline-block;
            position: absolute;
            top: 0px;
            right: 0px;
          "
        >
          <span title="关闭" class="tm-link color-write mgr-0" @click="hide">
            <i class="mdi mdi-close ft-21"></i>
          </span>
        </div>
      </div>
      <div class="toolbox-context-body" v-if="selectGroup != null">
        <div class="toolbox-group-box">
          <div class="toolbox-group-header">
            <div class="toolbox-group-header-text">分组</div>
            <span
              class="tm-link color-green mgl-5 mgt-5"
              title="新增分组"
              @click="toInsertGroup()"
            >
              <i class="mdi mdi-plus ft-14"></i>
            </span>
            <div class="toolbox-group-header-search-box mgl-5">
              <input
                class="toolbox-group-header-search"
                v-model="searchGroup"
                placeholder="输入过滤"
              />
            </div>
          </div>
          <div class="toolbox-group-body app-scroll-bar">
            <template v-for="group in groupList">
              <div
                :key="group.groupId"
                class="toolbox-group-one"
                :class="{ active: group.groupId == selectGroup.groupId }"
                v-if="
                  tool.isEmpty(searchGroup) ||
                  group.name.toLowerCase().indexOf(searchGroup.toLowerCase()) >=
                    0
                "
                @click="toSelectGroup(group)"
                @contextmenu="groupContextmenu(group)"
              >
                <div class="toolbox-group-title">
                  <div class="toolbox-group-title-text">
                    {{ group.name }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="toolbox-data-list-box" v-if="showToolboxContext != null">
          <div class="toolbox-search-box">
            <input
              class="toolbox-search-input"
              v-model="toolboxSearch"
              placeholder="输入过滤"
            />
          </div>
          <div
            class="toolbox-type-box app-scroll-bar"
            v-if="showToolboxContext != null"
          >
            <template v-for="toolboxType in showToolboxTypes">
              <div :key="toolboxType.name" class="toolbox-type-one">
                <div class="toolbox-type-title">
                  <div class="toolbox-type-title-text">
                    <template v-if="toolboxType.name == 'database'">
                      <IconFont class="teamide-database"> </IconFont>
                    </template>
                    <template v-else-if="toolboxType.name == 'redis'">
                      <IconFont class="teamide-redis"> </IconFont>
                    </template>
                    <template v-else-if="toolboxType.name == 'elasticsearch'">
                      <IconFont class="teamide-elasticsearch"> </IconFont>
                    </template>
                    <template v-else-if="toolboxType.name == 'kafka'">
                      <IconFont class="teamide-kafka"> </IconFont>
                    </template>
                    <template v-else-if="toolboxType.name == 'zookeeper'">
                      <IconFont class="teamide-zookeeper"> </IconFont>
                    </template>
                    <template v-else-if="toolboxType.name == 'ssh'">
                      <IconFont class="teamide-ssh"> </IconFont>
                      <IconFont class="teamide-ftp"> </IconFont>
                    </template>
                    <span class="toolbox-type-text">
                      {{ toolboxType.text || toolboxType.name }}
                      <span
                        v-if="showToolboxContext[toolboxType.name] != null"
                        class="mgl-5 color-green ft-12"
                      >
                        (
                        {{ showToolboxContext[toolboxType.name].length }}
                        )
                      </span>
                    </span>
                    <span
                      class="tm-link color-green mgl-10"
                      title="新增"
                      v-if="toolboxType.name != 'other'"
                      @click="toInsert(toolboxType, selectGroup)"
                    >
                      <i class="mdi mdi-plus ft-14"></i>
                    </span>
                  </div>
                </div>
                <div
                  class="toolbox-type-data-box"
                  :class="{
                    'app-scroll-bar toolbox-type-data-box-have-data':
                      showToolboxContext[toolboxType.name] != null &&
                      showToolboxContext[toolboxType.name].length != 0,
                  }"
                  @contextmenu="dataContextmenu(toolboxType)"
                >
                  <template
                    v-if="
                      showToolboxContext[toolboxType.name] == null ||
                      showToolboxContext[toolboxType.name].length == 0
                    "
                  >
                    <span
                      class="tm-link color-green mglr-10 mgtb-5"
                      title="新增"
                      v-if="toolboxType.name != 'other'"
                      @click="toInsert(toolboxType, selectGroup)"
                    >
                      新增
                    </span>
                  </template>
                  <template v-else>
                    <template
                      v-for="toolboxData in showToolboxContext[
                        toolboxType.name
                      ]"
                    >
                      <div
                        :key="toolboxData.toolboxId"
                        v-if="
                          tool.isEmpty(toolboxSearch) ||
                          toolboxData.name
                            .toLowerCase()
                            .indexOf(toolboxSearch.toLowerCase()) >= 0
                        "
                        class="toolbox-type-data"
                        @contextmenu="dataContextmenu(toolboxType, toolboxData)"
                        @click="toolboxDataOpen(toolboxData)"
                      >
                        <span
                          class="toolbox-type-data-text"
                          :title="'打开:' + toolboxData.name"
                        >
                          {{ toolboxData.name }}
                        </span>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
    <FormDialog
      ref="ShowToolboxInfo"
      :source="source"
      title="查看Toolbox"
    ></FormDialog>
    <FormDialog
      ref="InsertToolbox"
      :source="source"
      title="新增Toolbox"
      :onSave="doInsert"
      formHeight="calc(100% - 100px)"
    >
      <div class="tm-link color-blue-8 ft-14 mgt-10" @click="toTestForInsert()">
        <span v-if="checking">测试中...</span>
        <span v-else> 测试 </span>
      </div>
      <span
        class="mgl-10 color-red"
        v-if="checkError != null"
        style="user-select: text"
      >
        异常：{{ checkError }}
      </span>
      <span class="mgl-10 color-green" v-if="checkOk"> 测试成功 </span>
    </FormDialog>
    <FormDialog
      ref="UpdateToolbox"
      :source="source"
      title="编辑Toolbox"
      :onSave="doUpdate"
      formHeight="calc(100% - 100px)"
    >
      <div class="tm-link color-blue-8 ft-14 mgt-10" @click="toTestForUpdate()">
        <span v-if="checking">测试中...</span>
        <span v-else> 测试 </span>
      </div>
      <span
        class="mgl-10 color-red"
        v-if="checkError != null"
        style="user-select: text"
      >
        异常：{{ checkError }}
      </span>
      <span class="mgl-10 color-green" v-if="checkOk"> 测试成功 </span>
    </FormDialog>
    <FormDialog
      ref="ShareToolbox"
      :source="source"
      title="分享Toolbox"
      :onSave="doShare"
    ></FormDialog>
    <FormDialog
      ref="InsertToolboxGroup"
      :source="source"
      title="新增工具分组"
      :onSave="doInsertGroup"
    ></FormDialog>
    <FormDialog
      ref="UpdateToolboxGroup"
      :source="source"
      title="编辑工具分组"
      :onSave="doUpdateGroup"
    ></FormDialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["source", "openByOption"],
  data() {
    return {
      showBox: false,
      toolboxSearch: null,
      selectGroup: null,
      groupList: [],
      searchGroup: null,
      showToolboxTypes: [],
      showToolboxContext: null,

      toolboxGroups: [],
      checking: false,
      checkError: null,
      checkOk: false,
    };
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算
  computed: {},
  // 计算属性 数据变，直接会触发相应的操作
  watch: {
    "source.login.userId"(userId) {
      if (userId == null) {
        this.showBox = false;
      }
    },
    showBox() {
      if (this.showBox) {
        this.initData();
      }
    },
    selectGroup() {
      this.initDataList();
    },
  },
  methods: {
    show() {
      this.showBox = true;
    },
    showSwitch() {
      this.showBox = !this.showBox;
    },
    hide() {
      this.showBox = false;
    },
    init() {
      this.initToolboxGroups();
    },
    async initToolboxGroups() {
      let data = {};
      if (this.source.login.user != null) {
        let res = await this.server.toolbox.group.list({});
        if (res.code != 0) {
          this.tool.error(res.msg);
        }
        data = res.data || {};
      }
      let groups = data.groupList || [];
      groups.forEach((one) => {
        let find = null;
        this.source.showTabGroups.forEach((g) => {
          if (g.isToolboxGroup && g.value == one.groupId) {
            find = g;
          }
        });
        if (!find) {
          this.source.showTabGroups.push({
            isToolboxGroup: true,
            name: "" + one.name,
            value: one.groupId,
            select: false,
          });
        }
      });

      this.toolboxGroups = groups;
    },
    async initData() {
      await this.initToolboxGroups();
      await this.initToolboxDataGroup();
    },
    toSelectGroup(group) {
      if (group == null) {
        group = this.groupList[0];
      }
      this.selectGroup = group;
    },
    async initToolboxDataGroup() {
      let toolboxTypes = this.source.toolboxTypes || [];
      this.toolboxTypeMap = {};
      toolboxTypes.forEach((one) => {
        this.toolboxTypeMap[one.name] = one;
      });
      let groupList = [];
      let toolboxList = [];

      let res = await this.server.toolbox.queryVisibility({});
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        let data = res.data || {};
        toolboxList = data.toolboxList || [];
        this.source.toolboxCount = toolboxList.length;
        this.source.initUserToolboxSSHList(toolboxList);
      }
      this.toolboxList = toolboxList;

      let groups = this.toolboxGroups || [];
      groupList.push({
        groupId: null,
        name: "未分组",
      });
      let groupIdCache = {};
      groups.forEach((one) => {
        groupIdCache[one.groupId] = one;
        groupList.push({
          groupId: one.groupId,
          name: one.name,
        });
      });
      let selectGroup = groupList[0];
      if (this.selectGroup && this.selectGroup.groupId != null) {
        groupList.forEach((one) => {
          if (one.groupId == this.selectGroup.groupId) {
            selectGroup = one;
          }
        });
      }

      this.groupIdCache = groupIdCache;
      this.groupList = groupList;
      this.selectGroup = selectGroup;
      this.initDataList();
    },
    initDataList() {
      let selectGroup = this.selectGroup;
      if (selectGroup == null) {
        return;
      }
      let showToolboxContext = {};

      let isDefaultGroup = this.tool.isEmpty(selectGroup.groupId);

      this.toolboxList.forEach((one) => {
        let isThisGroup = false;
        if (
          isDefaultGroup &&
          (this.tool.isEmpty(one.groupId) ||
            this.groupIdCache[one.groupId] == null)
        ) {
          isThisGroup = true;
        } else if (selectGroup.groupId == one.groupId) {
          isThisGroup = true;
        }
        if (isThisGroup) {
          showToolboxContext[one.toolboxType] =
            showToolboxContext[one.toolboxType] || [];
          showToolboxContext[one.toolboxType].push(one);
        }
      });

      let showToolboxTypes = [];
      let toolboxTypes = this.source.toolboxTypes || [];

      toolboxTypes.forEach((type) => {
        if (
          showToolboxContext[type.name] != null &&
          showToolboxContext[type.name].length > 0
        ) {
          showToolboxTypes.push(type);
        }
      });
      toolboxTypes.forEach((type) => {
        if (
          showToolboxContext[type.name] == null ||
          showToolboxContext[type.name].length == 0
        ) {
          showToolboxTypes.push(type);
        }
      });
      this.showToolboxTypes = showToolboxTypes;
      this.showToolboxContext = showToolboxContext;
    },
    groupContextmenu(group) {
      let menus = [];
      menus.push({
        header: group.name,
      });
      menus.push({
        text: "修改",
        onClick: () => {
          this.toUpdateGroup(group);
        },
      });
      menus.push({
        text: "删除",
        onClick: () => {
          this.toDeleteGroup(group);
        },
      });

      if (menus.length > 0) {
        this.tool.showContextmenu(menus);
      }
    },
    async moveGroup(toolboxId, groupId) {
      let res = await this.server.toolbox.moveGroup({
        toolboxId: toolboxId,
        groupId: groupId,
      });
      if (res.code == 0) {
        this.tool.success("移动成功");
        this.initData();
        return true;
      } else {
        this.tool.error(res.msg);
        return false;
      }
    },
    toolboxDataOpen(toolboxData) {
      if (toolboxData.toolboxType == "ssh") {
        this.tool.openTerminal("ssh", toolboxData);
      } else {
        let extend = {};
        if (toolboxData.toolboxType == "other") {
          extend = this.tool.getOptionJSON(toolboxData.option);
        }
        this.openByOption({
          toolboxId: toolboxData.toolboxId,
          extend: extend,
        });
      }

      this.hide();
    },
    dataContextmenu(toolboxType, toolboxData) {
      if (toolboxType.name == "other") {
        return;
      }
      let menus = [];

      menus.push({
        header:
          toolboxType.text +
          (toolboxData != null ? ":" + toolboxData.name : ""),
      });
      if (toolboxData != null) {
        menus.push({
          text: "打开",
          onClick: () => {
            this.toolboxDataOpen(toolboxData);
          },
        });
      }
      if (toolboxData != null) {
        if (toolboxData.toolboxType == "ssh") {
          menus.push({
            text: "文件管理器",
            onClick: () => {
              this.tool.openFileManager("ssh", toolboxData);
            },
          });
        }
        if (this.groupList.length > 0) {
          let moveGroupMenu = {
            text: "移动分组",
            menus: [],
          };
          menus.push(moveGroupMenu);
          this.groupList.forEach((one) => {
            moveGroupMenu.menus.push({
              text: one.name,
              onClick: () => {
                this.moveGroup(toolboxData.toolboxId, one.groupId);
              },
            });
          });
        }
        menus.push({
          text: "修改",
          onClick: () => {
            this.toUpdate(toolboxType, toolboxData);
          },
        });
        menus.push({
          text: "复制",
          onClick: () => {
            this.toCopy(toolboxType, toolboxData);
          },
        });
        // menus.push({
        //   text: "分享工具",
        //   onClick: () => {
        //     this.toShare(toolboxType, toolboxData);
        //   },
        // });
        menus.push({
          text: "复制到剪切板",
          onClick: () => {
            this.toCopyToClipboard(toolboxType, toolboxData);
          },
        });
      }
      menus.push({
        text: "从剪切板新增",
        onClick: () => {
          this.toInsertFromClipboard();
        },
      });
      if (toolboxData != null) {
        menus.push({
          text: "删除",
          onClick: () => {
            this.toDelete(toolboxType, toolboxData);
          },
        });
      }
      if (menus.length > 0) {
        this.tool.showContextmenu(menus);
      }
    },
    toInsert(toolboxType, selectGroup) {
      this.checkError = null;
      this.checkOk = false;

      this.tool.stopEvent();
      let toolboxData = {};
      let optionsJSON = {};

      this.$refs.InsertToolbox.show({
        title: `新增[${toolboxType.text}]工具`,
        form: [this.form.toolbox, toolboxType.configForm],
        data: [toolboxData, optionsJSON],
        toolboxType,
        selectGroup,
      });
    },
    async toCopyToClipboard(toolboxType, data) {
      let find = await this.getToolbox(data.toolboxId);
      if (find == null) {
        return;
      }
      Object.assign(data, find);

      let out = {
        isToolboxData: true,
        toolboxType: toolboxType.name,
        data: data,
        fromUser: {
          userId: this.source.login.user.userId,
          name: this.source.login.user.name,
          account: this.source.login.user.account,
          email: this.source.login.user.email,
        },
      };
      let str = JSON.stringify(out);
      str = this.tool.aesEncrypt(str);
      str =
        `TeamIDE;toolboxType:${toolboxType.name};name:${data.name};data:` + str;
      let res = await this.tool.clipboardWrite(str);
      if (res.success) {
        this.tool.success("复制成功");
      } else {
        this.tool.warn("复制失败，请允许访问剪贴板！");
      }
    },
    async toInsertFromClipboard() {
      let readResult = await this.tool.readClipboardText();
      if (!readResult.success) {
        this.tool.warn("请允许访问剪贴板！");
        return;
      }
      let str = readResult.text;
      if (this.tool.isEmpty(str)) {
        this.tool.warn("不是有效工具箱数据！");
        return;
      }
      let ss = str.split(";data:");
      if (ss.length < 2) {
        this.tool.warn("不是有效工具箱数据！");
        return;
      }
      str = ss[ss.length - 1];
      try {
        let json = JSON.parse(this.tool.aesDecrypt(str));
        this.tool.stopEvent();
        if (
          !json.isToolboxData ||
          this.tool.isEmpty(json.toolboxType) ||
          json.data == null
        ) {
          this.tool.warn("不是有效工具箱数据！");
          return;
        }
        let toolboxType = this.toolboxTypeMap[json.toolboxType];
        if (toolboxType == null) {
          this.tool.warn("不是有效工具箱数据！");
          return;
        }
        let toolboxData = {};
        Object.assign(toolboxData, json.data);
        delete toolboxData.toolboxId;

        let optionsJSON = this.tool.getOptionJSON(toolboxData.option);

        this.$refs.InsertToolbox.show({
          title: `新增[${toolboxType.text}]工具`,
          form: [this.form.toolbox, toolboxType.configForm],
          data: [toolboxData, optionsJSON],
          toolboxType,
          selectGroup: this.selectGroup,
        });
      } catch (e) {
        this.tool.warn("不是有效工具箱数据！");
        return;
      }
    },
    async showToolboxInfo(toolboxId) {
      let res = await this.server.toolbox.get({
        toolboxId: toolboxId,
      });
      if (res.code == 0) {
        let toolboxData = res.data || {};
        let toolboxType = this.source.getToolboxType(toolboxData.toolboxType);
        if (toolboxType == null) {
          this.tool.warn("工具箱数据丢失！");
          return;
        }
        let optionsJSON = this.tool.getOptionJSON(toolboxData.option);
        this.$refs.ShowToolboxInfo.show({
          title: `查看[${toolboxType.text}]工具`,
          form: [this.form.toolbox, toolboxType.configForm],
          data: [toolboxData, optionsJSON],
        });
      } else {
        this.tool.error(res.msg);
      }
    },
    async toCopy(toolboxType, copy) {
      this.checkError = null;
      this.checkOk = false;

      this.tool.stopEvent();

      let find = await this.getToolbox(copy.toolboxId);
      if (find == null) {
        return;
      }

      let toolboxData = {};
      Object.assign(toolboxData, find);
      delete toolboxData.toolboxId;
      toolboxData.name = toolboxData.name + " Copy";

      let optionsJSON = this.tool.getOptionJSON(toolboxData.option);

      this.$refs.InsertToolbox.show({
        title: `新增[${toolboxType.text}]工具`,
        form: [this.form.toolbox, toolboxType.configForm],
        data: [toolboxData, optionsJSON],
        toolboxType,
        groupId: find.groupId,
      });
    },
    async toUpdate(toolboxType, toolboxData) {
      this.checkError = null;
      this.checkOk = false;

      this.tool.stopEvent();

      let find = await this.getToolbox(toolboxData.toolboxId);
      if (find == null) {
        return;
      }
      Object.assign(toolboxData, find);

      let optionsJSON = this.tool.getOptionJSON(toolboxData.option);

      this.$refs.UpdateToolbox.show({
        title: `编辑[${toolboxType.text}][${toolboxData.name}]工具`,
        form: [this.form.toolbox, toolboxType.configForm],
        data: [toolboxData, optionsJSON],
        toolboxType,
        toolboxData,
      });
    },
    async toShare(toolboxType, toolboxData) {
      this.tool.stopEvent();

      let find = await this.getToolbox(toolboxData.toolboxId);
      if (find == null) {
        return;
      }
      Object.assign(toolboxData, find);

      this.$refs.ShareToolbox.show({
        title: `分享[${toolboxType.text}][${toolboxData.name}]工具`,
        form: [this.form.toolbox.share],
        data: [{}],
        toolboxType,
        toolboxData,
      });
    },
    async doShare(dataList, config) {
      let data = dataList[0];
      data.toolboxId = config.toolboxData.toolboxId;
      let res = await this.server.toolbox.share(data);
      if (res.code == 0) {
        res.data = res.data || {};
        let clipboardWriteRes = await this.tool.clipboardWrite(res.data.url);
        if (clipboardWriteRes.success) {
          this.tool.success("分享成功，连接已复制到剪切板！");
        } else {
          this.tool.alert("分享失败，请允许访问剪贴板！");
        }
        return true;
      } else {
        this.tool.error(res.msg);
        return false;
      }
    },
    async getToolbox(toolboxId) {
      let res = await this.server.toolbox.get({
        toolboxId: toolboxId,
      });
      if (res.code == 0) {
        if (res.data == null) {
          this.tool.warn("工具箱数据丢失！");
        }
        return res.data;
      } else {
        this.tool.error(res.msg);
        return null;
      }
    },
    toDelete(toolboxType, toolboxData) {
      this.tool.stopEvent();
      this.tool
        .confirm(
          "删除[" +
            toolboxType.text +
            "]工具[" +
            toolboxData.name +
            "]将无法恢复，确定删除？"
        )
        .then(async () => {
          return this.doDelete(toolboxType, toolboxData);
        })
        .catch((e) => {});
    },
    async doDelete(toolboxType, toolboxData) {
      let res = await this.server.toolbox.delete(toolboxData);
      if (res.code == 0) {
        this.initData();
        this.tool.success("删除成功");
        return true;
      } else {
        this.tool.error(res.msg);
        return false;
      }
    },
    async doUpdate(dataList, config) {
      let toolboxData = dataList[0];
      let optionJSON = dataList[1];
      let toolboxType = config.toolboxType;
      toolboxData.toolboxType = toolboxType.name;
      toolboxData.toolboxId = config.toolboxData.toolboxId;
      toolboxData.option = JSON.stringify(optionJSON);
      let res = await this.server.toolbox.update(toolboxData);
      if (res.code == 0) {
        this.initData();
        this.tool.success("修改成功");
        return true;
      } else {
        this.tool.error(res.msg);
        return false;
      }
    },
    async doInsert(dataList, config) {
      let toolboxData = dataList[0];
      let optionJSON = dataList[1];
      let toolboxType = config.toolboxType;
      toolboxData.toolboxType = toolboxType.name;
      if (config.selectGroup) {
        toolboxData.groupId = config.selectGroup.groupId;
      } else if (config.groupId) {
        toolboxData.groupId = config.groupId;
      }
      toolboxData.option = JSON.stringify(optionJSON);
      let res = await this.server.toolbox.insert(toolboxData);
      if (res.code == 0) {
        this.initData();
        this.tool.success("新增成功");
        return true;
      } else {
        this.tool.error(res.msg);
        return false;
      }
    },

    async toTestForInsert() {
      this.toTest(
        this.$refs.InsertToolbox.options.toolboxType,
        this.$refs.InsertToolbox.$refs.FormBox
      );
    },
    async toTestForUpdate() {
      this.toTest(
        this.$refs.UpdateToolbox.options.toolboxType,
        this.$refs.UpdateToolbox.$refs.FormBox
      );
    },
    async toTest(toolboxType, formBox) {
      if (this.checking) {
        this.tool.warn("测试中请稍后！");
        return;
      }
      let validateResult = await formBox.validateForm(1);
      if (!validateResult.valid) {
        return;
      }
      this.checking = true;
      this.checkError = null;
      this.checkOk = false;
      try {
        let dataList = formBox.getDataList();
        let toolboxData = Object.assign({}, dataList[0]);
        toolboxData.toolboxToTest = "1";
        toolboxData.toolboxType = toolboxType.name;

        toolboxData.option = JSON.stringify(dataList[1]);
        let res = { code: -1, msg: "暂不支持该工具测试" };
        if (toolboxData.toolboxType == "database") {
          res = await this.server.database.check(toolboxData);
        } else if (toolboxData.toolboxType == "redis") {
          res = await this.server.redis.check(toolboxData);
        } else if (toolboxData.toolboxType == "zookeeper") {
          res = await this.server.zookeeper.check(toolboxData);
        } else if (toolboxData.toolboxType == "elasticsearch") {
          res = await this.server.elasticsearch.check(toolboxData);
        } else if (toolboxData.toolboxType == "kafka") {
          res = await this.server.kafka.check(toolboxData);
        } else if (toolboxData.toolboxType == "ssh") {
          res = await this.server.terminal.check(toolboxData);
        }
        if (res.code == 0) {
          this.checkOk = true;
          this.tool.success("测试成功");
          return true;
        } else {
          this.checkError = res.msg;
          this.tool.error("测试失败：" + res.msg);
          return false;
        }
      } catch (e) {
        this.checkError = e.message;
        this.tool.error("测试失败：" + e.message);
      } finally {
        this.checking = false;
      }
    },
    toInsertGroup() {
      this.tool.stopEvent();
      let data = {};
      let optionsJSON = {};

      this.$refs.InsertToolboxGroup.show({
        title: `新增工具分组`,
        form: [this.form.toolbox.group, this.form.toolbox.group.option],
        data: [data, optionsJSON],
      });
    },
    async toUpdateGroup(data) {
      this.tool.stopEvent();

      this.updateGroupData = data;

      let optionsJSON = this.tool.getOptionJSON(data.option);

      this.$refs.UpdateToolboxGroup.show({
        title: `编辑[${data.name}]工具分组`,
        form: [this.form.toolbox.group, this.form.toolbox.group.option],
        data: [data, optionsJSON],
      });
    },
    toDeleteGroup(data) {
      this.tool.stopEvent();
      this.tool
        .confirm(
          "删除工具分组[" + data.name + "]并将该分组下工具移出该组，确定删除？"
        )
        .then(async () => {
          return this.doDeleteGroup(data);
        })
        .catch((e) => {});
    },
    async doDeleteGroup(data) {
      let res = await this.server.toolbox.group.delete(data);
      if (res.code == 0) {
        this.tool.success("删除分组成功");
        this.initData();
        return true;
      } else {
        this.tool.error(res.msg);
        return false;
      }
    },
    async doUpdateGroup(dataList, config) {
      let data = dataList[0];
      let optionJSON = dataList[1];
      data.groupId = this.updateGroupData.groupId;
      data.option = JSON.stringify(optionJSON);
      let res = await this.server.toolbox.group.update(data);
      if (res.code == 0) {
        this.tool.success("修改分组成功");
        this.initData();
        return true;
      } else {
        this.tool.error(res.msg);
        return false;
      }
    },
    async doInsertGroup(dataList, config) {
      let data = dataList[0];
      let optionJSON = dataList[1];
      data.option = JSON.stringify(optionJSON);
      let res = await this.server.toolbox.group.insert(data);
      if (res.code == 0) {
        this.tool.success("新增分组成功");
        this.initData();
        return true;
      } else {
        this.tool.error(res.msg);
        return false;
      }
    },
  },
  created() {},
  updated() {
    this.tool.showToolboxContext = this.show;
    this.tool.showSwitchToolboxContext = this.showSwitch;
    this.tool.hideToolboxContext = this.hide;
    this.tool.showToolboxInfo = this.showToolboxInfo;
  },
  mounted() {
    this.init();
    this.tool.showToolboxContext = this.show;
    this.tool.showSwitchToolboxContext = this.showSwitch;
    this.tool.hideToolboxContext = this.hide;
    this.tool.showToolboxInfo = this.showToolboxInfo;
  },
};
</script>

<style>
.toolbox-context-box {
  position: absolute;
  top: 30px;
  width: 100%;
  transition: all 0s;
  transform: scale(0);
  height: calc(100% - 30px);
}
.toolbox-context-box.toolbox-context-box-show {
  transform: scale(1);
}
.toolbox-context-box-header {
  height: 40px;
}
.toolbox-context-body {
  width: 100%;
  height: calc(100% - 40px);
  display: flex;
}
.toolbox-context-box .toolbox-group-box {
  width: 220px;
  font-size: 12px;
  height: calc(100% - 10px);
  margin-left: 10px;
}

.toolbox-context-box .toolbox-group-header {
  padding: 0px 10px;
  height: 30px;
  display: flex;
}
.toolbox-context-box .toolbox-group-header-text {
  flex: 1;
  line-height: 30px;
}
.toolbox-context-box .toolbox-group-header .icon {
  margin-right: 5px;
}
.toolbox-context-box .toolbox-group-header .tm-link {
  padding: 0px;
}

.toolbox-context-box .toolbox-group-header .toolbox-group-header-search-box {
  width: 140px;
}
.toolbox-context-box
  .toolbox-group-header-search-box
  .toolbox-group-header-search {
  width: 100%;
  height: 26px;
  line-height: 26px;
  margin-top: 4px;
  font-size: 12px;
  background: transparent;
  outline: 0px;
  padding: 0px 10px;
}
.toolbox-context-box .toolbox-group-body {
  /* width: calc(25% - 12.5px); */
  width: 100%;
  height: calc(100% - 30px);
  padding-left: 8px;
}
.toolbox-context-box .toolbox-group-one {
  /* width: calc(25% - 12.5px); */
  width: 100%;
  cursor: pointer;
  margin-top: 10px;
}
.toolbox-context-box .toolbox-group-title {
  padding: 0px 10px;
  line-height: 30px;
  display: flex;
}

.toolbox-context-box .toolbox-group-title-text {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}
.toolbox-context-box .toolbox-group-title .icon {
  margin-right: 5px;
}
.toolbox-context-box .toolbox-group-title .tm-link {
  padding: 0px;
}

.toolbox-context-box .toolbox-search-box {
  margin: 0px 10px 10px;
}
.toolbox-context-box .toolbox-search-box .toolbox-search-input {
  width: 300px;
  height: 30px;
  line-height: 30px;
  font-size: 13px;
  background: transparent;
  padding: 0px 10px;
  outline: 0px;
}

.toolbox-context-box .toolbox-data-list-box {
  flex: 1;
  font-size: 12px;
  height: 100%;
}
.toolbox-context-box .toolbox-type-box {
  height: calc(100% - 40px);
}
.toolbox-context-box .toolbox-type-box:after {
  content: "";
  display: table;
  clear: both;
}
.toolbox-context-box .toolbox-type-one {
  /* width: calc(25% - 12.5px); */
  width: 290px;
  float: left;
  margin: 0px 0px 10px 10px;
}

.toolbox-context-box .toolbox-type-title {
  padding: 0px 10px;
  line-height: 23px;
  display: flex;
}
.toolbox-context-box .toolbox-type-title-text {
  flex: 1;
}
.toolbox-context-box .toolbox-type-title .icon {
  margin-right: 5px;
}
.toolbox-context-box .toolbox-type-title .tm-link {
  padding: 0px;
}
.toolbox-context-box .toolbox-type-data-box-have-data {
  padding: 0px;
  height: 270px;
}
.toolbox-context-box .toolbox-type-data {
  display: flex;
  overflow: hidden;
  padding: 2px 0px;
  cursor: pointer;
}
.toolbox-context-box .toolbox-type-data-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
  flex: 1;
  padding: 3px 10px;
}
.toolbox-context-box .toolbox-type-data .tm-link {
  padding: 0px;
}
</style>
