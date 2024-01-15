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
      <el-table-column label="">
        <template slot-scope="scope" v-if="scope.row.extend != null">
          <div
            class=""
            v-if="
              scope.row.extend.ownerTotal != 0 ||
              scope.row.extend.tableTotal != 0
            "
          >
            <span class="mglr-10">
              库：
              <span>
                {{ scope.row.extend.ownerTotal }}
                /
                <span class="color-green">
                  {{ scope.row.extend.ownerCount.success }}
                </span>
                /
                <span class="color-red">
                  {{ scope.row.extend.ownerCount.error }}
                </span>
              </span>
            </span>
            <span class="mglr-10">
              表：
              <span>
                {{ scope.row.extend.tableTotal }}
                /
                <span class="color-green">
                  {{ scope.row.extend.tableCount.success }}
                </span>
                /
                <span class="color-red">
                  {{ scope.row.extend.tableCount.error }}
                </span>
              </span>
            </span>
          </div>
          <div
            class=""
            v-if="
              scope.row.extend.readCount.total != 0 ||
              scope.row.extend.writeCount.total != 0
            "
          >
            <span class="mglr-10">
              数据读取：
              <span>
                {{ scope.row.extend.readCount.total }}
                /
                <span class="color-green">
                  {{ scope.row.extend.readCount.success }}
                </span>
                /
                <span class="color-red">
                  {{ scope.row.extend.readCount.error }}
                </span>
              </span>
            </span>
            <span class="mglr-10">
              写入读取：
              <span>
                {{ scope.row.extend.writeCount.total }}
                /
                <span class="color-green">
                  {{ scope.row.extend.writeCount.success }}
                </span>
                /
                <span class="color-red">
                  {{ scope.row.extend.writeCount.error }}
                </span>
              </span>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="附件" width="100px">
        <template slot-scope="scope">
          <div class="color-orange" v-if="scope.row.annexInfo != null">
            {{ tool.getSizeText(scope.row.annexInfo.allFileSize) }}
          </div>
          <div class="color-orange" v-else>暂无附件信息</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
          <div
            v-if="scope.row.isEnd"
            class="tm-link color-grey mgr-10"
            @click="tool.showJSONData(scope.row)"
          >
            查看
          </div>
          <div
            v-if="!scope.row.isEnd"
            class="tm-link color-orange mgr-10"
            @click="toStop(scope.row)"
          >
            停止
          </div>
          <div
            v-if="scope.row.isEnd"
            class="tm-link color-red mgr-10"
            @click="toDelete(scope.row)"
          >
            删除
          </div>
          <a
            v-if="scope.row.isEnd && scope.row.hasAnnex"
            class="tm-link color-blue mgr-10"
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
    async get(taskKey) {
      let res = await this.server.datamove.get({ taskKey: taskKey });
      if (res.code != 0) {
        this.tool.error(res.msg);
        return;
      }
      return res.data;
    },
    async checkTask(one) {
      if (one == null || one.isEnd || this.tool.isEmpty(one.key)) {
        return;
      }
      let taskKey = one.key;
      let res = await this.server.datamove.get({ taskKey: taskKey });
      if (res.data == null) {
        return;
      }
      if (this.taskList.indexOf(one) < 0) {
        return;
      }
      Object.assign(one, res.data);
      if (!one.isEnd) {
        setTimeout(() => {
          this.checkTask(one);
        }, 2000);
      }
    },
    async loadList() {
      let res = await this.server.datamove.list({});
      if (res.code != 0) {
        this.tool.error(res.msg);
        return;
      }
      let taskList = res.data || [];
      taskList.forEach((one) => {
        this.checkTask(one);
      });
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
