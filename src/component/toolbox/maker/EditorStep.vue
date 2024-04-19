<template>
  <div v-if="ready" class="editor-step">
    <template v-if="tool.isNotEmpty(step.db)">
      <div>db 操作</div>
    </template>
    <template v-else-if="tool.isNotEmpty(step.redis)">
      <div>redis 操作</div>
    </template>
    <template v-else-if="tool.isNotEmpty(step.es)">
      <div>es 操作</div>
    </template>
    <template v-else-if="tool.isNotEmpty(step.kafka)">
      <div>kafka 操作</div>
    </template>
    <template v-else-if="tool.isNotEmpty(step.func)">
      <div>func 操作</div>
    </template>
    <template v-else-if="tool.isNotEmpty(step.lock)">
      <div>lock 操作</div>
    </template>
    <template v-else-if="tool.isNotEmpty(step.file)">
      <div>file 操作</div>
    </template>
    <template v-else-if="tool.isNotEmpty(step.command)">
      <div>command 操作</div>
    </template>
    <template v-else-if="tool.isNotEmpty(step.http)">
      <div>http 操作</div>
    </template>
    <template v-else-if="tool.isNotEmpty(step.dao)">
      <div>dao 操作</div>
    </template>
    <template v-else-if="tool.isNotEmpty(step.service)">
      <div>service 操作</div>
    </template>
    <template v-else-if="tool.isNotEmpty(step.error)">
      <div>error 操作</div>
    </template>

    <EditorSteps
      class="mglr-10"
      ref="EditorSteps"
      :source="source"
      :worker="worker"
      :model="step"
    >
    </EditorSteps>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "worker", "model", "step"],
  data() {
    return {
      ready: false,
      list: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.ready = true;
    },
    async fullStep(step) {
      if ((await this.$refs.EditorSteps.fullSteps(step)) === false) {
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
