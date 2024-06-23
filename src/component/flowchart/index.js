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


export default {
    shapeGroups: shapeGroups,
}