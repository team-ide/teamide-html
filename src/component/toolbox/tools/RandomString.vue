<template>
  <div class="tools-timestamp-page">
    <el-form
      class="pdt-10 pdlr-10"
      size="mini"
      @submit.native.prevent
      label-width="140px"
    >
      <el-form-item label="自定义" class="mgb-5 mglr-10">
        <el-switch v-model="form.custom"></el-switch>
      </el-form-item>
      <el-form-item label="使用 0-9" class="mgb-5 mglr-10" v-if="!form.custom">
        <el-checkbox v-model="form.use_0_9">
          <span>{{ n_0_9 }}</span>
        </el-checkbox>
      </el-form-item>
      <el-form-item label="使用 a-z" class="mgb-5 mglr-10" v-if="!form.custom">
        <el-checkbox v-model="form.use_a_z">
          <span>{{ a_z }}</span>
        </el-checkbox>
      </el-form-item>
      <el-form-item label="使用 A-Z" class="mgb-5 mglr-10" v-if="!form.custom">
        <el-checkbox v-model="form.use_A_Z">
          <span>{{ A_Z }}</span>
        </el-checkbox>
      </el-form-item>
      <el-form-item
        label="使用 特殊符号"
        class="mgb-5 mglr-10"
        v-if="!form.custom"
      >
        <el-checkbox v-model="form.use_symbol">
          <span>{{ symbol }}</span>
        </el-checkbox>
      </el-form-item>
      <el-form-item label="使用字符" class="mgb-5 mglr-10" v-if="!form.custom">
        <el-input type="textarea" v-model="form.use_character"></el-input>
      </el-form-item>
      <el-form-item label="自定义字符" class="mgb-5 mglr-10" v-if="form.custom">
        <el-input type="textarea" v-model="form.customCharacter"></el-input>
      </el-form-item>
    </el-form>
    <el-form
      class="pdlr-10"
      size="mini"
      @submit.native.prevent
      label-width="140px"
      inline
    >
      <el-form-item label="生成长度" class="mgb-5 mglr-10">
        <el-input type="input" v-model="form.length"></el-input>
      </el-form-item>
      <el-form-item label="生成数量" class="mgb-5 mglr-10">
        <el-input type="input" v-model="form.size"></el-input>
      </el-form-item>
      <el-form-item label="允许字符重复次数" class="mgb-5 mglr-10">
        <el-input type="input" v-model="form.repeat"> </el-input>
      </el-form-item>
      <el-form-item
        label="重复最多验证次数"
        class="mgb-5 mglr-10"
        v-if="form.repeat > 0"
      >
        <el-input type="input" v-model="form.repeatGenNumber"> </el-input>
      </el-form-item>
    </el-form>
    <el-form class="pdlr-10" size="mini" @submit.native.prevent>
      <el-form-item label="" class="mgb-5 mglr-10">
        <div class="tm-btn tm-btn-smx bg-green-6" @click="toGen()">生成</div>
      </el-form-item>
      <el-form-item label="" class="mgb-5 mglr-10">
        <el-input type="textarea" v-model="result" rows="20"></el-input>
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
      n_0_9: "0123456789",
      a_z: "abcdefghijklmnopqrstuvwxyz",
      A_Z: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      symbol: "~!@#$%^&*()_+.[]{};',./?",
      form: {
        custom: false,
        customCharacter: "",
        use_a_z: true,
        use_A_Z: true,
        use_0_9: true,
        use_symbol: true,
        use_character: "",
        exclude: "",
        length: 32,
        size: 1,
        repeat: 0,
        repeatGenNumber: 100,
      },
      result: "",
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.form.customCharacter =
        this.n_0_9 + this.a_z + this.A_Z + this.symbol;
    },
    toGen() {
      let str = this.form.customCharacter;
      if (!this.form.custom) {
        str = "";
        if (this.form.use_0_9) {
          str += this.n_0_9;
        }
        if (this.form.use_a_z) {
          str += this.a_z;
        }
        if (this.form.use_A_Z) {
          str += this.A_Z;
        }
        if (this.form.use_symbol) {
          str += this.symbol;
        }
        if (this.tool.isNotEmpty(this.form.use_character)) {
          str += this.form.use_character;
        }
      }
      if (this.tool.isEmpty(str)) {
        this.tool.warn("未配置生成字符");
        return;
      }
      let result = "";
      for (let i = 0; i < this.form.size; i++) {
        if (i > 0) {
          result += "\n\n";
        }
        result += this.genStr(str, this.form.length);
      }

      this.result = result;
    },
    genStr(str, length) {
      let cs = str.split("");
      let csLen = cs.length;
      let max = csLen * 2;
      let res = "";
      let old = {};
      for (let i = 0; i < length; i++) {
        let c = cs[Math.floor(Math.random() * max) % csLen];
        if (this.form.repeat > 0) {
          let gS = 0;
          let condition = true;
          while (condition) {
            if (old[c] == null) {
              old[c] = 1;
              break;
            }
            if (old[c] < this.form.repeat) {
              old[c]++;
              break;
            }
            if (gS >= this.form.repeatGenNumber) {
              old[c]++;
              break;
            }
            c = cs[Math.floor(Math.random() * max) % csLen];
            gS++;
          }
        }
        res += c;
      }
      return res;
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
.tools-timestamp-page {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
