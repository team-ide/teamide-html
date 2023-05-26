<template>
  <div class="setting-page">
    <el-form class="pdt-10 pdlr-10" size="mini" @submit.native.prevent>
      <div class="pd-5 color-grey-1">登录 相关设置</div>
      <el-form-item
        label="匿名登录（无需账号密码使用系统匿名账号登录，开启后 将自动创建匿名用户 由客户端存放匿名用户ID）"
        class="mgb-5 mglr-10"
      >
        <el-switch
          v-model="source.setting.loginAnonymousEnable"
          @change="toSave('loginAnonymousEnable')"
        ></el-switch>
      </el-form-item>

      <div class="pd-5 color-grey-1">注册 相关设置</div>
      <el-form-item label="开启注册" class="mgb-5 mglr-10">
        <el-switch
          v-model="source.setting.registerEnable"
          @change="toSave('registerEnable')"
        ></el-switch>
      </el-form-item>

      <div class="pd-5 color-grey-1">终端 相关设置</div>
      <el-form-item
        label="开启本地终端（允许连接到程序所在服务器终端）"
        class="mgb-5 mglr-10"
      >
        <el-switch
          v-model="source.setting.terminalLocalEnable"
          @change="toSave('terminalLocalEnable')"
        ></el-switch>
      </el-form-item>
      <el-form-item
        label="开启节点终端（允许连接到节点所在服务器终端）"
        class="mgb-5 mglr-10"
      >
        <el-switch
          v-model="source.setting.terminalNodeEnable"
          @change="toSave('terminalNodeEnable')"
        ></el-switch>
      </el-form-item>

      <div class="pd-5 color-grey-1">文件管理器 相关设置</div>
      <el-form-item
        label="开启本地文件管理器（允许连接到程序所在服务器文件管理器）"
        class="mgb-5 mglr-10"
      >
        <el-switch
          v-model="source.setting.fileManagerLocalEnable"
          @change="toSave('fileManagerLocalEnable')"
        ></el-switch>
      </el-form-item>
      <el-form-item
        label="开启节点文件管理器（允许连接到节点所在服务器文件管理器）"
        class="mgb-5 mglr-10"
      >
        <el-switch
          v-model="source.setting.fileManagerNodeEnable"
          @change="toSave('fileManagerNodeEnable')"
        ></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    async init() {},
    refresh() {
      this.$nextTick(() => {});
    },
    async toSave(name) {
      let data = {};
      data[name] = this.source.setting[name];
      let res = await this.server.setting.save(data);
      if (res.code == 0) {
        this.tool.success("设置成功！");
      } else {
        this.tool.error(res.msg);
        if (typeof this.source.setting[name] == "boolean") {
          this.source.setting[name] = !this.source.setting[name];
        }
      }
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.setting-page {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
