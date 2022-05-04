<script lang="ts">
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
  <div class="error-page">
    <div class="error-message">对不起，您暂无该功能的权限，请联系管理员！</div>
  </div>
</template>

<style>
.error-message {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: orange;
  padding: 30px 0px;
}
</style>
