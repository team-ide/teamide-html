<template>
  <div style="height: 100%">
    <div style="height: calc(100% - 60px)">
      <div style="height: 100%">
        <Editor
          ref="Editor"
          :source="source"
          :value="data"
          language="markdown"
        ></Editor>
      </div>
    </div>
    <div class="pd-10">
      <div class="tm-btn bg-teal-8 ft-13" @click="toView">预览</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["source", "data"],
  data() {
    return {};
  },
  computed: {},
  watch: {
    data() {
      this.initEditor();
    },
  },
  methods: {
    async initEditor() {
      this.$refs.Editor.setValue(this.data);
    },
    toView() {
      let text = this.$refs.Editor.getValue();
      this.tool.showMarkdownView(text);
    },
  },
  created() {},
  updated() {},
  mounted() {
    this.initEditor();
  },
};
</script>

<style>
</style>
