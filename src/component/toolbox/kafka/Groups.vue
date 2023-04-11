<template>
  <div class="toolbox-kafka-groups">
    <tm-layout height="100%">
      <tm-layout height="80px">
        <el-form class="pdt-10 pdlr-10" size="mini" inline>
          <el-form-item label="主题" class="mgb-5">
            <el-input v-model="topic" style="width: 300px" />
          </el-form-item>
          <el-form-item label="搜索" class="mgb-5">
            <el-input v-model="searchForm.pattern" style="width: 300px" />
          </el-form-item>
          <el-form-item label="" class="mgb-5">
            <div class="tm-btn tm-btn-xs bg-grey-6" @click="loadGroups">
              刷新
            </div>
          </el-form-item>
        </el-form>
      </tm-layout>
      <tm-layout height="auto">
        <template v-if="groups == null">
          <div class="text-center ft-13 pdtb-10">数据加载中，请稍后!</div>
        </template>
        <template v-else-if="groups.length == 0">
          <div class="text-center ft-13 pdtb-10">暂无匹配数据!</div>
        </template>
        <template v-else>
          <div class="text-center ft-13 pdtb-10" style="height: 40px">
            Groups （{{ groups.length }}）
            <span class="color-orange">双击查看Group信息</span>
          </div>
          <div
            class="data-list-box app-scroll-bar"
            style="height: calc(100% - 40px); user-select: text"
          >
            <template v-for="(one, index) in groups">
              <div
                :key="index"
                v-if="
                  tool.isEmpty(searchForm.pattern) ||
                  one.groupId
                    .toLowerCase()
                    .indexOf(searchForm.pattern.toLowerCase()) >= 0
                "
                class="data-list-one"
                @click="rowClick(one)"
                @contextmenu="dataContextmenu(one)"
              >
                <div class="data-list-one-text">
                  {{ one.groupId }}
                </div>
              </div>
            </template>
          </div>
        </template>
      </tm-layout>
    </tm-layout>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      groups: null,
      topic: null,
      topicInfo: null,
      searchForm: {
        pattern: null,
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      if (this.extend && this.extend.topic) {
        this.topic = this.extend.topic;
      }
      await this.loadGroups();
    },
    refresh() {
      this.loadGroups();
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
      this.showGroup(data);
    },
    async showGroup(data) {
      let groupInfo = {};
      Object.assign(groupInfo, data);

      let param = this.toolboxWorker.getWorkParam({
        groupId: data.groupId,
      });
      let res = await this.server.kafka.group.describe(param);
      if (res.code == 0) {
        Object.assign(groupInfo, res.data);
      } else {
        this.tool.error(res.msg);
      }
      let topic = this.topic;
      let topicInfo = null;
      if (topic) {
        param = this.toolboxWorker.getWorkParam({
          topic: topic,
          time: -1,
        });
        res = await this.server.kafka.topic(param);
        topicInfo = res.data;
      }

      if (topicInfo && topicInfo.partitions) {
        let partitions = [];

        topicInfo.partitions.forEach((one) => {
          partitions.push(one.partition);
        });
        param = this.toolboxWorker.getWorkParam({
          groupId: data.groupId,
        });
        param.topicPartitions = {};
        param.topicPartitions[topicInfo.topic] = partitions;
        res = await this.server.kafka.group.offsets(param);
        if (res.code != 0) {
          this.tool.error(res.msg);
        }
        groupInfo.offsets = res.data;
      }
      // res = this.server.kafka.group.describe(param);
      // if (res.code == 0) {
      //   Object.assign(groupInfo, res.data);
      // } else {
      //   this.tool.error(res.msg);
      // }
      this.tool.showJSONData(groupInfo);
      // this.selectGroup = groupInfo;
    },
    dataContextmenu(data) {
      let menus = [];
      menus.push({
        header: data.groupId,
      });
      menus.push({
        text: "查看",
        onClick: () => {
          this.showGroup(data);
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
    toDelete(data) {
      let msg = "确认组";
      msg += "[" + data.groupId + "]";
      msg += "?";
      this.tool
        .confirm(msg)
        .then(async () => {
          this.doDelete(data.groupId);
        })
        .catch((e) => {});
    },
    async doDelete(groupId) {
      let param = this.toolboxWorker.getWorkParam({
        groupId: groupId,
      });
      let res = await this.server.kafka.group.delete(param);
      if (res.code == 0) {
        this.tool.success("删除成功!");
        this.loadGroups();
      } else {
        this.tool.error(res.msg);
      }
    },
    async loadGroups() {
      this.groups = null;
      let param = this.toolboxWorker.getWorkParam({});
      let res = await this.server.kafka.group.list(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || [];

      let groups = [];
      list.forEach((one) => {
        groups.push(one);
      });
      this.groups = groups;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-kafka-groups {
  width: 100%;
  height: 100%;
}
</style>
