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

      this.tool.jQuery(this.$el).append(
        this.createShapeCanvas({
          left: 100,
          top: 100,
          width: 100,
          height: 50,
          type: "rect",
          bWidth: 6,
          bColor: "#fff",
        })
      );

      this.tool.jQuery(this.$el).append(
        this.createShapeCanvas({
          left: 250,
          top: 100,
          width: 100,
          height: 50,
          type: "rect",
          bgColor: "red",
          bWidth: 6,
          bColor: "#fff",
        })
      );

      this.tool.jQuery(this.$el).append(
        this.createShapeCanvas({
          left: 100,
          top: 200,
          width: 100,
          height: 100,
          type: "circle",
          bWidth: 6,
          bColor: "#fff",
        })
      );

      this.tool.jQuery(this.$el).append(
        this.createShapeCanvas({
          left: 250,
          top: 200,
          width: 100,
          height: 100,
          type: "circle",
          bgColor: "red",
          bWidth: 6,
          bColor: "#fff",
        })
      );

      this.tool.jQuery(this.$el).append(
        this.createShapeCanvas({
          left: 100,
          top: 350,
          width: 100,
          height: 50,
          type: "rect-circle",
          bWidth: 6,
          bColor: "#fff",
        })
      );
      this.tool.jQuery(this.$el).append(
        this.createShapeCanvas({
          left: 250,
          top: 350,
          width: 100,
          height: 50,
          type: "rect-circle",
          bgColor: "red",
          bWidth: 6,
          bColor: "#fff",
        })
      );

      this.tool.jQuery(this.$el).append(
        this.createShapeCanvas({
          left: 100,
          top: 500,
          width: 100,
          height: 50,
          type: "parallelogram",
          bWidth: 6,
          bColor: "#fff",
        })
      );
      this.tool.jQuery(this.$el).append(
        this.createShapeCanvas({
          left: 250,
          top: 500,
          width: 100,
          height: 50,
          type: "parallelogram",
          bgColor: "red",
          bWidth: 6,
          bColor: "#fff",
        })
      );
    },
    createShapeCanvas(options) {
      let el = this.tool.jQuery(`<div class="flowchart-new-shape"></div>`);
      el.css({
        left: options.left,
        top: options.top,
        width: options.width,
        height: options.height,
      });

      el.append(this.createCanvas(options));
      return el;
    },
    createCanvas(options) {
      let w = options.width;
      let h = options.height;
      let canvas = this.tool.jQuery(
        `<canvas class="flowchart-canvas" width="${w}" height="${h}"></canvas>`
      );
      this.draw(canvas[0], options);
      return canvas[0];
    },
    draw(canvas, options) {
      let w = options.width;
      let h = options.height;
      let bW = Number(options.bWidth || 1);
      let bColor = options.bColor || "#ddd";
      let bgColor = options.bgColor;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, w, h);
      // 矩形
      if (options.type == "rect") {
        if (this.tool.isNotEmpty(bgColor)) {
          ctx.beginPath();
          ctx.fillStyle = bColor;
          ctx.roundRect(0, 0, w, h, 6);
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = bgColor;
          ctx.roundRect(bW, bW, w - bW * 2, h - bW * 2, 3);
          ctx.fill();
        } else {
          ctx.lineWidth = bW;
          ctx.beginPath();
          ctx.strokeStyle = bColor;
          ctx.roundRect(bW / 2, bW / 2, w - bW, h - bW, 3);
          ctx.stroke();
        }
      }
      // 圆形
      else if (options.type == "circle") {
        let x = w / 2;
        let y = h / 2;
        if (this.tool.isNotEmpty(bgColor)) {
          ctx.beginPath();
          ctx.fillStyle = bColor;
          // 圆心x、圆心y、圆的半径、圆弧的开始角度、圆弧的结束角度、是否逆时针
          ctx.arc(x, y, x, 0, (360 * Math.PI) / 180, false);
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = bgColor;
          // 圆心x、圆心y、圆的半径、圆弧的开始角度、圆弧的结束角度、是否逆时针
          ctx.arc(x, y, x - bW, 0, (360 * Math.PI) / 180, false);
          ctx.fill();
        } else {
          ctx.lineWidth = bW;
          ctx.beginPath();
          ctx.strokeStyle = bColor;
          // 圆心x、圆心y、圆的半径、圆弧的开始角度、圆弧的结束角度、是否逆时针
          ctx.arc(x, y, x - bW / 2, 0, (360 * Math.PI) / 180, false);
          ctx.stroke();
        }
      }
      // 矩形 左右两边圆
      else if (options.type == "rect-circle") {
        if (this.tool.isNotEmpty(bgColor)) {
          ctx.beginPath();
          ctx.fillStyle = bColor;
          ctx.roundRect(0, 0, w, h, h * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = bgColor;
          ctx.roundRect(bW, bW, w - bW * 2, h - bW * 2, h * 2);
          ctx.fill();
        } else {
          ctx.lineWidth = bW;
          ctx.beginPath();
          ctx.strokeStyle = bColor;
          ctx.roundRect(bW / 2, bW / 2, w - bW, h - bW, h * 2);
          ctx.stroke();
        }
      }
      // 圆形
      else if (options.type == "circle") {
        let x = w / 2;
        let y = h / 2;
        if (this.tool.isNotEmpty(bgColor)) {
          ctx.beginPath();
          ctx.fillStyle = bColor;
          // 圆心x、圆心y、圆的半径、圆弧的开始角度、圆弧的结束角度、是否逆时针
          ctx.arc(x, y, x, 0, (360 * Math.PI) / 180, false);
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = bgColor;
          // 圆心x、圆心y、圆的半径、圆弧的开始角度、圆弧的结束角度、是否逆时针
          ctx.arc(x, y, x - bW, 0, (360 * Math.PI) / 180, false);
          ctx.fill();
        } else {
          ctx.lineWidth = bW;
          ctx.beginPath();
          ctx.strokeStyle = bColor;
          // 圆心x、圆心y、圆的半径、圆弧的开始角度、圆弧的结束角度、是否逆时针
          ctx.arc(x, y, x - bW / 2, 0, (360 * Math.PI) / 180, false);
          ctx.stroke();
        }
      }
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
