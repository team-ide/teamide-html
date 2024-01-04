<template>
  <FormBox
    style="height: 100%"
    class="pd-10"
    ref="FormBox"
    :source="source"
    :onSave="doSave"
    :saveText="options.saveText"
    :formHeight="formHeight"
    :checkShowPlaintextBtn="checkShowPlaintextBtn"
  >
  </FormBox>
</template>

<script>
export default {
  components: {},
  props: ["source", "options", "onSave", "onSuccess"],
  data() {
    return {
      formHeight: "100%",
      doSave: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    checkShowPlaintextBtn() {},
    async getFormList() {
      if (this.options.formType == "es-index") {
        return [this.form.toolbox.elasticsearch.index];
      } else if (this.options.formType == "kafka-topic") {
        return [this.form.toolbox.kafka.topic];
      } else if (this.options.formType == "kafka-commit") {
        return [this.form.toolbox.kafka.commit];
      } else if (this.options.formType == "kafka-push") {
        return [this.form.toolbox.kafka.push];
      } else if (this.options.formType == "kafka-delete-record") {
        return [this.form.toolbox.kafka.deleteRecord];
      } else if (this.options.formType == "other-server") {
        return [
          {
            fields: [
              {
                label: "名称",
                name: "name",
                rules: [
                  {
                    required: true,
                    message: `名称不能为空!`,
                  },
                ],
              },
              {
                label: "地址",
                name: "url",
                rules: [
                  {
                    required: true,
                    message: `地址不能为空!`,
                  },
                ],
              },
            ],
          },
        ];
      } else {
        this.tool.error("不识别的表单类型[formType]");
      }
      return [];
    },
    async init() {
      if (this.onSave != null) {
        this.formHeight = "calc(100% - 60px)";
        this.doSave = this.doSave_;
      }
      let options = this.options;
      let formConfigList = [];
      let formList = await this.getFormList();
      let dataList = options.data || [];
      if (!Array.isArray(dataList)) {
        dataList = [dataList];
      }
      formList.forEach((form, index) => {
        let formConfig = {};
        formConfig.form = form;
        formConfig.data = dataList[index];
        formConfigList.push(formConfig);
      });
      let form_ = this.$refs.FormBox;
      form_.build(formConfigList, options);
    },

    async doSave_(dataList) {
      let data = dataList[0];
      let param = this.options.param || {};
      let res = null;
      if (this.options.formType == "es-index") {
        Object.assign(param, data);
        res = await this.server.elasticsearch.createIndex(param);
      } else if (this.options.formType == "kafka-topic") {
        Object.assign(param, data);
        param.numPartitions = Number(param.numPartitions);
        param.replicationFactor = Number(param.replicationFactor);
        res = await this.server.kafka.createTopic(param);
      } else if (this.options.formType == "kafka-commit") {
        Object.assign(param, data);
        param.partition = Number(param.partition);
        param.offset = Number(param.offset);
        res = await this.server.kafka.commit(param);
      } else if (this.options.formType == "kafka-push") {
        Object.assign(param, data);
        res = await this.server.kafka.push(param);
      } else if (this.options.formType == "kafka-delete-record") {
        Object.assign(param, data);
        param.partition = Number(param.partition);
        param.offset = Number(param.offset);
        res = await this.server.kafka.deleteRecords(param);
      } else if (this.options.formType == "other-server") {
        Object.assign(param, data);

        let url = param.url;
        try {
          new URL(url);
        } catch (error) {
          this.tool.error("请填写正确地址");
          return false;
        }
        delete param.url;
        param.extendId = this.options.extendId;
        param.extendType = "otherServer";
        param.extend = {
          url: url,
        };
        res = await this.server.toolbox.extend.save(param);
      } else {
        this.tool.error("不识别的表单类型[formType]");
        return false;
      }
      let error = null;
      let isSuccess = true;
      if (res && res.code != 0) {
        error = res.msg;
        isSuccess = false;
      }
      if (!isSuccess) {
        this.tool.error(error);
      } else {
        if (this.onSuccess) {
          this.onSuccess();
        }
      }
      if (this.onSave) {
        this.onSave(isSuccess);
      }
      return isSuccess;
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
</style>
