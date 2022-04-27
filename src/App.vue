<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

import { defineComponent, reactive, toRefs } from "vue";

import { Service } from "service";
import { newSource } from "type";

export default defineComponent({
  setup() {
    const source = reactive(newSource());

    return {
      source,
    };
  },
  methods: {
    async init() {
      await Service.initServer(this.source);
    },
  },
  mounted() {
    this.init();
  },
});
</script>

<template  >
  <div>{{ source }}</div>
</template>

<style>
html,
body {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
  position: relative;
}
#app {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
