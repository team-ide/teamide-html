<template>
  <div class="pdlr-10">
    <el-form size="mini" inline>
      <el-form-item label="数据量" v-if="from.type == 'data'">
        <el-input v-model="dataTotal" style="width: 100px" readonly="">
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
      <el-form-item label="导入Database">
        <el-input v-model="redisDatabase" style="width: 100px"> </el-input>
      </el-form-item>
      <el-form-item label="选择导入的 值 类型" class="mgb-0">
        <el-select v-model="redisValueType" style="width: 200px" filterable>
          <el-option
            v-for="(one, index) in redisValueTypes"
            :key="index"
            :value="one.value"
            :label="one.text"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Key 字段名称">
        <el-input v-model="redisKeyName" style="width: 150px"> </el-input>
      </el-form-item>
      <el-form-item label="Key 对应的表达式">
        <el-input v-model="redisKeyScript" style="width: 150px"> </el-input>
      </el-form-item>
      <el-form-item label="Field 字段名称" v-if="redisValueType == 'hash'">
        <el-input v-model="redisFieldName" style="width: 150px"> </el-input>
      </el-form-item>
      <el-form-item label="Field 对应的表达式">
        <el-input v-model="redisFieldScript" style="width: 150px"> </el-input>
      </el-form-item>
      <el-form-item label="Value 字段名称">
        <el-input v-model="redisValueName" style="width: 150px"> </el-input>
      </el-form-item>
      <el-form-item label="value使用数据转json">
        <el-switch v-model="redisValueByData"> </el-switch>
      </el-form-item>
      <el-form-item
        v-if="from.type == 'txt' || from.type == 'excel'"
        label="文件路径"
      >
        <el-input v-model="filePath" style="width: 200px" readonly="">
        </el-input>
        <el-upload
          v-if="uploadReady"
          :action="source.api + 'upload'"
          :limit="1"
          :data="{ place: 'other' }"
          :headers="{ JWT: tool.getJWT() }"
          name="file"
          :on-success="onFileUpload"
          :show-file-list="false"
          style="display: inline-block; margin-left: 10px"
        >
          <div class="tm-link color-teal-8">点击上传</div>
        </el-upload>
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
      redisValueTypes: [
        { text: "String", value: "string" },
        { text: "Hash", value: "hash" },
        { text: "List", value: "list" },
        { text: "Set", value: "set" },
      ],
      redisValueType: "string",
      redisDatabase: 0,
      redisKeyName: "key",
      redisKeyScript: "",
      redisFieldName: "field",
      redisFieldScript: "",
      redisValueName: "value",
      redisValueByData: true,
      mappingColumnList: [],
      columnList: [],
      filePath: null,
      uploadReady: true,
      dataTotal: 0,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.columnList = [];
      this.mappingColumnList = [];
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
      this.initColumnList();
    },
    checkData() {
      if (
        this.tool.isEmpty(this.redisKeyName) &&
        this.tool.isEmpty(this.redisKeyScript)
      ) {
        this.tool.warn("请设置 Key 字段名 或 表达式");
        return false;
      }
      if (this.redisValueType == "hash") {
        if (
          this.tool.isEmpty(this.redisFieldName) &&
          this.tool.isEmpty(this.redisFieldScript)
        ) {
          this.tool.warn("请设置 Field 字段名 或 表达式");
          return false;
        }
      }
      if (!this.redisValueByData && this.tool.isEmpty(this.redisValueName)) {
        this.tool.warn("请设置 Value 字段名");
        return false;
      }

      if (this.from.type == "txt" || this.from.type == "excel") {
        if (this.tool.isEmpty(this.filePath)) {
          this.tool.warn("请上传文件");
          return false;
        }
        this.from.filePath = this.filePath;
      }
      if (this.mappingColumnList.length == 0) {
        this.tool.warn("请设置导入到的列");
        return false;
      }

      this.to.redisValueType = this.redisValueType;
      this.to.redisDatabase = Number(this.redisDatabase);
      this.to.redisKeyName = this.redisKeyName;
      this.to.redisKeyScript = this.redisKeyScript;
      this.to.redisFieldName = this.redisFieldName;
      this.to.redisFieldScript = this.redisFieldScript;
      this.to.redisValueName = this.redisValueName;
      this.to.redisValueByData = this.redisValueByData;

      this.to.columnList = [];
      this.from.columnList = [];
      this.mappingColumnList.forEach((one) => {
        this.from.columnList.push(one.from);
        if (this.from.type == "script") {
          this.to.columnList.push(one.from);
        } else {
          this.to.columnList.push(one.to);
        }
      });
      this.from.total = Number(this.from.total);

      return true;
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
      let list = [];
      list.push({ columnName: "key" });
      list.push({ columnName: "value" });
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
