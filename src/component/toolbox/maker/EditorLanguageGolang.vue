<template>
  <div v-if="ready" style="height: 100%" class="pd-10">
    <el-form ref="form" size="mini" label-width="200px" @submit.native.prevent>
      <el-form-item label="module name">
        <el-input v-model="formData.moduleName" />
      </el-form-item>
      <el-form-item label="go version">
        <el-input v-model="formData.goVersion" />
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "worker", "model"],
  data() {
    return {
      ready: false,
      formData: {
        moduleName: "app",
        goVersion: "1.18",
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      for (let key in this.formData) {
        if (this.model[key] != null) {
          this.formData[key] = this.model[key];
        }
      }
      this.ready = true;
    },
    async fullModel(model) {
      for (let key in this.formData) {
        model[key] = this.formData[key];
      }
      model.port = Number(model.port);
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
