<template>
  <div>
    <el-table class="" :data="taskList" border size="mini" height="100%">
      <el-table-column label="任务时间" width="145px">
        <template slot-scope="scope">
          <div class="text-center">
            <span class="color-grey">
              {{
                tool.formatDateByTime(
                  new Date(scope.row.startTime),
                  "yyyy-MM-dd HH:mm:ss"
                )
              }}
            </span>
            <br />
            <span class="color-grey" v-if="scope.row.isEnd">
              {{
                tool.formatDateByTime(
                  new Date(scope.row.endTime),
                  "yyyy-MM-dd HH:mm:ss"
                )
              }}
            </span>
            <span class="color-orange" v-else> 执行中 </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="From" width="100px">
        <template slot-scope="scope">
          <div
            class="color-orange"
            v-if="scope.row.request != null && scope.row.request.from != null"
          >
            {{ scope.row.request.from.type }}
          </div>
          <div class="color-orange" v-else>暂无信息</div>
        </template>
      </el-table-column>
      <el-table-column label="To" width="100px">
        <template slot-scope="scope">
          <div
            class="color-orange"
            v-if="scope.row.request != null && scope.row.request.to != null"
          >
            {{ scope.row.request.to.type }}
          </div>
          <div class="color-orange" v-else>暂无信息</div>
        </template>
      </el-table-column>
      <el-table-column label=""> </el-table-column>
      <el-table-column label="附件" width="100px">
        <template slot-scope="scope">
          <div class="color-orange" v-if="scope.row.annexInfo != null">
            {{ tool.getSizeText(scope.row.annexInfo.allFileSize) }}
          </div>
          <div class="color-orange" v-else>暂无附件信息</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <div
            v-if="!scope.row.isEnd"
            class="tm-link color-orange mgr-20"
            @click="toStop(scope.row)"
          >
            停止
          </div>
          <div
            v-if="scope.row.isEnd"
            class="tm-link color-red mgr-20"
            @click="toDelete(scope.row)"
          >
            删除
          </div>
          <a
            v-if="scope.row.isEnd && scope.row.hasAnnex"
            class="tm-link color-blue mgr-20"
            :href="getDownloadUrl(scope.row)"
            target="_blank"
          >
            下载
          </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source"],
  data() {
    return {
      taskList: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {
      this.loadList();
    },
    async toStop(taskInfo) {
      let res = await this.server.datamove.stop({
        taskKey: taskInfo.key,
      });
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.tool.success("删除成功");
        this.loadList();
      }
    },
    async toDelete(taskInfo) {
      let msg = "删除该记录将无法恢复，确认删除？";
      this.tool
        .confirm(msg)
        .then(async () => {
          let res = await this.server.datamove.delete({
            taskKey: taskInfo.key,
          });
          if (res.code != 0) {
            this.tool.error(res.msg);
          } else {
            this.tool.success("删除成功");
            this.loadList();
          }
        })
        .catch((e) => {});
    },
    async get(taskKey) {},
    async loadList() {
      let res = await this.server.datamove.list({});
      if (res.code != 0) {
        this.tool.error(res.msg);
        return;
      }
      let taskList = res.data || [];
      taskList.forEach((one) => {});
      taskList.sort((o1, o2) => {
        var a = o1.startTime;
        var b = o2.startTime;
        if (a < b) {
          return 1;
        } else {
          return -1;
        }
      });
      this.taskList = taskList;
    },
    getDownloadUrl(taskInfo) {
      let url = this.source.api + "datamove/download?";
      url = this.tool.appendUrlBaseParam(url);
      url += "&taskKey=" + encodeURIComponent(taskInfo.key);
      return url;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
</style>
