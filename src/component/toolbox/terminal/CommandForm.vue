<template>
  <el-dialog
    ref="modal"
    :title="`终端命令`"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :show-close="true"
    :append-to-body="true"
    :visible="showDialog"
    :before-close="hide"
    :destroy-on-close="true"
    :fullscreen="true"
    class="app-dialog"
  >
    <div class="pd-10" style="height: calc(100% - 60px)">
      <el-form ref="form" size="mini" @submit.native.prevent>
        <el-form-item label="说明">
          <el-input type="input" v-model="comment"> </el-input>
        </el-form-item>
        <el-form-item label="指令">
          <el-input type="textarea" v-model="command"> </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="pd-10">
      <div class="tm-btn bg-teal-8 ft-18 pdtb-5" @click="doSave">保存</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "worker"],
  data() {
    return {
      showDialog: false,
      comment: null,
      command: null,
    };
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算
  computed: {},
  // 计算属性 数据变，直接会触发相应的操作
  watch: {},
  methods: {
    show(data, callback) {
      data = data || {};

      this.terminalCommandId = data.terminalCommandId;
      this.name = data.name;
      this.comment = data.comment;
      this.command = data.command;

      this.callback = callback;
      this.showDialog = true;
    },
    hide() {
      this.showDialog = false;
    },
    async doSave() {
      let command = this.command;
      if (this.tool.isEmpty(command)) {
        this.tool.error("请输入命令");
        return;
      }

      let param = this.worker.getParam();
      param.commandType = 2;
      param.terminalCommandId = this.terminalCommandId;
      param.comment = this.comment;
      param.command = this.command;
      let res = await this.server.terminal.command.save(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.tool.success("保存成功");
        this.hide();
        this.callback && this.callback();
      }
    },
    init() {},
  },
  // 在实例创建完成后被立即调用
  created() {},
  // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用
  mounted() {
    this.init();
  },
};
</script>

<style>
</style>
