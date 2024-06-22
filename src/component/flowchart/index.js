var shapeGroups = []

var baseGroup = { text: "基础", shapes: [] }
shapeGroups.push(baseGroup)

baseGroup.shapes.push({
    text: "开始/结束", img: "start.png", width: 100, height: 50,
    code: `
<svg xmlns="http://www.csnd.org/2000/svg" version="1.1" height="100%" width="100%">
    <rect width="100%" height="100%" rx="30%" />
</svg>
` })

baseGroup.shapes.push({
    text: "矩形", img: "rect.png", width: 100, height: 50,
    code: `
<svg xmlns="http://www.csnd.org/2000/svg" version="1.1" height="100%" width="100%">
    <rect width="100%" height="100%" rx="10%" ry="10%"/>
</svg>
` })
baseGroup.shapes.push({
    text: "圆形", img: "circle.png", width: 100, height: 100,
    code: `
<svg xmlns="http://www.csnd.org/2000/svg" version="1.1" height="100%" width="100%">
    <circle cx="50%" cy="50%" r="50%"/>
</svg>
` })

let getParallelogramPolygon = (width, height) => {

    return `<polygon points="${0.20 * width},0 ${width},0 ${0.80 * width},${height} 0,${height}"/>`
}

baseGroup.shapes.push({
    text: "平行四边形", img: "parallelogram.png", width: 100, height: 50,
    code: `
<svg xmlns="http://www.csnd.org/2000/svg" version="1.1" height="100%" width="100%">
    ${getParallelogramPolygon(100, 50)}
</svg>
` })

let getDiamondPolygon = (width, height) => {

    return `<polygon points="${0.50 * width},0 ${width},${0.50 * height} ${0.50 * width},${height} 0,${0.50 * height}"/>`
}

baseGroup.shapes.push({
    text: "菱形", img: "diamond.png", width: 100, height: 70,
    code: `
<svg xmlns="http://www.csnd.org/2000/svg" version="1.1" height="100%" width="100%">
    ${getDiamondPolygon(100, 70)}
</svg>
` })


export default {
    shapeGroups: shapeGroups,
}