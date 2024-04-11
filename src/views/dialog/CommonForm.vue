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
    <template v-if="options.formType == 'toolbox'">
      <div class="tm-link color-blue-8 ft-14 mgt-10" @click="toTestToolbox()">
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
    </template>
  </FormBox>
</template>

<script>
import form from "@/form";

export default {
  components: {},
  props: ["source", "options", "onSave", "onSuccess"],
  data() {
    return {
      formHeight: "100%",
      doSave: null,
      checkShowPlaintextBtn: null,
      checking: false,
      checkOk: false,
      checkError: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    toolboxPlaintextBtn() {
      let data = this.options.toolboxData;
      if (
        data != null &&
        this.source.login.user != null &&
        data.userId == this.source.login.user.userId
      ) {
        return true;
      }
      return false;
    },
    async toTestToolbox() {
      let toolboxType = this.options.toolboxType;
      let formBox = this.$refs.FormBox;
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
        } else if (toolboxData.toolboxType == "mongodb") {
          res = await this.server.mongodb.check(toolboxData);
        } else {
          if (
            this.server[toolboxData.toolboxType] &&
            this.server[toolboxData.toolboxType].check
          ) {
            res = await this.server[toolboxData.toolboxType].check(toolboxData);
          }
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
    async getFormList() {
      if (this.options.formType == "mongodb-collection") {
        return [this.form.mongodb.collection];
      } else if (this.options.formType == "es-index") {
        return [this.form.toolbox.elasticsearch.index];
      } else if (this.options.formType == "kafka-topic") {
        return [this.form.toolbox.kafka.topic];
      } else if (this.options.formType == "kafka-commit") {
        return [this.form.toolbox.kafka.commit];
      } else if (this.options.formType == "kafka-push") {
        return [this.form.toolbox.kafka.push];
      } else if (this.options.formType == "kafka-delete-record") {
        return [this.form.toolbox.kafka.deleteRecord];
      } else if (this.options.formType == "toolbox") {
        if (this.options.toolboxData) {
          this.checkShowPlaintextBtn = this.toolboxPlaintextBtn;
        }

        let data = {};
        if (this.source.login.user != null) {
          let res = await this.server.toolbox.group.list({});
          if (res.code != 0) {
            this.tool.error(res.msg);
          }
          data = res.data || {};
        }
        let groups = data.groupList || [];
        if (form.toolboxGroupOptions.length == 0) {
          groups.forEach((one) => {
            form.toolboxGroupOptions.push({
              value: one.groupId,
              text: one.name,
            });
          });
        }
        return [this.form.toolbox, this.options.toolboxType.configForm];
      } else if (this.options.formType == "toolbox-group") {
        return [this.form.toolbox.group];
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
        this.tool.error("不识别的表单类型[" + this.options.formType + "]");
      }
      return [];
    },
    async init() {
      if (this.onSave != null) {
        this.formHeight = "calc(100% - 60px)";
        this.doSave = this.doSave_;
      }
      if (this.options.formType == "toolbox") {
        this.formHeight = "calc(100% - 100px)";
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
      if (this.options.formType == "mongodb-collection") {
        Object.assign(param, data);
        res = await this.server.mongodb.collection.create(param);
      } else if (this.options.formType == "es-index") {
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
      } else if (this.options.formType == "toolbox") {
        let toolboxData = dataList[0];
        let optionJSON = dataList[1];
        let toolboxType = this.options.toolboxType;
        toolboxData.toolboxType = toolboxType.name;
        if (this.tool.isEmpty(toolboxData.groupId)) {
          if (this.options.selectGroup) {
            toolboxData.groupId = this.options.selectGroup.groupId;
          } else if (this.options.groupId) {
            toolboxData.groupId = this.options.groupId;
          }
        }
        toolboxData.option = JSON.stringify(optionJSON);
        if (this.options.toolboxId) {
          toolboxData.toolboxId = this.options.toolboxId;
          res = await this.server.toolbox.update(toolboxData);
        } else {
          res = await this.server.toolbox.insert(toolboxData);
        }
      } else if (this.options.formType == "toolbox-group") {
        Object.assign(param, data);
        if (this.options.groupId) {
          param.groupId = this.options.groupId;
          res = await this.server.toolbox.group.update(param);
        } else {
          res = await this.server.toolbox.group.insert(param);
        }
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
        this.tool.error("不识别的表单类型[" + this.options.formType + "]");
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
