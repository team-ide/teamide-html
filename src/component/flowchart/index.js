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
        if (this.w < 20) {
            this.w = 20
        }
        this.h = this.opts.height
        if (this.h < 20) {
            this.h = 20
        }
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
        let round = this.opts.round || 0;
        let circleW = this.w / 4
        circleW = Math.max(circleW, 15)
        let circleH = this.h / 4
        circleH = Math.max(circleH, 15)
        let lCircleW = this.opts.leftCircle ? circleW : 0;
        let rCircleW = this.opts.rightCircle ? circleW : 0;
        let tCircleH = this.opts.topCircle ? circleH : 0;
        let bCircleH = this.opts.bottomCircle ? circleH : 0;
        let cW = lCircleW + rCircleW;
        let cH = tCircleH + bCircleH;
        if (this.hasBg) {
            ctx.beginPath();
            ctx.fillStyle = this.bColor;
            ctx.roundRect(0 + lCircleW, 0 + tCircleH, this.w - cW, this.h - cH, round);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = this.bgColor;
            ctx.roundRect(this.bW + lCircleW, this.bW + tCircleH, this.w - this.bW * 2 - cW, this.h - this.bW * 2 - cH, round / 2);
            ctx.fill();
        } else {
            ctx.lineWidth = this.bW;
            ctx.strokeStyle = this.bColor;

            if (lCircleW > 0) {
                ctx.beginPath();
                ctx.moveTo(lCircleW, tCircleH);

                ctx.arcTo(
                    0, 0,
                    0, this.h / 2,
                    this.h / 2,
                );
                // ctx.quadraticCurveTo(
                //     0, this.h / 2,
                //     this.bW / 2 + lCircleW, this.bW / 2 + tCircleH + this.h - this.bW - cH,
                // );
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.roundRect(this.bW / 2 + lCircleW, this.bW / 2 + tCircleH, this.w - this.bW - cW, this.h - this.bW - cH, round / 2);
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