<template>
  <el-table
    :data="dataList"
    :border="true"
    style="width: 100%"
    height="100%"
    size="mini"
  >
    <el-table-column label="Key" width="200">
      <template slot-scope="scope">
        <el-input v-model="scope.row.key" />
      </template>
    </el-table-column>
    <el-table-column label="Value">
      <template slot-scope="scope">
        <el-input v-model="scope.row.value" type="textarea" :rows="1" />
      </template>
    </el-table-column>
  </el-table>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "data"],
  data() {
    return {
      ready: false,
      dataList: [],
    };
  },
  computed: {},
  watch: {
    data() {
      this.initDataList(this.data);
    },
  },
  methods: {
    async init() {
      this.initDataList(this.data);
      this.ready = true;
    },
    initDataList(data) {
      data = data || {};
      let dataList = [];
      for (let key in data) {
        let value = data[key] || "";
        if (value.push) {
          value = value.join(";");
        }
        let one = {
          key: key,
          value: value,
        };
        dataList.push(one);
      }

      this.dataList = dataList;
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
