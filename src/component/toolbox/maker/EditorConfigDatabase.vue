<template>
  <div v-if="ready" style="height: 100%" class="pd-10">
    <el-form ref="form" size="mini" label-width="100px" @submit.native.prevent>
      <el-form-item label="host">
        <el-input v-model="formData.host" />
      </el-form-item>
      <el-form-item label="port">
        <el-input v-model="formData.port" />
      </el-form-item>
      <el-form-item label="database">
        <el-input v-model="formData.database" />
      </el-form-item>
      <el-form-item label="username">
        <el-input v-model="formData.username" />
      </el-form-item>
      <el-form-item label="password">
        <el-input v-model="formData.password" />
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
        type: "mysql",
        host: "127.0.0.1",
        port: 3306,
        database: "test_db",
        username: "root",
        password: "123456",
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
