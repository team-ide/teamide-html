<template>
  <div class="tools-base64-page">
    <el-form class="pdt-10 pdlr-10" size="mini" @submit.native.prevent>
      <el-form-item label="输入值" class="mgb-5 mglr-10">
        <el-input
          type="textarea"
          v-model="form.value"
          @change="valueChange()"
        ></el-input>
      </el-form-item>

      <el-form-item label="值Base64" class="mgb-5 mglr-10">
        <el-input type="textarea" v-model="form.valueBase64"></el-input>
      </el-form-item>

      <el-form-item label="输入Base64" class="mgb-5 mglr-10">
        <el-input
          type="textarea"
          v-model="form.base64"
          @change="base64Change()"
        ></el-input>
      </el-form-item>

      <el-form-item label="Base64值" class="mgb-5 mglr-10">
        <el-input type="textarea" v-model="form.base64Value"></el-input>
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
        valueBase64: null,
        base64: null,
        base64Value: null,
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {},
    async valueChange() {
      let res = await this.server.tools.base64({
        value: this.form.value,
      });
      if (res.code == 0) {
        this.form.valueBase64 = res.data;
      } else {
        this.tool.error(res.msg);
      }
    },
    async base64Change() {
      let res = await this.server.tools.base64({
        base64: this.form.base64,
      });
      if (res.code == 0) {
        this.form.base64Value = res.data;
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
.tools-base64-page {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
