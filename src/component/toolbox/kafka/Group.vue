<template>
  <div class="toolbox-kafka-group">
    <template v-if="selectGroup != null">
      {{ selectGroup }}
    </template>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      groups: null,
      searchForm: {
        pattern: null,
      },
      group: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {
      this.loadGroups();
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
      this.toOpenGroup(data);
    },
    async toOpenGroup(data) {
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
      // res = this.server.kafka.group.describe(param);
      // if (res.code == 0) {
      //   Object.assign(groupInfo, res.data);
      // } else {
      //   this.tool.error(res.msg);
      // }
      this.selectGroup = groupInfo;
    },
    dataContextmenu(data) {
      let menus = [];
      menus.push({
        header: data.groupId,
      });
      menus.push({
        text: "查看",
        onClick: () => {
          this.toOpenGroup(data);
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
.toolbox-kafka-group {
  width: 100%;
  height: 100%;
}
</style>
