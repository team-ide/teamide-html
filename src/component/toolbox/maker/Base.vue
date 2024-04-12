<template>
  <div class=""></div>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    init() {
      this.toolboxWorker.loadContext = this.loadContext;
    },
    async loadContext() {
      let param = this.toolboxWorker.getWorkParam({});
      let res = await this.server.maker.loadContext(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let context = res.data;
      return context;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {},
};
</script>

<style>
</style>
