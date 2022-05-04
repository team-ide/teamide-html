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
    class="icon teamide-iconfont"
    :style="{ 'fonts-size': `${size}px`, cursor: pointer ? 'pointer' : 'auto' }"
  >
    <slot></slot>
  </i>
</template>

<style>
.teamide-iconfont:before {
  display: inline-block;
  font-family: "iconfont" !important;
  font: normal normal normal 12px/1 "Material Design Icons";
  font-size: inherit;
  text-rendering: auto;
  line-height: inherit;
  -webkit-font-smoothing: antialiased;
}
</style>
