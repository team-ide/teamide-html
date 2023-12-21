<template>
  <div v-show="commandShow" class="terminal-command-box">
    <div class="terminal-command-header">
      <el-form size="mini" inline class="pdlr-10">
        <el-form-item label="" class="mgb-0">
          <el-radio :label="1" v-model="commandType"> 历史 </el-radio>
          <el-radio :label="2" v-model="commandType"> 收藏 </el-radio>

          <el-checkbox v-model="currentWorker" v-if="commandType == 1">
            当前标签
          </el-checkbox>
        </el-form-item>
        <el-form-item label="" class="mgb-0">
          <el-input
            v-model="searchText"
            style="width: 200px"
            placeholder="输入搜索"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" class="mgb-0">
          <div
            v-if="commandType == 1"
            class="ft-12 tm-link color-orange mgr-5"
            @click="cleanHistoryCommand()"
          >
            清理历史
          </div>
          <div
            v-if="commandType == 2"
            class="ft-12 tm-link color-orange mgr-5"
            @click="toAddCollectCommand()"
          >
            添加收藏
          </div>
        </el-form-item>
      </el-form>
      <i
        class="mdi-icon mdi mdi-close"
        @click="hideCommandBox()"
        style="cursor: pointer; position: absolute; right: 10px; top: 5px"
      ></i>
    </div>
    <div class="terminal-command-list data-list-box app-scroll-bar">
      <div
        v-if="commands.length == 0"
        class="text-center color-orange pd-10 ft-12"
      >
        暂无数据
      </div>
      <template v-for="(command, index) in commands">
        <div :key="index" class="terminal-command-one data-list-one">
          <div class="terminal-command-text">{{ command.command }}</div>
          <div
            class="terminal-command-comment"
            v-if="tool.isNotEmpty(command.comment)"
          >
            {{ command.comment }}
          </div>
          <div class="terminal-command-date">
            {{ tool.formatDate(new Date(command.createTime)) }}
          </div>
          <div class="terminal-command-btn">
            <div
              class="ft-12 tm-link color-green-3 mgl-5"
              @click="writeCommand(command.command)"
              title="写入命令到控制台"
            >
              写入
            </div>
            <div
              class="ft-12 tm-link color-green mgl-5"
              @click="writeCommand(command.command + '\n')"
              title="写入命令到控制台，并且拼接`\n`字符"
            >
              执行
            </div>
            <div
              v-if="!command.inCollect"
              class="ft-12 tm-link color-grey mgl-5"
              @click="addCollectCommand(command.command)"
            >
              收藏
            </div>
            <div
              v-if="command.commandType == 2"
              class="ft-12 tm-link color-blue mgl-5"
              @click="toUpdateCollectCommand(command)"
            >
              修改
            </div>

            <div
              class="ft-12 tm-link color-orange mgl-5"
              @click="deleteCommand(command)"
            >
              删除
            </div>
          </div>
        </div>
      </template>
    </div>
    <CommandForm
      ref="CommandForm"
      :source="source"
      :toolboxWorker="toolboxWorker"
      :worker="worker"
    ></CommandForm>
  </div>
</template>


<script>
import CommandForm from "./CommandForm.vue";

export default {
  components: { CommandForm },
  props: ["source", "toolboxWorker", "worker", "writeCommand", "onFocus"],
  data() {
    return {
      commandType: 1,
      commandCount: 0,
      historyCommands: [],
      collectCommands: [],
      commandShow: false,
      currentWorker: true,
      isHistory: false,
      commands: [],
      searchText: "",
    };
  },
  computed: {},
  watch: {
    commandType() {
      if (this.commandShow) {
        this.loadCommands();
      }
    },
    currentWorker() {
      if (this.commandShow) {
        this.loadCommands();
      }
    },
    searchText() {
      if (this.commandShow) {
        this.initShowCommands();
      }
    },
  },
  methods: {
    async init() {},

    async show() {
      if (this.commandShow) {
        this.commandShow = false;
        return;
      }
      this.commandShow = true;
      this.loadCommands();
    },
    hideCommandBox() {
      this.commandShow = false;
      this.onFocus && this.onFocus();
    },
    toAddCollectCommand() {
      this.$refs.CommandForm.show({}, () => {
        this.loadCommands();
      });
    },
    toUpdateCollectCommand(data) {
      this.$refs.CommandForm.show(data, () => {
        this.loadCommands();
      });
    },
    initShowCommands() {
      let list = [];
      let collectCommands = [];
      this.collectCommands.forEach((one) => {
        one.inCollect = true;
        if (collectCommands.indexOf(one.command) < 0) {
          collectCommands.push(one.command);
        }
      });
      this.historyCommands.forEach((one) => {
        one.inCollect = collectCommands.indexOf(one.command) >= 0;
      });
      if (this.commandType == 1) {
        list = this.historyCommands;
      } else if (this.commandType == 2) {
        list = this.collectCommands;
      }
      let commands = [];
      let searchText = (this.searchText || "").toLowerCase();
      if (this.tool.isNotEmpty(searchText)) {
        list.forEach((one) => {
          let command = (one.command || "").toLowerCase();
          if (command.indexOf(searchText) >= 0) {
            commands.push(one);
          }
        });
      } else {
        commands = list;
      }

      this.commands = commands;
    },
    async addHistoryCommand(command) {
      let param = this.worker.getParam();
      param.command = command;
      param.commandType = 1;
      let res = await this.server.terminal.command.save(param);
      if (res.data != null) {
        if (this.commandShow) {
          this.historyCommands.splice(0, 0, res.data);
          this.initShowCommands();
        }
      }
    },
    async addCollectCommand(command, comment) {
      let param = this.worker.getParam();
      param.command = command;
      param.comment = comment || "";
      param.commandType = 2;
      let res = await this.server.terminal.command.save(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        if (this.commandShow) {
          this.tool.success("收藏成功");
          this.loadCommands();
        }
      }
    },
    async loadCommands() {
      this.commands = [];
      await this.loadCollectCommands();
      await this.loadHistoryCommands();
      this.initShowCommands();
    },
    async loadHistoryCommands() {
      let param = this.worker.getParam();
      param.commandType = 1;
      if (!this.currentWorker) {
        delete param.workerId;
      }
      let res = await this.server.terminal.command.query(param);
      this.historyCommands = res.data || [];
    },
    async loadCollectCommands() {
      let param = this.worker.getParam();
      param.commandType = 2;
      delete param.place;
      delete param.placeId;
      delete param.workerId;
      let res = await this.server.terminal.command.query(param);
      this.collectCommands = res.data || [];
    },
    async cleanHistoryCommand() {
      let param = this.worker.getParam();
      param.commandType = 1;
      if (!this.currentWorker) {
        delete param.workerId;
      }
      let res = await this.server.terminal.command.clean(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.tool.success("清理成功");
        this.loadCommands();
      }
    },
    async deleteCommand(data) {
      let param = this.worker.getParam();
      param.terminalCommandId = data.terminalCommandId;
      let res = await this.server.terminal.command.delete(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.tool.success("删除成功");
        this.loadCommands();
      }
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {},
};
</script>

<style>
.terminal-command-box {
  position: fixed;
  bottom: 40px;
  left: 50px;
  right: 50px;
  height: 300px;
  user-select: text;
  z-index: 3;
}
.terminal-command-list {
  height: calc(100% - 30px);
  font-size: 12px;
  overflow-x: hidden !important;
}

.terminal-command-list .terminal-command-one {
  display: flex;
  padding: 5px 10px;
  font-size: 13px;
  cursor: text;
}
.terminal-command-text {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.terminal-command-comment {
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.terminal-command-date {
  width: 140px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.terminal-command-btn {
  width: 140px;
  text-align: right;
}
</style>
