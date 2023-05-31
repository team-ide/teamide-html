<template>
  <div class="tools-base64-page">
    <el-form class="pdt-10 pdlr-10" size="mini" @submit.native.prevent>
      <div class="pd-10 ft-16">编码</div>
      <el-form-item label="输入值" class="mgb-5 mglr-10">
        <el-input
          type="textarea"
          v-model="form.value"
          @change="valueChange()"
        ></el-input>
      </el-form-item>

      <el-form-item label="输出Base64" class="mgb-5 mglr-10">
        <el-input type="textarea" v-model="form.valueEncode"></el-input>
      </el-form-item>

      <div class="pd-10 ft-16">解码</div>
      <el-form-item label="输入Base64" class="mgb-5 mglr-10">
        <el-input
          type="textarea"
          v-model="form.decode"
          @change="decodeChange()"
        ></el-input>
      </el-form-item>

      <el-form-item label="输出值" class="mgb-5 mglr-10">
        <el-input type="textarea" v-model="form.decodeValue"></el-input>
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
        valueEncode: null,
        decode: null,
        decodeValue: null,
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
        res.data = res.data || {};
        this.form.valueEncode = res.data.valueEncode;
      } else {
        this.tool.error(res.msg);
      }
    },
    async decodeChange() {
      let res = await this.server.tools.base64({
        decode: this.form.decode,
      });
      if (res.code == 0) {
        res.data = res.data || {};
        this.form.decodeValue = res.data.decodeValue;
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
