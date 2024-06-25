<template>
  <div v-if="ready" class="shape-group-list">
    <template v-for="(shapeGroup, index) in shapeGroups">
      <div :key="`group-${index}`" class="shape-group">
        <div class="shape-group-text">
          {{ shapeGroup.text }}
        </div>
        <div class="shape-group-shape-list">
          <template v-for="(shape, shapeIndex) in shapeGroup.shapes">
            <div
              :key="`shape-${shapeIndex}`"
              class="shape-group-shape"
              @dragstart="dragstart(shape)"
              @dragend="dragend(shape)"
            >
              <div class="shape-group-img">
                <img :src="`${source.url}static/flowchart/${shape.img}`" />
              </div>
            </div>
          </template>
          <div class="shape-group-shape-empty"></div>
          <div class="shape-group-shape-empty"></div>
          <div class="shape-group-shape-empty"></div>
          <div class="shape-group-shape-empty"></div>
          <div class="shape-group-shape-empty"></div>
          <div class="shape-group-shape-empty"></div>
          <div class="shape-group-shape-empty"></div>
          <div class="shape-group-shape-empty"></div>
          <div class="shape-group-shape-empty"></div>
          <div class="shape-group-shape-empty"></div>
          <div class="shape-group-shape-empty"></div>
          <div class="shape-group-shape-empty"></div>
          <div class="shape-group-shape-empty"></div>
          <div class="shape-group-shape-empty"></div>
        </div>
      </div>
    </template>
  </div>
</template>


<script>

import flowchart from '@/component/flowchart'

export default {
  components: {},
  props: ["source", "drag"],
  data() {
    return {
      shapeGroups: flowchart.shapeGroups,
      ready: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.ready = true;
    },
    dragstart(shape) {
      this.drag.start = true;
      this.drag.isShape = true;
      this.drag.shape = shape;
      console.log(shape);
    },
    dragend() {
      console.log("dragend", this.drag);
      this.drag.onEnd && this.drag.onEnd();
      this.drag.start = false;
      this.drag.isShape = false;
      delete this.drag.shape;
      delete this.drag.onEnd;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.shape-group {
  padding: 0px;
}
.shape-group-text {
  padding: 5px 10px;
  font-size: 16px;
  font-weight: 600;
}
.shape-group-shape-list {
  font-size: 12px;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
}
.shape-group-shape-empty {
  width: 30px;
  height: 0px;
  margin: 5px;
}
.shape-group-shape {
  width: 30px;
  height: 30px;
  margin: 5px;
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex: none;
  cursor: move;
}

.shape-group-img {
  width: 100%;
  height: 100%;
  margin: 0px;
}

.shape-group-img img {
  width: 100%;
  height: 100%;
}
</style>
