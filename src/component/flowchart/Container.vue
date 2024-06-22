<template>
  <div
    class="flowchart-container-box"
    @dragenter="dragenter()"
    @dragleave="dragleave()"
    @drop="ondrop"
    @dragover="dragover"
  >
    <div ref="container"></div>
  </div>
</template>


<script>
import { Graph } from "@antv/x6";
import "@antv/x6-vue-shape";

export default {
  components: {},
  props: ["source", "drag"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      // 创建 Graph 的实例
      this.graph = new Graph({
        container: this.$refs.container,
        width: "100%",
        height: "100%",
        grid: {
          visible: true,
          args: [],
        },
        scroller: {
          enabled: true,
          pannable: true,
          padding: {
            left: 0,
            top: 0,
          },
        },
      });
    },
    onShapeEnd() {
      let el = this.drag.el;
      delete this.drag.el;
      if (el) {
        el.remove();
      }
    },
    dragover(e) {
      // console.log("container dragover", this.drag);
      if (this.drag.isShape && this.drag.el) {
        e = e || window.event;
        e.preventDefault && e.preventDefault();
        this.initPosion();
      }
    },
    ondrop() {
      if (this.drag.isShape && this.drag.el) {
        let el = this.drag.el;
        delete this.drag.el;
        if (el) {
          el.remove();
        }
        el = this.tool.jQuery(
          `<div class="flowchart-new-shape">` + this.drag.shape.code + `</div>`
        );
        el.css({
          width: this.drag.shape.width,
          height: this.drag.shape.height,
        });
        el.css({
          left: this.shapeLeft,
          top: this.shapeTop,
        });
        this.tool.jQuery(this.$el).append(el);
      }
    },
    initPosion(e) {
      let el = this.drag.el;
      if (el) {
        e = e || window.event;
        this.shapeLeft =
          e.clientX - this.containerLeft - this.drag.shape.width / 2;
        this.shapeTop =
          e.clientY - this.containerTop - this.drag.shape.height / 2;
        el.css({
          left: this.shapeLeft,
          top: this.shapeTop,
        });
      }
    },
    dragenter(e) {
      console.log("dragenter", this.drag);
      if (this.drag.isShape) {
        let el = this.drag.el;
        if (!el) {
          el = this.tool.jQuery(
            `<div class="flowchart-new-shape">` +
              this.drag.shape.code +
              `</div>`
          );
          el.css({
            width: this.drag.shape.width,
            height: this.drag.shape.height,
          });
        }
        this.drag.el = el;
        this.containerLeft = this.tool.getElementLeft(this.$el);
        this.containerTop = this.tool.getElementTop(this.$el);
        this.initPosion();
        this.tool.jQuery(this.$el).append(this.drag.el);
        this.drag.onEnd = this.onShapeEnd;
      }
    },
    dragleave(e) {},
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.flowchart-container-box {
  width: 100%;
  height: 100%;
  position: relative;
}
.flowchart-new-shape {
  position: absolute;
  z-index: 1;
  left: 0px;
  top: 0px;
  width: 100px;
  height: 100px;
}
.flowchart-draging .flowchart-container-box * {
  user-select: none;
  pointer-events: none;
}
</style>
