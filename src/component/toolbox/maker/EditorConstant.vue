<template>
  <div v-if="ready" style="height: 100%" class="pdlr-10">
    <ul class="part-box" style="height: auto">
      <li>
        <span class="color-grey mgr-10">说明</span>
        <span class="mgr-20">
          <input
            v-model="model.comment"
            placeholder="说明"
            style="min-width: 200px"
          />
        </span>
      </li>
    </ul>
    <div class="pdtb-5 ft-13">
      <span class="color-grey">常量列表</span>
      <div class="tm-link color-green mgl-10" @click="add({})">新增</div>
    </div>
    <el-table
      :data="list"
      :border="true"
      style="width: 100%"
      height="calc(100% - 60px)"
      size="mini"
    >
      <el-table-column label="常量名称" fixed width="220">
        <template slot-scope="scope">
          <div class="">
            <el-input v-model="scope.row.name" type="text" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="160">
        <template slot-scope="scope">
          <div class="">
            <ValueTypeSelect
              :source="source"
              :worker="worker"
              :data="scope.row.type"
            >
            </ValueTypeSelect>
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
      let list = this.model.options || [];
      list.forEach((one) => {
        this.add(one);
      });
      this.ready = true;
    },
    async fullModel(model) {
      model.options = this.list;
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
      one.value = one.value || "";
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
