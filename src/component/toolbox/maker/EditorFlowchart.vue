<template>
  <div style="height: 100%">
    <Flowchart ref="Flowchart" :source="source"></Flowchart>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "worker", "model"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      let data = {};
      if (this.tool.isNotEmpty(this.model.content)) {
        data = this.tool.stringToJSON(this.model.content);
      }
      await this.$refs.Flowchart.show({}, data);
    },
    async fullModel(model) {
      let data = await this.$refs.Flowchart.getData();
      model.content = JSON.stringify(data || {});
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
