<template>
  <div class="toolbox-kafka-topic">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout height="80px">
          <el-form class="pdt-10 pdlr-10" size="mini" inline>
            <el-form-item label="搜索" class="mgb-5">
              <el-input v-model="searchForm.pattern" style="width: 300px" />
            </el-form-item>
            <el-form-item label="" class="mgb-5">
              <div class="tm-btn tm-btn-xs bg-grey-6" @click="loadTopics">
                刷新
              </div>
              <div class="tm-btn tm-btn-xs bg-teal-8" @click="toInsert">
                新建主题
              </div>
              <div class="tm-btn tm-btn-xs bg-grey" @click="toImport()">
                导入
              </div>
              <div class="tm-btn tm-btn-xs bg-grey" @click="toExport()">
                导出
              </div>
              <div
                class="tm-btn tm-btn-xs bg-grey"
                @click="toolboxWorker.showInfo()"
              >
                信息
              </div>
              <div class="tm-btn tm-btn-xs bg-orange" @click="openGroups()">
                组
              </div>
            </el-form-item>
          </el-form>
        </tm-layout>
        <tm-layout height="auto">
          <template v-if="topics == null">
            <div class="text-center ft-13 pdtb-10">数据加载中，请稍后!</div>
          </template>
          <template v-else-if="topics.length == 0">
            <div class="text-center ft-13 pdtb-10">暂无匹配数据!</div>
          </template>
          <template v-else>
            <div class="text-center ft-13 pdtb-10" style="height: 40px">
              Topics （{{ topics.length }}）
              <span class="color-orange">双击查看Topic数据</span>
            </div>
            <div
              class="data-list-box app-scroll-bar"
              style="height: calc(100% - 40px); user-select: text"
            >
              <template v-for="(one, index) in topics">
                <div
                  :key="index"
                  v-if="
                    tool.isEmpty(searchForm.pattern) ||
                    one.topic
                      .toLowerCase()
                      .indexOf(searchForm.pattern.toLowerCase()) >= 0
                  "
                  class="data-list-one"
                  @click="rowClick(one)"
                  @contextmenu="dataContextmenu(one)"
                >
                  <div class="data-list-one-text">
                    {{ one.topic }}
                    <template v-if="one.partitions != null">
                      <span class="ft-12">
                        （P:{{ one.partitions.length }}）
                      </span>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </tm-layout>
      </tm-layout>
    </template>
    <FormDialog
      ref="TopicForm"
      :source="source"
      title="主题"
      :onSave="doInsert"
    ></FormDialog>
    <FormDialog
      ref="CommitForm"
      :source="source"
      title="主题提交"
      :onSave="doCommit"
    ></FormDialog>
    <FormDialog
      ref="DeleteRecordForm"
      :source="source"
      title="删除记录"
      :onSave="doDeleteRecord"
    ></FormDialog>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      ready: false,
      topics: null,
      searchForm: {
        pattern: null,
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {
      this.ready = true;
      this.loadTopics();
    },
    refresh() {
      this.loadTopics();
    },
    rowClick(data) {
      this.rowClickTimeCache = this.rowClickTimeCache || {};
      let nowTime = new Date().getTime();
      let clickTime = this.rowClickTimeCache[data];
      this.rowClickTimeCache[data] = nowTime;
      if (clickTime) {
        let timeout = nowTime - clickTime;
        if (timeout < 300) {
          delete this.rowClickTimeCache[data];
          this.rowDbClick(data);
        }
      }
    },
    rowDbClick(data) {
      this.toOpenTopic(data);
    },
    openGroups(data) {
      let extend = {
        type: "groups",
      };
      if (data) {
        extend.name = data.topic + "组";
        extend.title = data.topic + "组";
        extend.topic = data.topic;
        extend.onlyOpenOneKey = "kafka:topic:" + data.topic + ":groups";
      } else {
        extend.name = "组";
        extend.title = "组";
        extend.onlyOpenOneKey = "kafka:groups";
      }
      this.toolboxWorker.openTabByExtend(extend);
    },
    toOpenTopic(data) {
      let extend = {
        name: data.topic,
        title: data.topic,
        type: "data",
        topic: data.topic,
        onlyOpenOneKey: "kafka:data:topic" + data.topic,
      };
      this.toolboxWorker.openTabByExtend(extend);
    },
    dataContextmenu(data) {
      let menus = [];
      menus.push({
        header: data.topic,
      });
      menus.push({
        text: "数据",
        onClick: () => {
          this.toOpenTopic(data);
        },
      });
      menus.push({
        text: "组",
        onClick: () => {
          this.openGroups(data);
        },
      });
      menus.push({
        text: "查看主题",
        onClick: () => {
          this.showTopic(data);
        },
      });
      menus.push({
        text: "主题Commit",
        onClick: () => {
          this.toCommit(data);
        },
      });
      menus.push({
        text: "删除记录",
        onClick: () => {
          this.toDeleteRecord(data);
        },
      });
      menus.push({
        text: "导入",
        onClick: () => {
          this.toImport(data);
        },
      });
      menus.push({
        text: "导出",
        onClick: () => {
          this.toExport(data);
        },
      });
      menus.push({
        text: "删除",
        onClick: () => {
          this.toDelete(data);
        },
      });
      if (menus.length > 0) {
        this.tool.showContextmenu(menus);
      }
    },
    async toExport(data) {
      this.tool.warn("功能还未完善，敬请期待！");
      return;
    },
    async toImport(data) {
      this.tool.warn("功能还未完善，敬请期待！");
      return;
    },
    async showTopic(topic) {
      let param = this.toolboxWorker.getWorkParam({});
      param.topic = topic.topic;
      param.time = -1;
      let res = await this.server.kafka.topic(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        let data = res.data || {};
        res = await this.server.kafka.topicDescribe(param);
        if (res.code != 0) {
          this.tool.error(res.msg);
        } else {
          let topicDescribe = res.data || {};
          let partitions = topicDescribe.partitions || [];
          delete topicDescribe.partitions;
          data.partitions = data.partitions || [];
          data.partitions.forEach((one) => {
            let find = null;
            partitions.forEach((f) => {
              if (f.ID == one.partition || f.id == one.partition) {
                find = f;
              }
            });
            Object.assign(one, find);
          });
          Object.assign(data, topicDescribe);
          this.tool.showJSONData(data);
        }
      }
    },
    toInsert() {
      let data = {};

      this.$refs.TopicForm.show({
        title: `创建主题`,
        form: [this.form.toolbox.kafka.topic],
        data: [data],
      });
    },
    async doInsert(dataList) {
      let data = dataList[0];
      let param = this.toolboxWorker.getWorkParam({
        topic: data.topic,
        numPartitions: Number(data.numPartitions),
        replicationFactor: Number(data.replicationFactor),
      });
      let res = await this.server.kafka.createTopic(param);
      if (res.code == 0) {
        await this.loadTopics();
        return true;
      } else {
        this.tool.error(res.msg);
        return false;
      }
    },
    toCommit(topic) {
      let data = {
        topic: topic.topic,
        partition: 0,
        offset: 0,
        groupId: "test-group",
      };

      this.$refs.CommitForm.show({
        title: `主题提交`,
        form: [this.form.toolbox.kafka.commit],
        data: [data],
      });
    },
    async doCommit(dataList) {
      let data = dataList[0];
      let param = this.toolboxWorker.getWorkParam({
        topic: data.topic,
        groupId: data.groupId,
        partition: Number(data.partition),
        offset: Number(data.offset),
      });
      let res = await this.server.kafka.commit(param);
      if (res.code == 0) {
        this.tool.success("主题提交成功");
        return true;
      } else {
        this.tool.error(res.msg);
        return false;
      }
    },
    toDeleteRecord(topic) {
      let data = {
        topic: topic.topic,
        partition: 0,
        offset: 0,
      };

      this.$refs.DeleteRecordForm.show({
        title: `删除记录`,
        form: [this.form.toolbox.kafka.deleteRecord],
        data: [data],
      });
    },
    async doDeleteRecord(dataList) {
      let data = dataList[0];
      let param = this.toolboxWorker.getWorkParam({
        topic: data.topic,
        partition: Number(data.partition),
        offset: Number(data.offset),
      });
      let res = await this.server.kafka.deleteRecords(param);
      if (res.code == 0) {
        this.tool.success("记录删除成功");
        return true;
      } else {
        this.tool.error(res.msg);
        return false;
      }
    },
    toDelete(data) {
      let msg = "确认删除";
      msg += "主题[" + data.topic + "]";
      msg += "?";
      this.tool
        .confirm(msg)
        .then(async () => {
          this.doDelete(data.topic);
        })
        .catch((e) => {});
    },
    async doDelete(topic) {
      let param = this.toolboxWorker.getWorkParam({
        topic: topic,
      });
      let res = await this.server.kafka.deleteTopic(param);
      if (res.code == 0) {
        this.tool.success("删除成功!");
        this.loadTopics();
      } else {
        this.tool.error(res.msg);
      }
    },
    async loadTopics() {
      this.topics = null;
      let param = this.toolboxWorker.getWorkParam({});
      let res = await this.server.kafka.topics(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      this.topics = res.data || [];
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-kafka-topic {
  width: 100%;
  height: 100%;
}
</style>
