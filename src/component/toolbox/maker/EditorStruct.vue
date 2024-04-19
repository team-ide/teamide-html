<template>
  <div v-if="ready" style="height: 100%" class="pd-10">
    <div class="pdtb-5 ft-13">
      <span class="color-grey">字段列表</span>
      <div class="tm-link color-green mgl-10" @click="add({})">新增</div>
      <div class="color-orange ft-12">
        <div>映射JSON名称：可以不填写，默认使用字段名称，填写 `-` 忽略该字段</div>
        <div>映射JSON省略空值：选中后，如果值为空，则忽略该字段</div>
      </div>
    </div>
    <el-table
      :data="list"
      :border="true"
      style="width: 100%"
      height="calc(100% - 60px)"
      size="mini"
    >
      <el-table-column label="字段名称" fixed width="160">
        <template slot-scope="scope">
          <div class="">
            <el-input v-model="scope.row.name" type="text" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="160">
        <template slot-scope="scope">
          <div class="">
            <el-select
              placeholder="选择类型"
              v-model="scope.row.type"
              filterable
              clearable
            >
              <el-option
                v-for="(one, index) in worker.valueTypeList"
                :key="index"
                :value="one.name"
                :label="
                  one.name +
                  (tool.isEmpty(one.comment) ? '' : '(' + one.comment + ')')
                "
              >
              </el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="默认值">
        <template slot-scope="scope">
          <div class="">
            <el-input v-model="scope.row.default" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="是列表">
        <template slot-scope="scope">
          <div class="">
            <el-switch v-model="scope.row.isList" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="映射JSON名称">
        <template slot-scope="scope">
          <div class="">
            <el-input v-model="scope.row.jsonName" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="映射JSON省略空值">
        <template slot-scope="scope">
          <div class="">
            <el-switch v-model="scope.row.jsonOmitempty" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="说明">
        <template slot-scope="scope">
          <div class="">
            <el-input v-model="scope.row.comment" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <div class="tm-link color-grey mglr-5" @click="up(scope.row)">
            上移
          </div>
          <div class="tm-link color-grey mglr-5" @click="down(scope.row)">
            下移
          </div>
          <div class="tm-link color-grey mglr-5" @click="add({}, scope.row)">
            追加
          </div>
          <div class="tm-link color-red mglr-5" @click="del(scope.row)">
            删除
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "worker", "model"],
  data() {
    return {
      ready: false,
      list: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.list = [];
      let list = this.model.fields || [];
      list.forEach((one) => {
        this.add(one);
      });
      this.ready = true;
    },
    async fullModel(model) {
      model.fields = this.list;
    },
    up(one) {
      this.tool.up(this, "list", one);
    },
    down(one) {
      this.tool.down(this, "list", one);
    },
    add(one, after) {
      one = one || {};
      one.name = one.name || "";
      one.type = one.type || "string";
      one.default = one.default || "";
      one.comment = one.comment || "";
      one.jsonName = one.jsonName || "";
      one.jsonOmitempty = one.jsonOmitempty || false;
      one.isList = one.isList || false;

      let appendIndex = this.list.indexOf(after);
      if (appendIndex < 0) {
        appendIndex = this.list.length;
      } else {
        appendIndex++;
      }
      this.list.splice(appendIndex, 0, one);
    },
    del(one) {
      let findIndex = this.list.indexOf(one);
      if (findIndex >= 0) {
        this.list.splice(findIndex, 1);
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
