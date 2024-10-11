<template>
  <div class="tools-qrcode-page">
    <el-form class="pdt-10 pdlr-10" inline size="" @submit.native.prevent>
      <div class="pd-10 ft-16">生成二维码</div>
      <el-form-item label="宽度" class="mgb-5">
        <el-input v-model="form.width"></el-input>
      </el-form-item>
      <el-form-item label="高度" class="mgb-5">
        <el-input v-model="form.height"></el-input>
      </el-form-item>
      <el-form-item label="暗色颜色" class="mgb-5">
        <el-input v-model="form.colorDark" style="width: 100px"></el-input>
        <el-color-picker
          v-model="form.colorDark"
          size="mini"
          style="vertical-align: -10px; margin-left: 10px"
        >
        </el-color-picker>
      </el-form-item>
      <el-form-item label="亮色颜色" class="mgb-5">
        <el-input v-model="form.colorLight" style="width: 100px"></el-input>
        <el-color-picker
          v-model="form.colorLight"
          size="mini"
          style="vertical-align: -10px; margin-left: 10px"
        >
        </el-color-picker>
      </el-form-item>
      <el-form-item label="级别" class="mgb-5">
        <el-select v-model="form.correctLevel" style="width: 178px">
          <el-option
            v-for="(one, index) in correctLevels"
            :key="index"
            :value="one.value"
            :label="one.text"
            :disabled="one.disabled"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form class="pdt-10 pdlr-10" size="mini" @submit.native.prevent>
      <el-form-item
        label="输入值（地址或任意字符）"
        class="mgb-5"
        width="100%"
        style="width: 100%"
      >
        <el-input type="textarea" v-model="form.value" rows="8"></el-input>
      </el-form-item>

      <el-form-item label="" class="mgt-15">
        <a class="tm-btn bg-green" @click="genQECode">生成</a>
      </el-form-item>
    </el-form>
    <div
      class="qrcode-box text-center"
      ref="qrcode"
      style="padding-top: 20px"
    ></div>
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
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: 2,
      },
      correctLevels: [
        { text: "M（0）", value: 0 },
        { text: "L（1）", value: 1 },
        { text: "H（2）", value: 2 },
        { text: "Q（3）", value: 3 },
      ],
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {},
    async genQECode() {
      this.tool.jQuery(this.$refs.qrcode).empty();
      var qrcode = new window.QRCode(this.$refs.qrcode, {
        text: this.form.value,
        width: Number(this.form.width),
        height: Number(this.form.height),
        colorDark: this.form.colorDark,
        colorLight: this.form.colorLight,
        correctLevel: this.form.correctLevel,
      });
      console.log(qrcode);
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
.tools-qrcode-page {
  width: 100%;
  height: 100%;
  user-select: text;
}
.qrcode-box img {
  margin: 0px auto;
  display: inline-block;
}
</style>
