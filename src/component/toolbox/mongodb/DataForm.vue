<template>
  <el-dialog
    ref="modal"
    :title="`库[${databaseName}]集合[${collectionName}]数据`"
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
      <el-form
        ref="form"
        size="mini"
        @submit.native.prevent
        style="height: 100%"
      >
        <div class="tm-row" style="height: calc(100%)">
          <el-form-item
            label="数据"
            style="height: 100%"
            class="editor-form-item mg-0"
          >
            <div
              style="
                height: calc(100% - 60px) !important;
                display: inline-block;
                width: 100%;
              "
            >
              <Editor
                ref="docValue"
                :source="source"
                language="json"
                :change="onChangeDocValue"
              ></Editor>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="pd-10">
      <div
        class="tm-btn bg-teal-8 ft-13"
        :class="{ 'tm-disabled': saveBtnDisabled }"
        @click="doSave"
      >
        保存
      </div>
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
      databaseName: null,
      collectionName: null,
      docValue: null,
      saveBtnDisabled: false,
    };
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算
  computed: {},
  // 计算属性 数据变，直接会触发相应的操作
  watch: {},
  methods: {
    onChangeDocValue(value) {
      this.docValue = value;
    },
    show(data, columnList, callback) {
      data = data || {};

      this.databaseName = data.databaseName;
      this.collectionName = data.collectionName;
      this.id = data.id;
      this.idType = data.idType;
      let doc = data.doc || "";

      if (this.tool.isEmpty(doc)) {
        let d = {};
        columnList.forEach((column) => {
          if (column.isObjectID) {
            return;
          }
          d[column.name] = null;
        });
        doc = this.tool.JSONbig.stringify(d, null, "  ");
      }

      this.callback = callback;
      this.showDialog = true;
      this.$nextTick(() => {
        this.docValue = doc;
        this.$refs.docValue.setValue(this.docValue);
      });
    },
    hide() {
      this.showDialog = false;
    },
    async doSave() {
      try {
        this.tool.JSONbig.parse(this.docValue);
      } catch (e) {
        this.tool.error("请输入有效JSON:" + e);
        return;
      }

      this.saveBtnDisabled = true;

      let param = {
        databaseName: this.databaseName,
        collectionName: this.collectionName,
        doc: this.docValue,
        id: this.id,
        idType: this.idType,
      };
      let flag = await this.callback(param);
      this.saveBtnDisabled = false;
      if (flag) {
        this.hide();
      }
    },
    init() {},
  },
  // 在实例创建完成后被立即调用
  created() {},
  // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用
  mounted() {
    this.toolboxWorker.showDataForm = this.show;
    this.toolboxWorker.hideDataForm = this.hide;
    this.init();
  },
};
</script>

<style>
.editor-form-item .el-form-item__content {
  height: 100%;
}
</style>
