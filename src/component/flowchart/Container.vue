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

import flowchart from "@/component/flowchart";

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

      let list = [
        { type: "circle" },
        { type: "circle", bgColor: "grey" },
        { type: "circle", height: 50 },
        { type: "circle", height: 50, bgColor: "grey" },
        { type: "rect", height: 50 },
        { type: "rect", height: 50, bgColor: "grey" },
        { type: "rect", height: 50, round: 4 },
        { type: "rect", height: 50, bgColor: "grey", round: 4 },
        { type: "rect", height: 50, leftCircle: true },
        { type: "rect", height: 50, bgColor: "grey", leftCircle: true },
        { type: "rect", width: 50, leftCircle: true },
        { type: "rect", width: 50, bgColor: "grey", leftCircle: true },
        { type: "rect", height: 50, rightCircle: true },
        { type: "rect", height: 50, bgColor: "grey", rightCircle: true },
        { type: "rect", width: 50, rightCircle: true },
        { type: "rect", width: 50, bgColor: "grey", rightCircle: true },
        { type: "rect", height: 50, topCircle: true },
        { type: "rect", height: 50, bgColor: "grey", topCircle: true },
        { type: "rect", width: 50, topCircle: true },
        { type: "rect", width: 50, bgColor: "grey", topCircle: true },
        { type: "rect", height: 50, bottomCircle: true },
        { type: "rect", height: 50, bgColor: "grey", bottomCircle: true },
        { type: "rect", width: 50, bottomCircle: true },
        { type: "rect", width: 50, bgColor: "grey", bottomCircle: true },
      ];

      let rowIndex = 1;
      let colIndex = 1;

      list.forEach((one) => {
        if (rowIndex % 5 == 0) {
          rowIndex = 1;
          colIndex++;
        }
        one.width = one.width || 100;
        one.height = one.height || 100;
        one.bColor = one.bColor || "#fff";
        one.bWidth = one.bWidth || 4;

        one.left = (rowIndex - 1) * 150;
        one.top = (colIndex - 1) * 150;
        one.top += (100 - one.height) / 2;
        this.tool.jQuery(this.$el).append(this.createShapeCanvas(one));

        rowIndex++;
      });
    },
    createShapeCanvas(opts) {
      let draw = flowchart.draw[opts.type];
      if (draw == null) {
        console.error("draw type [" + opts.type + "] not support");
        draw = flowchart.draw.empty;
      }
      let drawObj = draw(opts);
      let el = drawObj.create();

      return el;
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
    createShapeEl(shape, options) {
      let el = this.tool.jQuery(
        `<div class="flowchart-new-shape"><canvas class="flowchart-canvas" width="100%" height="100%"></canvas></div>`
      );
      this.tool.jQuery(this.$el).append(el);
      el.css({
        width: shape.width,
        height: shape.height,
      });
      let canvas = el.find(".flowchart-canvas");
      if (shape.draw) {
        shape.draw(canvas[0], options);
      }
      return el;
    },
    ondrop() {
      if (this.drag.isShape && this.drag.el) {
        let el = this.drag.el;
        delete this.drag.el;
        if (el) {
          el.remove();
        }
        el = this.createShapeEl(this.drag.shape, this.drag.shape);
        el.css({
          left: this.shapeLeft,
          top: this.shapeTop,
        });
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
          el = this.createShapeEl(this.drag.shape, this.drag.shape);
          this.tool.jQuery(this.$el).append(this.drag.el);
        }
        this.drag.el = el;
        this.containerLeft = this.tool.getElementLeft(this.$el);
        this.containerTop = this.tool.getElementTop(this.$el);
        this.initPosion();
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
.flowchart-draging .flowchart-container-box * {
  user-select: none;
  pointer-events: none;
}

.shape-draw-box {
  position: absolute;
  z-index: 1;
}

.shape-draw-box canvas {
  position: absolute;
  left: 0px;
  top: 0px;
}
</style>
