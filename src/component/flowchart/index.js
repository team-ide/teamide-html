import tool from "@/tool"

var shapeGroups = []

var baseGroup = { text: "基础", shapes: [] }
shapeGroups.push(baseGroup)

let clearCanvas = (canvas) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
baseGroup.shapes.push({
    text: "开始/结束", img: "start.png", width: 100, height: 50,
    draw(canvas, options) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        let x = canvas.width / 2
        let y = canvas.height / 2
        // 圆心x、圆心y、圆的半径、圆弧的开始角度、圆弧的结束角度、是否逆时针
        ctx.arc(x, y, x, 0, 360 * Math.PI / 180, false);
        ctx.strokeStyle = "#ddd";
        ctx.stroke();
    },
})

baseGroup.shapes.push({
    text: "矩形", img: "rect.png", width: 100, height: 50,
    draw(canvas, options) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#ddd";
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    },
})
baseGroup.shapes.push({
    text: "圆形", img: "circle.png", width: 100, height: 100,
    draw(canvas, options) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        let x = canvas.width / 2
        let y = canvas.height / 2
        // 圆心x、圆心y、圆的半径、圆弧的开始角度、圆弧的结束角度、是否逆时针
        ctx.arc(x, y, x, 0, 360 * Math.PI / 180, false);
        ctx.strokeStyle = "#ddd";
        ctx.stroke();
    },
})

let getParallelogramPolygon = (width, height) => {

    return `<polygon points="${0.20 * width},0 ${width},0 ${0.80 * width},${height} 0,${height}"/>`
}

baseGroup.shapes.push({
    text: "平行四边形", img: "parallelogram.png", width: 100, height: 50,
    draw(canvas, options) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "green";
        ctx.strokeRect(0, 0, options.width, options.height);
    },
})

let getDiamondPolygon = (width, height) => {

    return `<polygon points="${0.50 * width},0 ${width},${0.50 * height} ${0.50 * width},${height} 0,${0.50 * height}"/>`
}

baseGroup.shapes.push({
    text: "菱形", img: "diamond.png", width: 100, height: 70,
    draw(canvas, options) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "green";
        ctx.strokeRect(0, 0, options.width, options.height);
    },
})

class BaseDraw {
    constructor(opts) {
        this.opts = opts;
        this.initProp()
    }
    initProp() {
        this.w = this.opts.width
        this.h = this.opts.height
        this.l = this.opts.left
        this.t = this.opts.top
        this.bW = Number(this.opts.bWidth || 1);
        this.bColor = this.opts.bColor || "#ddd";
        this.bgColor = this.opts.bgColor;
        this.hasBg = tool.isNotEmpty(this.bgColor);
    }
    createBox() {
        if (this.box != null) {
            return
        }
        this.box = tool.jQuery(`<div class="shape-draw-box" ></div>`)
        this.cvs = tool.jQuery(`<canvas></canvas>`)
        this.ctx = this.cvs[0].getContext("2d");
        this.box.append(this.cvs)
    }
    refreshSize() {
        this.initProp()
        this.box.css({
            width: this.w,
            height: this.h,
            left: this.l,
            top: this.t,
        });
        this.cvs.attr('width', this.w)
        this.cvs.attr('height', this.h)
        let ctx = this.ctx
        ctx.clearRect(0, 0, this.w, this.h);
    }
}
class EmptyDraw extends BaseDraw {
    constructor(options) {
        super(options)
    }
    create() {
        this.createBox()
        return this.box
    }
}
// 圆形
class CircleDraw extends BaseDraw {
    constructor(options) {
        super(options)
    }
    refreshSize() {
        super.refreshSize()
        let x = this.w / 2
        let y = this.h / 2
        let ctx = this.ctx
        if (this.hasBg) {
            ctx.beginPath();
            ctx.fillStyle = this.bColor;
            // 圆心x、圆心y、圆的半径、圆弧的开始角度、圆弧的结束角度、是否逆时针
            ctx.arc(x, y, x, 0, (360 * Math.PI) / 180, false);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = this.bgColor;
            // 圆心x、圆心y、圆的半径、圆弧的开始角度、圆弧的结束角度、是否逆时针
            ctx.arc(x, y, x - this.bW, 0, (360 * Math.PI) / 180, false);
            ctx.fill();
        } else {
            ctx.lineWidth = this.bW;
            ctx.beginPath();
            ctx.strokeStyle = this.bColor;
            // 圆心x、圆心y、圆的半径、圆弧的开始角度、圆弧的结束角度、是否逆时针
            ctx.arc(x, y, x - this.bW / 2, 0, (360 * Math.PI) / 180, false);
            ctx.stroke();
        }
    }
    create() {
        this.createBox()
        this.refreshSize()
        return this.box
    }
}

// 矩形
class RectDraw extends BaseDraw {
    constructor(options) {
        super(options)
    }
    refreshSize() {
        super.refreshSize()
        let ctx = this.ctx
        if (this.hasBg) {
            ctx.beginPath();
            ctx.fillStyle = this.bColor;
            ctx.roundRect(0, 0, this.w, this.h, 6);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = this.bgColor;
            ctx.roundRect(this.bW, this.bW, this.w - this.bW * 2, this.h - this.bW * 2, 3);
            ctx.fill();
        } else {
            ctx.lineWidth = this.bW;
            ctx.beginPath();
            ctx.strokeStyle = this.bColor;
            ctx.roundRect(this.bW / 2, this.bW / 2, this.w - this.bW, this.h - this.bW, 3);
            ctx.stroke();
        }
    }
    create() {
        this.createBox()
        this.refreshSize()
        return this.box
    }
}
var draw = {
    empty(options) {
        return new EmptyDraw(options)
    },
    rect(options) {
        return new RectDraw(options)
    },
    circle(options) {
        return new CircleDraw(options)
    },
};


export default {
    shapeGroups: shapeGroups,
    draw: draw,
}