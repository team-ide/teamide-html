<template>
  <div class="tools-md5-page">
    <el-form class="pdt-10 pdlr-10" size="mini" @submit.native.prevent>
      <el-form-item label="输入值" class="mgb-5 mglr-10">
        <el-input
          type="textarea"
          v-model="form.value"
          @change="valueChange()"
        ></el-input>
      </el-form-item>

      <el-form-item label="值MD5" class="mgb-5 mglr-10">
        <el-input type="textarea" v-model="form.valueMd5"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      form: {
        value: null,
        valueMd5: null,
        md5: null,
        md5Value: null,
        thread: 1,
        timeout: 10, // 10秒
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {},
    async valueChange() {
      let res = await this.server.tools.md5({
        value: this.form.value,
      });
      if (res.code == 0) {
        this.form.valueMd5 = res.data;
      } else {
        this.tool.error(res.msg);
      }
    },
    refresh() {
      this.$nextTick(() => {});
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.tools-md5-page {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
