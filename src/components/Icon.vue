<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  props: ["size", "pointer"],
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
  <i
    class="mdi-icon mdi"
    :style="{ 'fonts-size': `${size}px`, cursor: pointer ? 'pointer' : 'auto' }"
  >
    <slot></slot>
  </i>
</template>

<style>
</style>
