<template>
  <div class="form-box tm-row">
    <div
      class="tm-row"
      :style="{
        height: formHeight,
      }"
    >
      <template v-for="formObject in formObjectList">
        <div :key="formObject.key" class="form-one">
          <Form
            :ref="formObject.key"
            :source="source"
            :formBuild="formObject.formBuild"
            :formData="formObject.formData"
            :checkShowPlaintextBtn="checkShowPlaintextBtn"
          >
          </Form>
        </div>
      </template>
    </div>
    <div class="tm-row" style="clear: both">
      <div>
        <div
          v-if="onSave != null"
          class="tm-btn bg-teal-8 ft-13 mgt-5"
          :class="{ 'tm-disabled': saveBtnDisabled }"
          @click="doSave"
        >
          {{ saveText || "保存" }}
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: [
    "source",
    "onSave",
    "saveText",
    "onSuccess",
    "formHeight",
    "checkShowPlaintextBtn",
  ],
  data() {
    return {
      formObjectList: [],
      saveBtnDisabled: false,
      formConfigList: [],
    };
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算
  computed: {},
  // 计算属性 数据变，直接会触发相应的操作
  watch: {},
  methods: {
    build(formConfigList, options) {
      this.options = options;
      this.formConfigList = formConfigList || [];
      this.formObjectList = [];

      this.formConfigList.forEach((formConfig) => {
        let formBuild = this.form.build(formConfig.form);
        let formData = formBuild.newDefaultData();
        if (Object.keys(formConfig.data).length > 0) {
          for (let key in formData) {
            if (formConfig.data[key] !== undefined) {
              formData[key] = formConfig.data[key];
            }
          }
        }
        let formObject = {};
        formObject.key = "form-" + this.tool.getNumber();
        formObject.formBuild = formBuild;
        formObject.formData = formData;

        this.formObjectList.push(formObject);
      });
    },
    async validate() {
      let validateResult = { valid: true };
      for (let i = 0; i < this.formObjectList.length; i++) {
        validateResult = await this.validateForm(i);
        if (!validateResult.valid) {
          return validateResult;
        }
      }
      return validateResult;
    },
    async validateForm(formIndex) {
      let validateResult = { valid: true };
      let formObject = this.formObjectList[formIndex];
      validateResult = await formObject.formBuild.validate(formObject.formData);
      if (!validateResult.valid) {
        return validateResult;
      }
      return validateResult;
    },
    getDataList() {
      let dataList = [];
      for (let i = 0; i < this.formObjectList.length; i++) {
        let formObject = this.formObjectList[i];
        let data = {};
        Object.assign(data, formObject.formData);
        dataList.push(data);
      }
      return dataList;
    },
    async doSave() {
      this.saveBtnDisabled = true;
      let validateResult = await this.validate();
      if (!validateResult.valid) {
        this.saveBtnDisabled = false;
        return;
      }
      let mergeData = {};
      let dataList = [];
      for (let i = 0; i < this.formObjectList.length; i++) {
        let formObject = this.formObjectList[i];
        let data = {};
        Object.assign(data, formObject.formData);
        Object.assign(mergeData, formObject.formData);
        dataList.push(data);
      }
      let options = this.options || {};
      options.mergeData = mergeData;
      let flag = await this.onSave(dataList, options);
      this.saveBtnDisabled = false;
      if (flag) {
        this.onSuccess && this.onSuccess();
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
