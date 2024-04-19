<template>
  <el-dialog
    ref="modal"
    :title="title"
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
    <el-form class="pd-10" size="mini" inline @submit.native.prevent>
      <el-form-item label="路径|名称（如：xxx/xx）">
        <el-input v-model="formData.modelName" />
      </el-form-item>
    </el-form>
    <div class="pd-10">
      <div class="tm-btn bg-green ft-13" @click="toSave()">保存</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: ["source", "worker"],
  data() {
    return {
      showDialog: false,
      title: "",
      formData: {
        modelName: "",
      },
    };
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算
  computed: {},
  // 计算属性 数据变，直接会触发相应的操作
  watch: {},
  methods: {
    async show(options) {
      options = options || {};
      if (this.tool.isEmpty(options.modelType)) {
        this.tool.warn("模型类型 不能为空");
        return;
      }
      this.title = options.title;
      this.modelType = options.modelType;
      this.formData.modelName = options.modelName;
      this.oldModelName = options.modelName;
      this.isUpdate = options.isUpdate;
      this.isPack = options.isPack;
      this.model = options.model;
      this.showDialog = true;
    },
    hide() {
      this.showDialog = false;
    },
    toSave() {
      this.doSave();
    },
    async doSave() {
      if (this.tool.isEmpty(this.modelType)) {
        this.tool.warn("模型类型 不能为空");
        return;
      }
      if (this.tool.isEmpty(this.formData.modelName)) {
        this.tool.warn("路径|名称 不能为空");
        return;
      }
      let res = {};
      if (this.isUpdate) {
        res = await this.worker.rename(
          this.modelType,
          this.oldModelName,
          this.formData.modelName,
          this.isPack
        );
      } else {
        res = await this.worker.insert(
          this.modelType,
          this.formData.modelName,
          this.isPack,
          this.model
        );
      }
      if (res.code != 0) {
        return;
      }
      this.hide();
      return;
    },
    init() {},
  },
  // 在实例创建完成后被立即调用
  created() {},
  // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用
  mounted() {
    this.worker.showModelForm = this.show;
    this.init();
  },
};
</script>

<style>
</style>
