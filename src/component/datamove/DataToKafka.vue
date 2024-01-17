<template>
  <div class="pdlr-10">
    <el-form size="mini" inline>
      <el-form-item label="数据量" v-if="from.type == 'data'">
        <el-input v-model="dataTotal" style="width: 100px" readonly="">
        </el-input>
      </el-form-item>
      <el-form-item label="选择导入到的Topic" class="mgb-0">
        <el-select
          v-model="selectTolic"
          style="width: 200px"
          filterable
          value-key="topicName"
        >
          <el-option
            v-for="(one, index) in topicList"
            :key="index"
            :value="one"
            :label="one.topicName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="index登录用户">
        <el-input
          v-model="to.username"
          style="width: 120px"
          placeholder="可不填写或默认配置用户"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="index登录密码">
        <el-input
          v-model="to.password"
          style="width: 120px"
          placeholder="可不填写或默认配置密码"
        >
        </el-input>
      </el-form-item>
      <el-form-item v-if="from.type == 'script'" label="导入数据数量">
        <el-input v-model="from.total" style="width: 100px"> </el-input>
      </el-form-item>
      <template v-if="from.type == 'txt'">
        <el-form-item label="列分割字符">
          <el-input v-model="from.colSeparator" style="width: 100px">
          </el-input>
        </el-form-item>
        <el-form-item
          :label="'列分割字符转换（替换值中`' + from.colSeparator + '`）'"
        >
          <el-input v-model="from.replaceCol" style="width: 100px"> </el-input>
        </el-form-item>
        <el-form-item label="换行符转换（替换值中`\n`）">
          <el-input v-model="from.replaceLine" style="width: 100px"> </el-input>
        </el-form-item>
      </template>
      <el-form-item
        v-if="
          selectTolic != null && (from.type == 'txt' || from.type == 'excel')
        "
        label="文件路径"
      >
        <el-input v-model="filePath" style="width: 300px" readonly="">
        </el-input>
        <el-upload
          v-if="uploadReady"
          class="toolbox-database-import-upload-file"
          :action="source.api + 'upload'"
          :limit="1"
          :data="{ place: 'other' }"
          :headers="{ JWT: tool.getJWT() }"
          name="file"
          :on-success="onFileUpload"
          :show-file-list="false"
        >
          <div class="tm-link color-teal-8">点击上传</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="key对应的字段名称">
        <el-input v-model="topicKey" style="width: 150px"> </el-input>
      </el-form-item>
    </el-form>
    <template v-if="from.type == 'data' || from.type == 'script'">
      <div class="mgb-10">
        <div
          class="tm-link color-green mgr-5 ft-12"
          @click="addColumn(mappingColumnList, { columnName: 'columnXXX' })"
        >
          添加字段
        </div>
      </div>
      <el-table
        :data="mappingColumnList"
        border
        style="width: 100%"
        size="mini"
      >
        <el-table-column label="字段" width="200px">
          <template slot-scope="scope">
            <div class="">
              <el-input v-model="scope.row.from.columnName" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="from.type == 'script'"
          label="导出固定值（函数脚本，默认为查询出的值）"
        >
          <template slot-scope="scope">
            <div class="">
              <el-input v-model="scope.row.from.value" />
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="from.type == 'data'" label="映射到字段">
          <template slot-scope="scope">
            <div class="">
              <el-select
                v-model="scope.row.from.columnName"
                filterable
                clearable
              >
                <el-option
                  v-for="(one, index) in columnList"
                  :key="index"
                  :value="one.from.columnName"
                  :label="one.from.columnName"
                >
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <div
              class="tm-link color-grey mglr-5 ft-12"
              @click="upColumn(scope.row)"
            >
              上移
            </div>
            <div
              class="tm-link color-grey mglr-5 ft-12"
              @click="downColumn(scope.row)"
            >
              下移
            </div>
            <div
              class="tm-link color-grey mglr-5 ft-12"
              @click="
                addColumn(
                  mappingColumnList,
                  { columnName: 'columnXXX' },
                  scope.row
                )
              "
            >
              插入
            </div>
            <div
              class="tm-link color-red mglr-5 ft-12"
              @click="removeColumn(scope.row)"
            >
              删除
            </div>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-if="from.type == 'txt' || from.type == 'excel'">
      <el-table
        :data="mappingColumnList"
        border
        style="width: 100%"
        size="mini"
      >
        <el-table-column label="字段">
          <template slot-scope="scope">
            <div class="">
              <el-input v-model="scope.row.from.columnName" readonly />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="映射到字段">
          <template slot-scope="scope">
            <div class="">
              <el-select v-model="scope.row.to.columnName" filterable clearable>
                <el-option
                  v-for="(one, index) in columnList"
                  :key="index"
                  :value="one.from.columnName"
                  :label="one.from.columnName"
                >
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "from", "to", "formData"],
  data() {
    return {
      topicList: [],
      mappingColumnList: [],
      columnList: [],
      selectTolic: null,
      filePath: null,
      uploadReady: true,
      dataTotal: 0,
      indexIdName: "",
      indexIdScript: "",
    };
  },
  computed: {},
  watch: {
    selectTolic() {
      this.$nextTick(() => {
        this.initColumnList();
      });
    },
  },
  methods: {
    async init() {
      this.topicList = [];
      this.columnList = [];
      this.mappingColumnList = [];
      this.selectTolic = null;
      this.dataTotal = 0;
      if (this.from.dataList) {
        this.dataTotal = this.from.dataList.length;
      }
      await this.initData();
    },
    onFileUpload(response) {
      this.uploadReady = false;
      this.$nextTick(() => {
        this.uploadReady = true;
      });
      if (response.code != 0) {
        this.tool.error(response.msg);
        return false;
      }
      this.filePath = response.data.files[0].path;
      if (this.from.type == "txt" || this.from.type == "excel") {
        this.loadFileColumnList();
      }
    },
    async initData() {
      if (this.from.columnList != null) {
        this.from.columnList.forEach((one) => {
          this.addColumn(this.mappingColumnList, one);
        });
      }
      await this.initIndexList();
    },
    checkData() {
      if (
        this.tool.isEmpty(this.indexIdName) &&
        this.tool.isEmpty(this.indexIdScript)
      ) {
        this.tool.warn("请设置_id字段名或_id值表达式");
        return false;
      }
      this.to.indexIdName = this.indexIdName;
      this.to.indexIdScript = this.indexIdScript;
      if (this.from.type == "txt" || this.from.type == "excel") {
        if (this.tool.isEmpty(this.filePath)) {
          this.tool.warn("请上传文件");
          return false;
        }
        this.from.filePath = this.filePath;
      }
      if (this.selectTolic == null) {
        this.tool.warn("请选择导入到的Index");
        return false;
      }
      this.to.topicName = this.selectTolic.topicName;
      this.to.columnList = [];
      this.from.columnList = [];
      if (this.mappingColumnList.length == 0) {
        this.tool.warn("请设置导入到的列");
        return false;
      }
      this.mappingColumnList.forEach((one) => {
        this.from.columnList.push(one.from);
        if (this.from.type == "script" || this.from.type == "data") {
          this.to.columnList.push(one.from);
        } else {
          this.to.columnList.push(one.to);
        }
      });
      this.from.total = Number(this.from.total);

      return true;
    },
    addTolic(topicList, topicName) {
      let one = {};
      one.topicName = topicName;
      topicList.push(one);
      return one;
    },
    addColumn(columns, one, after) {
      let column = {};
      column.from = Object.assign({}, one);
      column.to = Object.assign({}, one);
      column.from.value = "";
      let appendIndex = columns.indexOf(after);
      if (appendIndex < 0) {
        appendIndex = columns.length;
      } else {
        appendIndex++;
      }
      columns.splice(appendIndex, 0, column);
      return column;
    },
    async initColumnList() {
      this.columnList = [];
      if (this.selectTolic == null) {
        return;
      }
      let list = [];
      list.forEach((one) => {
        this.addColumn(this.columnList, one);
      });
      if (this.from.type == "script") {
        this.mappingColumnList = [];
        list.forEach((one) => {
          this.addColumn(this.mappingColumnList, one);
        });
      }
    },
    async initIndexList() {
      this.topicList = [];
      this.selectTolic = null;
      if (this.to.topicName != null) {
        this.selectTolic = this.addTolic(this.topicList, this.to.topicName);
        return;
      }
      let param = {
        toolboxId: this.to.toolboxId,
      };
      let res = await this.server.kakfa.topics(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || [];
      list.forEach((one) => {
        this.addTolic(this.topicList, one.topic);
      });
    },
    async loadFileColumnList() {
      this.mappingColumnList = [];
      let param = {
        from: {
          type: this.from.type,
          filePath: this.filePath,
          colSeparator: this.from.colSeparator,
        },
      };
      let res = await this.server.datamove.readFileColumnList(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || {};
      list.forEach((one) => {
        this.addColumn(this.mappingColumnList, one);
      });
    },
    upColumn(one) {
      this.tool.up(this, "mappingColumnList", one);
    },
    downColumn(one) {
      this.tool.down(this, "mappingColumnList", one);
    },
    removeColumn(one) {
      let findIndex = this.mappingColumnList.indexOf(one);
      if (findIndex >= 0) {
        this.mappingColumnList.splice(findIndex, 1);
      }
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
