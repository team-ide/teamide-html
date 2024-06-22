<template>
  <div class="flowchart-box" :class="{ 'flowchart-draging': drag.start }">
    <div class="flowchart-header">
      {{ drag }}
    </div>
    <div class="flowchart-body">
      <tm-layout height="100%">
        <tm-layout :width="`${leftWidth}px`" class="app-scroll-bar">
          <Shapes :source="source" :drag="drag"></Shapes>
        </tm-layout>
        <tm-layout-bar right></tm-layout-bar>
        <tm-layout width="auto">
          <Container :source="source" :drag="drag"></Container>
        </tm-layout>
        <tm-layout-bar right></tm-layout-bar>
        <tm-layout :width="`${rigthWidth}px`" class="app-scroll-bar">
          right
        </tm-layout>
      </tm-layout>
    </div>
    <div class="flowchart-footer">footer</div>
  </div>
</template>


<script>
import Shapes from "./Shapes";
import Container from "./Container";

export default {
  components: { Shapes, Container },
  props: ["source"],
  data() {
    return {
      leftWidth: 200,
      rigthWidth: 200,
      drag: {
        start: false,
        isShape: false,
      },
      options: {},
      ready: false,
      data: {},
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {},
    async show(options, data) {
      options = options || {};
      data = data || {};
      Object.assign(this.options, options);
      this.data = data;
    },
    async getData() {
      let data = {};
      return data;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.flowchart-box {
  width: 100%;
  height: 100%;
}
.flowchart-box.flowchart-draging,
.flowchart-box.flowchart-draging * {
  user-select: none;
  /* pointer-events: none; */
}
.flowchart-header {
  width: 100%;
  height: 50px;
}
.flowchart-body {
  width: 100%;
  height: calc(100% - 100px);
}
.flowchart-footer {
  width: 100%;
  height: 50px;
}
</style>
