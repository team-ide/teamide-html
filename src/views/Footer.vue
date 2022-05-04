<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  props: ["source"],
  setup() {
    return {};
  },
  methods: {
    async init() {},
  },
  mounted() {
    this.init();
  },
});
</script>

<template  >
  <div class="app-footer"></div>
</template>

<style>
.app-footer {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
