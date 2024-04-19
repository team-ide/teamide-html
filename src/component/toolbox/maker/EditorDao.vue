<template>
  <div v-if="ready" style="height: 100%" class="pd-10">
    <EditorSteps
      ref="EditorSteps"
      :source="source"
      :worker="worker"
      :model="model"
    >
    </EditorSteps>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "worker", "model"],
  data() {
    return {
      ready: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.ready = true;
    },
    async fullModel(model) {
      if ((await this.$refs.EditorSteps.fullSteps(model)) === false) {
        return false;
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
