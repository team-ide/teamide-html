<template>
  <div class="toolbox-serial-editor">
    <Serial
      :source="source"
      :toolboxWorker="toolboxWorker"
      :extend="extend"
    >
    </Serial>
  </div>
</template>


<script>
import Serial from "./Serial.vue";

export default {
  components: { Serial },
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
.toolbox-serial-editor {
  width: 100%;
  height: 100%;
}
</style>
