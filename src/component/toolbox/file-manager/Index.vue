<template>
  <div class="toolbox-file-manager-editor">
    <tm-layout height="100%">
      <tm-layout height="25px">
        <el-dropdown
          trigger="click"
          ref="fileManagerDropdown"
          class="toolbox-file-manager-dropdown"
        >
          <span
            class="el-dropdown-link ft-12 color-green"
            style="padding: 2px 5px 2px; cursor: pointer"
          >
            打开多个<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu
            slot="dropdown"
            class="toolbox-file-manager-dropdown-menu"
          >
            <MenuBox class="menu-mini">
              <template v-if="source.setting.fileManagerLocalEnable">
                <MenuItem @click="addFileManager('local')">本地</MenuItem>
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
                        @click="addFileManager('ssh', one)"
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
                        @click="addFileManager('node', one)"
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
        <template v-for="(one, index) in list">
          <span :key="index" class="ft-12 pdlr-5">
            {{ one.title }}
            <i
              @click="removeOne(one)"
              v-if="tool.isNotEmpty(one.otherId)"
              class="mdi-icon mdi mdi-close color-orange"
              style="vertical-align: 3px; cursor: pointer"
            >
            </i>
          </span>
        </template>
      </tm-layout>
      <tm-layout height="auto">
        <template v-for="one in list">
          <tm-layout ref="layout" :key="`layout-${one.id}`" :width="one.width">
            <FileManager
              ref="FileManager"
              :source="source"
              :toolboxWorker="toolboxWorker"
              :place="one.place"
              :placeId="one.placeId"
              :openDir="one.openDir"
              :onChangeOpenDir="one.onChangeOpenDir"
              :title="one.title"
              :getWorkerByKey="getWorkerByKey"
              :openFileEdit="openFileEdit"
            ></FileManager>
          </tm-layout>
          <template v-if="one.hasBar">
            <tm-layout-bar :key="`layout-bar-${one.id}`" right></tm-layout-bar>
          </template>
        </template>
      </tm-layout>
      <tm-layout-bar top></tm-layout-bar>
      <tm-layout height="200px">
        <Progress
          :source="source"
          :toolboxWorker="toolboxWorker"
          :onUploadFileInfo="onUploadFileInfo"
        ></Progress>
      </tm-layout>
    </tm-layout>
    <FileEdit
      ref="FileEdit"
      :source="source"
      :toolboxWorker="toolboxWorker"
    ></FileEdit>
  </div>
</template>


<script>
import FileManager from "./FileManager.vue";
import Progress from "./Progress.vue";
import FileEdit from "./FileEdit";

export default {
  components: { FileManager, Progress, FileEdit },
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      list: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    onUploadFileInfo(progress, file) {
      if (this.$refs["FileManager"] && this.$refs["FileManager"].forEach) {
        this.$refs["FileManager"].forEach((one) => {
          if (one.place == progress.place && one.placeId == progress.placeId) {
            one.fileWorker.onUploadFileInfo(file);
          }
        });
      }
    },

    openFileEdit(fileWorker, file) {
      this.$refs.FileEdit.show(fileWorker, file);
    },
    init() {
      this.list.splice(0, this.list.length);
      this.$nextTick(() => {
        if (this.extend) {
          this.addOne({
            title: this.extend.title || "",
            place: this.extend.place || "",
            placeId: this.extend.placeId || "",
            openDir: this.extend.openDir || "",
          });
          if (this.extend.others) {
            this.extend.others.forEach((one) => {
              this.addOne(one);
            });
          }
        }
      });
    },
    onFocus() {
      this.$children.forEach((one) => {
        one.onFocus && one.onFocus();
      });
    },
    refresh() {
      this.$children.forEach((one) => {
        one.refresh && one.refresh();
      });
    },
    addFileManager(place, placeData) {
      this.extend.others = this.extend.others || [];
      let options = {};
      options.place = place || "";
      if (place == "local") {
        options.title = "本地";
        options.placeId = "";
      } else if (place == "ssh") {
        options.title = "" + placeData.name;
        options.placeId = "" + placeData.toolboxId;
        options.toolboxId = placeData.toolboxId;
      } else if (place == "node") {
        options.title = "" + placeData.name;
        options.placeId = "" + placeData.serverId;
      } else {
        this.tool.error("暂不支持该配置作为文件管理器");
        return;
      }

      options.otherId = "" + this.tool.getNumber();
      this.extend.others.push(options);
      var keyValueMap = {};
      keyValueMap["others"] = this.extend.others;
      this.toolboxWorker.updateExtend({
        others: this.extend.others,
      });
      this.addOne(options);
      this.$refs.fileManagerDropdown && this.$refs.fileManagerDropdown.hide();
    },
    removeOne(data) {
      let list = [];
      this.extend.others = this.extend.others || [];
      let others = [];
      if (this.list) {
        this.list.forEach((one) => {
          if (one.otherId != data.otherId) {
            list.push(Object.assign({}, one));
          }
        });
      }
      this.extend.others.forEach((one) => {
        if (one.otherId != data.otherId) {
          others.push(one);
        }
      });
      this.extend.others = others;
      this.toolboxWorker.updateExtend({
        others: others,
      });
      this.initListView(list);
    },
    addOne(options) {
      let list = [];
      if (this.list) {
        this.list.forEach((one) => {
          let data = Object.assign({}, one);
          list.push(data);
        });
      }
      let data = {
        id: "ID-" + this.tool.getNumber(),
        index: list.length,
        width: "100%",
        hasBar: false,
        onChangeOpenDir: (openDir) => {
          if (this.tool.isEmpty(openDir)) {
            openDir = "";
          }
          if (this.tool.isEmpty(openDir) && this.tool.isEmpty(data.openDir)) {
            return;
          }
          if (openDir == data.openDir) {
            return;
          }
          if (options.otherId != null) {
            this.extend.others.forEach((one) => {
              if (one.otherId == data.otherId) {
                one.openDir = openDir;
              }
            });
            this.toolboxWorker.updateExtend({
              others: this.extend.others,
            });
          } else {
            data.openDir = openDir;
            if (data.index == 0) {
              this.toolboxWorker.updateExtend({
                openDir: openDir,
              });
            }
          }
        },
      };

      Object.assign(data, options);
      if (data.place == "local") {
        data.sequence = 0;
      } else {
        data.sequence = list.length + 1;
      }

      list.push(data);
      list.sort(function (a, b) {
        return a.sequence - b.sequence; //正序
      });

      this.initListView(list);
    },
    initListView(list) {
      if (list.length > 1) {
        list.forEach((one, index) => {
          if (index == list.length - 1) {
            one.width = "auto";
          } else {
            one.hasBar = true;
            one.width = `${100 / list.length}%`;
          }
        });
      } else {
        if (list[0]) {
          list[0].width = "100%";
          list[0].hasBar = false;
        }
      }
      this.list = list;
      this.$nextTick(() => {
        if (this.$refs["layout"] && this.$refs["layout"].forEach) {
          this.$refs["layout"].forEach((one) => {
            one.initSize && one.initSize();
          });
        }
      });
    },
    getWorkerByKey(key) {
      let find = null;
      if (this.$refs["FileManager"] && this.$refs["FileManager"].forEach) {
        this.$refs["FileManager"].forEach((one) => {
          if (one.fileWorker.fileWorkerKey == key) {
            find = one.fileWorker;
          }
        });
      }
      return find;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-file-manager-editor {
  width: 100%;
  height: 100%;
}
.toolbox-file-manager-dropdown.el-dropdown {
  color: unset;
  font-size: unset;
  white-space: nowrap;
  align-items: center;
}

.toolbox-file-manager-dropdown-menu.el-dropdown-menu {
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 0 0;
  background: transparent;
  margin-top: 5px !important;
}
.toolbox-file-manager-dropdown-menu .menu-box a {
  cursor: pointer;
}
</style>
