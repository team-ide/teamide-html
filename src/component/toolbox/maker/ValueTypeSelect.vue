<template>
  <el-select placeholder="选择类型" v-model="data" filterable clearable>
    <el-option
      v-for="(one, index) in worker.valueTypeList"
      :key="index"
      :value="one.name"
      :label="
        one.name +
        (tool.isEmpty(one.comment) ? '' : '  ( ' + one.comment + ' )')
      "
    >
    </el-option>
  </el-select>
</template>


<script>
export default {
  components: {},
  props: ["source", "worker", "data"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    async init() {},
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
</style>
