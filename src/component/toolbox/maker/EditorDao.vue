<template>
  <div v-if="ready" style="height: 100%" class="pd-10">
    <div class="pdtb-5 ft-13">
      <span class="color-grey">参数列表</span>
      <div class="tm-link color-green mgl-10" @click="add({})">新增</div>
    </div>
    <el-table
      :data="list"
      :border="true"
      style="width: 100%"
      size="mini"
      height="160px"
    >
      <el-table-column label="参数名称" fixed width="220">
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
      <el-table-column label="说明">
        <template slot-scope="scope">
          <div class="">
            <el-input v-model="scope.row.comment" type="text" />
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
    <el-form class="mgt-10" ref="form" size="mini" @submit.native.prevent>
      <el-form-item label="返回值类型" class="mgb-5">
        <el-select
          placeholder="选择类型"
          v-model="returnType"
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
      </el-form-item>
    </el-form>
    <div style="height: calc(100% - 240px)">
      <Editor
        ref="funcEditor"
        :source="source"
        language="javascript"
        :value="func"
      >
      </Editor>
    </div>
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
      returnType: "",
      func: "",
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.returnType = this.model.returnType || "";
      this.func = this.model.func || "";
      this.list = [];
      let list = this.model.args || [];
      list.forEach((one) => {
        this.add(one);
      });
      this.ready = true;
    },
    async fullModel(model) {
      let func = this.$refs.funcEditor.getValue();
      model.args = this.list;
      model.func = func;
      model.returnType = this.returnType;
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
      one.comment = one.comment || "";

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
