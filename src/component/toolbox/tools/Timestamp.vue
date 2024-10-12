<template>
  <div class="tools-timestamp-page">
    <el-form
      class="pdt-10 pdlr-10"
      size=""
      @submit.native.prevent
      label-width="100px"
    >
      <div class="pdb-5 color-grey-1">
        <div class="tm-link color-green" @click="initNowDate()">
          刷新当前时间
        </div>
      </div>
      <el-form-item label="当前时间" class="mgb-5">
        <el-input v-model="form.nowDateStr"></el-input>
      </el-form-item>
      <el-form-item label="格式化" class="mgb-5">
        <template v-for="(one, index) in form.nowDateFormats">
          <el-input
            :key="'nowDateFormats-' + index"
            :value="one"
            style="width: 200px"
            class="mgr-10"
          ></el-input>
        </template>
      </el-form-item>
      <el-form-item label="毫秒" class="mgb-5">
        <el-input v-model="form.nowDateMillisecond"></el-input>
      </el-form-item>
      <el-form-item label="秒" class="mgb-5">
        <el-input v-model="form.nowDateSecond"></el-input>
      </el-form-item>

      <div class="pdb-5 color-grey-1">
        <div class="tm-link color-grey ft-600">自定义时间</div>
      </div>
      <el-form-item label="输入时间" class="mgb-20">
        <el-input v-model="form.dateInput">
          <span slot="append">时间，时间戳，格式化时间等</span>
        </el-input>
      </el-form-item>

      <el-form-item label="时间输出" class="mgb-5">
        <el-input v-model="form.dateStr"></el-input>
      </el-form-item>
      <el-form-item label="格式化" class="mgb-5">
        <template v-for="(one, index) in form.dateFormats">
          <el-input
            :key="'dateFormats-' + index"
            :value="one"
            style="width: 200px"
            class="mgr-10"
          ></el-input>
        </template>
      </el-form-item>
      <el-form-item label="毫秒" class="mgb-5">
        <el-input v-model="form.dateMillisecond"></el-input>
      </el-form-item>
      <el-form-item label="秒" class="mgb-5">
        <el-input v-model="form.dateSecond"></el-input>
      </el-form-item>

      <template v-if="error != null">
        <div class="color-error pd-10">
          异常： <span>{{ error }}</span>
        </div>
      </template>
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
        nowDate: null,
        nowDateStr: null,
        nowDateFormats: [],
        nowDateMillisecond: null,
        nowDateSecond: null,
        dateInput: null,
        date: null,
        dateStr: null,
        dateFormats: [],
        dateMillisecond: null,
        dateSecond: null,
      },
      error: null,
      formats: [
        "yyyy-MM-dd hh:mm:ss.S",
        "yyyy/MM/dd hh:mm:ss.S",
        "yyyy-MM-dd",
        "yyyy/MM/dd",
      ],
    };
  },
  computed: {},
  watch: {
    "form.dateInput"() {
      let date = this.getDateByInput(this.form.dateInput);
      this.initDate(date);
    },
  },
  methods: {
    async init() {
      this.initNowDate();
    },
    initNowDate() {
      this.form.nowDate = new Date();
      this.form.nowDateStr = this.form.nowDate.toString();
      this.form.nowDateFormats = this.getFormats(this.form.nowDate);
      this.form.nowDateMillisecond = this.form.nowDate.getTime();
      this.form.nowDateSecond = this.form.nowDateMillisecond / 1000;
      this.form.nowDateSecond = this.form.nowDateSecond.toFixed(0);
    },
    initDate(date) {
      if (date == null) {
        this.form.date = null;
        this.form.dateStr = null;
        this.form.dateFormats = [];
        this.form.dateMillisecond = null;
        this.form.dateSecond = null;
        this.form.dateSecond = null;
      } else {
        this.form.date = date;
        this.form.dateStr = date.toString();
        this.form.dateFormats = this.getFormats(date);
        this.form.dateMillisecond = date.getTime();
        this.form.dateSecond = this.form.dateMillisecond / 1000;
        this.form.dateSecond = this.form.dateSecond.toFixed(0);
      }
    },
    getDateByInput(dateInput) {
      this.error = null;
      if (this.tool.isEmpty(dateInput)) {
        return null;
      }
      try {
        let date = this.tool.toDate(dateInput);
        if (date.toString() == "Invalid Date") {
          if (("" + dateInput).length == 13) {
            date = new Date(Number(dateInput));
          } else if (("" + dateInput).length == 10) {
            date = new Date(Number(dateInput) * 1000);
          } else {
            date = new Date(dateInput);
          }
        }
        if (date == null || date.toString() == "Invalid Date") {
          this.error = "无法转换[" + dateInput + "]";
        } else {
          return date;
        }
      } catch (e) {
        this.error = e.toString();
      }

      return null;
    },
    refresh() {
      this.$nextTick(() => {});
    },
    getFormats(date) {
      let formats = [];
      this.formats.forEach((one) => {
        let format = this.tool.formatDate(date, one);
        formats.push(format);
      });
      return formats;
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
