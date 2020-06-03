import Chart from '../core';
import { getNodesBox } from './util';

const space = 200;  // 图片里的图谱和四边的间隙
const maxW = 8000;  // 绘制临时图谱的容器的最大宽度，容器过大时，无法进行绘制，所以要限制宽度
let scale = 1;  // 图片过大时的缩小比例，1为不缩放
let chart;  // 要生成图片的图谱的原始 chart 对象
let box;  // 图谱的原始大小。包括 x（最左节点坐标）, y（最上节点坐标）, w, h
let div;  // 绘制图片的容器

function createDom() {
    div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.left = 0;
    div.style.top = 0;
    div.style.width = box.w > maxW ? `${maxW + space}px` : `${box.w + space}px`;  // 增加 space 像素的空白边框
    div.style.height = box.w > maxW ? `${box.h * scale + space}px` : `${box.h + space}px`;  // 图谱宽度大于最大值，高度也要进行缩放
    div.style.zIndex = -10;
    div.style.opacity = 0;
    div.setAttribute('id', 'tempChart');
    document.documentElement.appendChild(div);
}

function newTempChart() {
    const tempChart = new Chart({
        id: 'tempChart',
        type: chart.chartType,
        data: chart.store  // 使用原始的 chart 坐标绘图
    });
    tempChart.init({
        core: {
            initStore: false,  // 不初始化 store，避免重新计算坐标
            animation: false,
            dynamicLineWidth: true,  // 动态线宽，保证缩小后的图片在1:1展示的时候线的宽度一样
            initPlugin: false,
            scale: 1,
            watermark: chart.config.watermark
        },
        chart: chart.chart.config
    });

    // 在新的 div 上绘制了原始的图后，由于坐标是原始的图的，很多节点为负坐标，会绘制在画布外面，所以移动 -box.x, -box.y 后，最边缘的节点就会刚好在画布上，再多移动 space / 2 留出边框
    if (scale === 1) {
        tempChart.scene.move(-box.x + space / 2, -box.y + space / 2);
    } else {  // 进行了缩放，则移动的位置也要进行缩放
        tempChart.scene.move(-box.x * scale + space / 2, -box.y * scale + space / 2);
        tempChart.scene.setScale(scale);
    }
}

// 合并多层 canvas 到一层上
function mergeCanvas() {
    let canvas = document.createElement('canvas');

    const w = parseInt(div.getBoundingClientRect().width);
    const h = parseInt(div.getBoundingClientRect().height);

    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);

    let allCanvas = div.querySelectorAll('canvas');
    for(let i = 0; i < allCanvas.length; i++){
        ctx.drawImage(allCanvas[i], 0, 0, w, h);
    }

    return canvas;
}
function toDataURL(cb) {
    // 图谱绘制需要时间，所以延迟执行 canvas 转 base64 功能
    setTimeout(() => {
        const canvas = mergeCanvas();
        const base64 = canvas.toDataURL('image/png');
        chart.hideLoading();
        div.parentNode.removeChild(div);  // 图片生成完成，移除 div
        cb(base64);
    }, 1000 + (chart.store.nodes.length + chart.store.links.length) / 2);
}

export default function chart2img(originChart, cb = () => {}) {
    chart = originChart;
    box = getNodesBox(chart.store.nodes);

    if (box.w > maxW) {
        scale = maxW / box.w;
    } else {
        scale = 1;
    }

    chart.showLoading();
    createDom();
    newTempChart();
    toDataURL(cb);
}
