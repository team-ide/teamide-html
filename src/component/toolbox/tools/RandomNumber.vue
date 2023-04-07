<template>
  <div class="tools-timestamp-page"></div>
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
    async init() {},
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
