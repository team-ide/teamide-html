<template>
  <el-dialog
    ref="modal"
    :title="'新建'"
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
    <el-form
      class="pd-10"
      ref="form"
      :model="form"
      size="mini"
      label-width="200px"
    >
      <el-form-item label="名称">
        <el-input v-model="form.name"> </el-input>
      </el-form-item>
      <el-form-item label="目录" v-if="form.parentId == null">
        <el-checkbox v-model="form.isDir"> </el-checkbox>
      </el-form-item>
      <el-form-item label="地址" v-if="!form.isDir">
        <el-input v-model="form.path"> </el-input>
      </el-form-item>
    </el-form>
    <div class="pd-10">
      <div class="tm-btn bg-green ft-13" @click="toCreate">保存</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: ["source", "toolboxWorker"],
  data() {
    return {
      showDialog: false,
      form: {
        name: "default",
        isDir: false,
        path: null,
        parentId: null,
      },
    };
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算
  computed: {},
  // 计算属性 数据变，直接会触发相应的操作
  watch: {},
  methods: {
    async show(data, callback) {
      data = data || {};
      this.callback = callback;
      this.form.isDir = data.isDir;
      this.form.name = data.name || "default";
      this.form.path = data.path;
      this.form.parentId = data.parentId;
      this.showDialog = true;
    },
    hide() {
      this.showDialog = false;
    },
    async toCreate() {
      let param = this.toolboxWorker.getWorkParam({
        extendType: "http-api",
        name: this.form.name,
        extend: {
          path: this.form.path,
          isDir: this.form.isDir,
          parentId: this.form.parentId,
        },
      });
      let res = await this.server.toolbox.extend.save(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.tool.success("创建成功");
        this.callback && this.callback(res.data);
        this.hide();
      }
    },
    init() {},
  },
  // 在实例创建完成后被立即调用
  created() {},
  // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用
  mounted() {
    this.toolboxWorker.showPackCreate = this.show;
    this.init();
  },
};
</script>

<style>
</style>
