<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";

import { ToolboxService } from "service";
export default defineComponent({
  props: ["source"],
  setup() {
    return {};
  },
  methods: {
    async init() {
      await ToolboxService.init(this.source);
    },
  },
  mounted() {
    this.init();
  },
});
</script>

<template  >
  <div class="toolbox-page">Toolbox Page</div>
</template>

<style>
.toolbox-page {
  display: none;
}
</style>
