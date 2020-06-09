import zr from 'zrender';
import gof from 'get-object-field';
import Base from '../Base';
import graph from '../graph';
import extendSVG from '../../images/extension.svg';
import { nodeConfig, linkConfig } from '../../config/config';
import { debounce } from '../../utils/util';

export default class Draw extends Base {
    watermark;

    init() {
        this.drawWatermark();

        this.debounceDraw = debounce(this.draw.bind(this), 300);
    }

    // 画节点
    drawNode(node) {
        if (node.style.hide) {
            return;
        }

        if (node.style.size === 'small') {
            node.style = { ...nodeConfig.size.small, ...node.style };
        } else if (node.style.size === 'large') {
            node.style = { ...nodeConfig.size.large, ...node.style };
        }

        let nodeGraph;

        if (node.style.image) {  // 画图片
            nodeGraph = graph.node(node);
        } else {  // 画圆
            nodeGraph = graph.circle(node);
        }
        if (node.selected) {
            const circle = graph.circleBG(node);
            nodeGraph.add(circle);
        }

        // 画 subImage
        const subImg = gof(node, {})('subImage')();
        let images = [];
        if (!subImg.hide) {
            images = gof(subImg, [])('images')();
        }
        images.forEach(img => {
            img.r = subImg.r || nodeConfig.sub.r;
        });
        // 配置中开启绘制 extend 图标
        if (this.$chart.config.showExtend && node.extend) {
            if (gof(images[0])('type')() !== 'extend') {  // 第一个图标不是 extend 的才添加 extend，否则每次渲染都会添加 extend
                if (images.length) {  // subImage 有的，要让 extend 图标大小和 subImage 的一致
                    images.unshift({ ...subImg.images[0], image: extendSVG, type: 'extend' });  //  extend 标识排在第一位
                } else {
                    images.unshift({ image: extendSVG, type: 'extend' });
                }
            }
        } else if (gof(images[0])('type')() === 'extend') {  // 删除 extend 图标
            images.shift();
        }
        const showImages = images.filter(item => !item.hide);
        showImages.forEach((item, i) => {
            item.index = i;
            const subIcon = graph.subIcon(node, item);
            nodeGraph.add(subIcon);
        });

        // 配置中开启动画，则需要把 position 设置为 prePosition，才能实现动画从 prePosition 向 position 移动
        if (this.$chart.config.animation) {
            nodeGraph.attr('position', node.prePosition);
        } else {
            nodeGraph.attr('position', node.position);
        }
        // nodeGraph.on('click', () => {console.log(node);});

        node.zrElement = nodeGraph;
        this.$painter.group.nodes.add(nodeGraph);
    }

    drawLink(link) {
        if (link.fromNode.style.hide || link.toNode.style.hide) {
            return;
        }

        const { linksKV } = this.$store;
        // 双向并且这条线是有向的，才绘制成贝塞尔曲线
        if (!link.directionless
            &&
            (
                linksKV[`${link.to}->${link.from}`]
                ||
                linksKV[`${link.from}->${link.to}->directionless`]
                ||
                linksKV[`${link.to}->${link.from}->directionless`]
            )) {
            link.bothway = true;
            link.style.stroke = link.style.stroke || linkConfig.twoWayColor;
        }

        if (this.$chart.config.dynamicLineWidth) {
            link.style.lineWidth = linkConfig.lineWidth / this.$scene.scale;
        } else {
            link.style.lineWidth = linkConfig.lineWidth;
        }

        let lineGraph;
        if (link.type === 'line') {
            lineGraph = graph.line(link);
        } else if (link.type === 'dashLine') {
            lineGraph = graph.dashLine(link);
        } else if (link.bothway) {  // 双向
            lineGraph = graph.bezierLink(link);
        } else if (link.directionless) {  // 无向
            lineGraph = graph.dashLine(link);
        } else {
            lineGraph = graph.link(link);
            // console.log(123, lineGraph)
        }
        // lineGraph.on('click', () => {console.log(link);});

        link.zrElement = lineGraph;
        this.$painter.group.links.add(lineGraph);
    }

    drawNodes(nodes) {
        nodes.forEach((node) => {
            this.drawNode(node);
        });
    }

    drawLinks(linksKV) {
        for (let k in linksKV) {
            this.drawLink(linksKV[k]);
        }
    }

    drawWatermark() {
        if (this.watermark) {
            this.$zr.remove(this.watermark);
        }

        const { watermark } = this.$chart.config;
        if (watermark) {
            const option = {
                style: watermark,
                width: this.$zr.getWidth(),
                height: this.$zr.getHeight(),
            };

            const img = new Image();
            img.src = option.style.image;

            const canvas = zr.util.createCanvas();
            var ctx = canvas.getContext('2d');
            canvas.width = option.style.width;
            canvas.height = option.style.height;

            img.onload = () => {
                ctx.drawImage(img, 0, 0, option.style.width, option.style.height);
                const pattern = new zr.Pattern(canvas, 'repeat');
                this.watermark = new zr.Rect({
                    shape: {
                        width: option.width,
                        height: option.height,
                    },
                    style: {
                        fill: pattern,
                    },
                    cursor: 'default',
                    z: -1
                });
                this.$zr.add(this.watermark);
            };
        }
    }

    onlyDrawNodes() {
        this.$painter.clearElement();
        const { nodes } = this.$store;
        this.drawNodes(nodes);
        this._draw();
        if (this.$chart.config.animation) {
            this.$painter.animate();
        }
    }

    // 全量绘制
    draw(data) {
        if (data !== undefined) {
            this.$store = data;
        }
        this.$painter.clearElement();
        const { nodes, linksKV } = this.$store;
        this.drawNodes(nodes);
        this.drawLinks(linksKV);
        this._draw();
        if (this.$chart.config.animation) {
            this.$painter.animate();
        }
    }

    _draw() {
        for (let k in this.$painter.group) {
            this.$zr.add(this.$painter.group[k]);
        }
    }
}
