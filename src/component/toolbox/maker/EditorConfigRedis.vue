<template>
  <div v-if="ready" style="height: 100%" class="pd-10">
    <el-form ref="form" size="mini" label-width="100px" @submit.native.prevent>
      <el-form-item label="address">
        <el-input v-model="formData.address" />
      </el-form-item>
      <el-form-item label="username">
        <el-input v-model="formData.username" />
      </el-form-item>
      <el-form-item label="auth">
        <el-input v-model="formData.auth" />
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
        address: "127.0.0.1:6379",
        username: "",
        auth: "",
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
