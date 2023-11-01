<template>
  <div class="toolbox-database-test" style="user-select: text">
    <tm-layout height="100%">
      <tm-layout height="300px" class="">
        <el-form size="mini" inline class="pd-10">
          <el-form-item label="连接池maxIdleConn" class="mgb-5">
            <el-input v-model="formData.maxIdleConn" style="width: 80px" />
          </el-form-item>
          <el-form-item label="连接池maxOpenConn" class="mgb-5">
            <el-input v-model="formData.maxOpenConn" style="width: 80px" />
          </el-form-item>
          <el-form-item label="批量执行" class="mgb-5">
            <el-switch v-model="formData.isBatch"> </el-switch>
          </el-form-item>
          <el-form-item v-if="formData.isBatch" label="批量数量" class="mgb-5">
            <el-input v-model="formData.batchSize"> </el-input>
          </el-form-item>

          <el-form-item label="并发线程" class="mgb-5">
            <el-input v-model="formData.worker" style="width: 80px" />
          </el-form-item>
          <el-form-item label="执行时间(分钟)" class="mgb-5">
            <el-input v-model="formData.duration" style="width: 80px" />
          </el-form-item>
          <el-form-item label="执行次数(优先级高于执行时间)" class="mgb-5">
            <el-input v-model="formData.frequency" style="width: 80px" />
            <span class="color-orange ft-12">
              如果配置批量执行，则SQL总执行次数需要 * 批量数量
            </span>
          </el-form-item>
          <el-form-item
            label="统计间隔(秒)"
            title="统计间隔(每秒统计 输入 1 默认 10 秒)"
            class="mgb-5"
          >
            <el-input v-model="formData.countSecond" style="width: 80px" />
          </el-form-item>
          <el-form-item
            label="统计T99"
            title="统计 T99 T90 T80等，高并发下 消耗内存将增加"
            class="mgb-5"
          >
            <el-switch v-model="formData.countTop" />
          </el-form-item>
          <el-form-item label="数据库" class="mgb-5">
            <el-select
              v-model="selectOwnerName"
              style="width: 150px"
              filterable
            >
              <el-option
                v-for="(one, index) in ownerList"
                :key="index"
                :value="one.ownerName"
                :label="one.ownerName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名" class="mgb-5" title="可以指定执行用户">
            <el-input v-model="formData.username" style="width: 80px">
            </el-input>
          </el-form-item>
          <el-form-item label="密码" class="mgb-5" title="可以指定执行用户密码">
            <el-input
              type="password"
              v-model="formData.password"
              autocomplete="new-password"
              style="width: 80px"
            >
            </el-input>
          </el-form-item>
        </el-form>

        <div class="pdlr-10 ft-12 color-orange" style="user-select: text">
          设置变量
        </div>
        <el-table
          :data="formData.scriptVars"
          border
          style="width: 100%"
          size="mini"
        >
          <el-table-column label="名称">
            <template slot-scope="scope">
              <div class="">
                <el-input v-model="scope.row.name" type="text" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="值">
            <template slot-scope="scope">
              <div class="">
                <el-input v-model="scope.row.value" type="text" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <div
                class="tm-link color-grey mglr-5"
                @click="tool.up(formatDate, 'scriptVars', scope.row)"
              >
                上移
              </div>
              <div
                class="tm-link color-grey mglr-5"
                @click="tool.down(formatDate, 'scriptVars', scope.row)"
              >
                下移
              </div>
              <div
                class="tm-link color-grey mglr-5"
                @click="addScriptVar(scope.row)"
              >
                追加
              </div>
              <div
                class="tm-link color-red mglr-5"
                @click="removeScriptVar(scope.row)"
              >
                删除
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pdlr-10 mgt-10">
          <div class="tm-btn tm-btn-sm color-green mgr-10" @click="start()">
            开始
          </div>
          <div
            class="tm-btn tm-btn-sm color-green-7 mgr-10"
            @click="start({ isCallOnce: true })"
          >
            执行一次
          </div>
          <div
            class="tm-btn tm-btn-sm color-grey mgr-10"
            @click="loadTestList()"
          >
            刷新历史测试记录
          </div>
        </div>
      </tm-layout>
      <tm-layout-bar bottom></tm-layout-bar>
      <tm-layout height="60px" class="" style="overflow: hidden">
        <div class="pd-10 ft-12 color-orange" style="user-select: text">
          填写需要测试的SQL，使用`${dataIndex}`表达式可以获取 SQL执行的索引 从 0
          开始

          <a
            class="tm-link color-green tm-pointer mgl-10"
            @click="tool.showJavascriptFunc()"
          >
            点击查看内置函数
          </a>
          <a
            class="tm-link color-green tm-pointer mgl-10"
            @click="tool.showJavascriptExample()"
          >
            示例代码
          </a>
          <div>
            如：INSERT INTO table_a ( id , name , createAt ) VALUES (
            ${dataIndex + 1} , '${util.getUUID()}' , ${util.getNowMilli()} )
          </div>
        </div>
      </tm-layout>
      <tm-layout height="200px" class="" style="overflow: hidden">
        <Editor
          ref="Editor"
          :source="source"
          :value="executeSQL"
          language="sql"
        ></Editor>
      </tm-layout>
      <tm-layout-bar bottom></tm-layout-bar>
      <tm-layout height="auto">
        <div
          class="ft-12 pd-5"
          v-if="callOnceResult != null && callOnceResult.request != null"
        >
          <div>
            执行一次SQL配置:
            <span class="color-grey pdl-5">
              {{ callOnceResult.request.testSql }}
            </span>
          </div>
          <div>
            执行SQL:
            <span class="color-grey pdl-5">
              {{ callOnceResult.exeSql }}
            </span>
          </div>
          <div v-if="tool.isNotEmpty(callOnceResult.error)" class="color-red">
            异常:
            <span class="pdl-5">
              {{ callOnceResult.error }}
            </span>
          </div>
        </div>
        <el-table
          :data="testList"
          style="width: 100%"
          :border="true"
          size="mini"
        >
          <el-table-column label="" width="40px">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="任务" prop="startTime" width="160px">
            <template slot-scope="scope">
              <div class="">
                <div>
                  <span class="color-green pdl-5">
                    {{
                      tool.formatDate(
                        new Date(scope.row.startTime / 1000000),
                        "yyyy-MM-dd hh:mm:ss.S"
                      )
                    }}
                  </span>
                </div>
                <div>
                  <span class="color-green pdl-5" v-if="scope.row.isEnd">
                    {{
                      tool.formatDate(
                        new Date(scope.row.endTime / 1000000),
                        "yyyy-MM-dd hh:mm:ss.S"
                      )
                    }}
                  </span>
                  <span class="color-green pdl-5" v-else> 执行中 </span>
                </div>
                <div style="word-wrap: break-word; white-space: normal">
                  执行SQL:
                  <span class="color-grey pdl-5">
                    {{ scope.row.request.testSql }}
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="总/成功/失败" prop="count" width="120px">
            <template slot-scope="scope">
              <div class="">
                {{ scope.row.count }}
                <br />
                <span class="color-green">
                  {{ scope.row.successCount }}
                </span>
                <br />
                <span class="color-red">
                  {{ scope.row.errorCount }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="任务用时" prop="total">
            <template slot-scope="scope">
              {{ tool.formatTimeStr(Number(scope.row.total)) }}
            </template>
          </el-table-column>
          <el-table-column label="执行用时" prop="total">
            <template slot-scope="scope">
              {{ tool.formatTimeStr(Number(scope.row.execute)) }}
            </template>
          </el-table-column>
          <el-table-column label="累计用时" prop="use">
            <template slot-scope="scope">
              {{ tool.formatTimeStr(Number(scope.row.use)) }}
            </template>
          </el-table-column>
          <el-table-column label="TPS" prop="tps" width="60px">
          </el-table-column>
          <el-table-column label="Avg" prop="avg" width="60px">
          </el-table-column>
          <el-table-column label="Min" prop="min" width="60px">
          </el-table-column>
          <el-table-column label="Max" prop="max" width="60px">
          </el-table-column>
          <el-table-column label="T50" prop="t50" width="60px">
          </el-table-column>
          <el-table-column label="T90" prop="t90" width="60px">
          </el-table-column>
          <el-table-column label="T99" prop="t99" width="60px">
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="120px">
            <template slot-scope="scope">
              <div
                class="tm-link color-green mglr-5"
                @click="toShowChart(scope.row)"
              >
                图表
              </div>
              <br />
              <div
                class="tm-link color-orange mglr-5"
                v-if="!scope.row.isEnd"
                @click="toStop(scope.row)"
              >
                停止
              </div>
              <div
                class="tm-link color-red mglr-5"
                @click="toDelete(scope.row)"
              >
                删除
              </div>
            </template>
          </el-table-column>
        </el-table>
      </tm-layout>
    </tm-layout>
  </div>
</template>


<script>
export default {
  components: {},
  props: [
    "source",
    "toolboxWorker",
    "actived",
    "extend",
    "ownerName",
    "tableName",
    "columnTypeInfoList",
    "indexTypeInfoList",
  ],
  data() {
    return {
      ready: false,
      formData: {
        isBatch: false,
        batchSize: 100,
        worker: 10, // 并发数
        duration: 0, // 执行时长 分钟
        frequency: 10, // 任务执行次数，和执行时间互斥，只能一个生效，优先级高于执行时间
        countSecond: 10, // 统计间隔秒 如 每秒统计 输入 1 默认 10 秒统计
        countTop: false, // 统计T99
        scriptVars: [{ name: "dataIndex1", value: "${dataIndex + 1}" }],
        maxIdleConn: 100,
        maxOpenConn: 100,
      },
      ownerList: [],
      selectOwner: null,
      selectOwnerName: null,
      selectTable: null,
      selectTableName: null,

      executeSQL:
        "INSERT INTO `TB_XXX`(`userId`, `name`, `createAt`) VALUES ( ${util.nextId()}, '${workerIndex + '-' + util.getUUID()}', ${util.getNowMilli()});",
      testList: null,
      callOnceResult: null,
    };
  },
  computed: {},
  watch: {
    selectOwnerName() {
      this.initSelectOwner();
    },
  },
  methods: {
    onFocus() {
      if (this.inited) {
        return;
      }
      this.$nextTick(async () => {
        this.init();
      });
    },
    packChange() {},
    async initSelectOwner() {
      let find = null;
      this.ownerList.forEach((one) => {
        if (this.selectOwnerName == one.ownerName) {
          find = one;
        }
      });
      this.selectOwner = find;
    },
    async init() {
      this.inited = true;
      await this.initOwners();

      this.selectOwnerName = this.ownerName;
      this.selectTableName = this.tableName;

      this.loadTestList();
      this.ready = true;
    },
    async initOwners() {
      let ownerList = await this.toolboxWorker.loadOwners();
      this.ownerList = ownerList;
    },
    addScriptVar(after) {
      let appendData = {};
      appendData.name = "";
      appendData.value = "";

      let appendIndex = this.formData.scriptVars.indexOf(after);
      if (appendIndex < 0) {
        appendIndex = this.formData.scriptVars.length;
      } else {
        appendIndex++;
      }
      this.formData.scriptVars.splice(appendIndex, 0, appendData);
    },
    removeScriptVar(data) {
      let findIndex = this.formData.scriptVars.indexOf(data);
      if (findIndex >= 0) {
        this.formData.scriptVars.splice(findIndex, 1);
      }
    },
    async start(options) {
      options || {};
      if (this.selectOwner == null) {
        this.tool.error("请选择测试的库");
        return;
      }
      let testSql = this.$refs.Editor.getValue();
      if (this.tool.isEmpty(testSql) || this.tool.isEmpty(testSql.trim())) {
        this.tool.error("请输入测试SQL");
        return;
      }
      testSql = testSql.trim();
      let param = this.toolboxWorker.getWorkParam(
        Object.assign({}, this.formData)
      );
      param = Object.assign(param, options);
      param.worker = Number(param.worker);
      param.duration = Number(param.duration);
      param.batchSize = Number(param.batchSize);
      param.frequency = Number(param.frequency);
      param.countSecond = Number(param.countSecond);
      param.maxIdleConn = Number(param.maxIdleConn);
      param.maxOpenConn = Number(param.maxOpenConn);
      this.toolboxWorker.formatParam(param);

      param.ownerName = this.selectOwner.ownerName;
      param.testSql = testSql;

      let res = await this.server.database.test.start(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.tool.success("执行成功");
      }
      if (param.isCallOnce) {
        this.callOnceResult = res.data || {};
        if (res.code != 0) {
          this.callOnceResult.error = res.msg;
        }
      } else {
        this.callOnceResult = null;
        this.loadTestList();
      }
    },
    async toStop(data) {
      if (data == null) {
        return;
      }
      let param = this.toolboxWorker.getWorkParam({
        taskKey: data.key,
      });
      let res = await this.server.database.test.stop(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.tool.success("停止成功");
      }
      this.loadTestList();
    },
    async toDelete(data) {
      if (data == null) {
        return;
      }
      let param = this.toolboxWorker.getWorkParam({
        taskKey: data.key,
      });
      let res = await this.server.database.test.delete(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.tool.success("删除成功");
      }
      this.loadTestList();
    },
    async loadTestList() {
      let param = this.toolboxWorker.getWorkParam({});
      this.task = null;
      this.taskKey = null;
      let res = await this.server.database.test.list(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let testList = res.data || [];
      testList.forEach((one) => {
        Object.assign(one, one.task);
        Object.assign(one, one.count);
        delete one.task;
      });
      this.testList = testList;
    },
    toShowChart(data) {
      this.tool.warn("秒级性能统计曲线暂未完成，敬请期待");
    },
  },
  created() {},
  mounted() {
    if (this.actived) {
      this.init();
    }
  },
  beforeDestroy() {
    this.isDestroyed = true;
  },
};
</script>

<style>
.toolbox-database-test {
  width: 100%;
  height: 100%;
}
</style>
