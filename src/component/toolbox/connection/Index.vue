<template>
  <div class="toolbox-connection-editor">
    <Connection
      :source="source"
      :toolboxWorker="toolboxWorker"
      :extend="extend"
    >
    </Connection>
  </div>
</template>


<script>
import Connection from "./Connection.vue";

export default {
  components: { Connection },
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      ready: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {},
    onFocus() {
      this.$children.forEach((one) => {
        one.onFocus && one.onFocus();
      });
    },
    refresh() {
      this.$children.forEach((one) => {
        one.refresh && one.refresh();
      });
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-connection-editor {
  width: 100%;
  height: 100%;
}
</style>
