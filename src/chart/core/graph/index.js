import zr from 'zrender';
import gof from 'get-object-field';

import { nodeConfig, linkConfig, textConfig } from '../../config/config';
import { linefeed } from '../../utils/formatter';
import { twoPointsAngle, linePointCoordinate, getControlPos, twoPointsDistance, getPointOnBezier, getPointTangentOnBezier } from '../../utils/util';

export default {
    circle(node, option = {}) {
        const g = new zr.Group();
        g.source = node;

        const r = gof(node, nodeConfig.size.normal.r)('style')('r')();

        const opt = {
            source: node,  // 自定义属性
            shape: {
                cx: 0,
                cy: 0,
                r
            },
            style: {
                fill: nodeConfig.color,
                ...node.style
            },
            zlevel: 3,
            ...option
        };
        const circle = new zr.Circle(opt);

        if (node.name) {
            const name = this.text(
                linefeed(node.name, 8),
                {
                    position: [0, r],
                    zlevel: 3,
                    style: {
                        opacity: node.style.opacity,
                    },
                    ...option
                }
            );
            g.add(name);
        }

        g.add(circle);
        return g;
    },

    circleBG(node, option = {}) {
        const g = new zr.Group();
        g.source = node;

        const r = gof(node, nodeConfig.size.normal.r)('style')('r')() + 5;

        const opt = {
            source: node,  // 自定义属性
            shape: {
                cx: 0,
                cy: 0,
                r
            },
            style: {
                fill: nodeConfig.selectedColor,
                ...node.style
            },
            zlevel: 3,
            z: -1,
            ...option
        };
        const circle = new zr.Circle(opt);

        g.add(circle);
        return g;
    },

    // 暂未测试
    rectBG(node, option = {}) {
        const g = new zr.Group();
        g.source = node;

        const width = gof(node, nodeConfig.size.normal.width)('style')('width')() + 5;
        const height = gof(node, nodeConfig.size.normal.height)('style')('height')() + 5;

        const opt = {
            source: node,  // 自定义属性
            shape: {
                x: -width / 2,
                y: -height / 2,
                width,
                height,
            },
            style: {
                fill: 'pink',
                ...node.style
            },
            zlevel: 3,
            z: -1,
            ...option
        };
        const rect = new zr.Rect(opt);

        g.add(rect);
        return g;
    },

    // 接收 node 和 opt
    node(node, options = {}) {
        const g = new zr.Group();
        g.source = node;

        const width = gof(node, nodeConfig.size.normal.width)('style')('width')();
        const height = gof(node, nodeConfig.size.normal.height)('style')('height')();
        // const r = gof(node, nodeConfig.size.normal.r)('style')('r')();
        const imgOpt = {
            source: node,  // 自定义属性
            style: {
                x: -width / 2,
                y: -height / 2,
                width,
                height,
                ...node.style
            },
            zlevel: 3,
            cursor: 'pointer',
            ...options
        };
        const img = new zr.Image(imgOpt);
        g.add(img);

        if (node.name) {
            const name = this.text(
                linefeed(node.name, 8),
                {
                    position: [0, height / 2],
                    zlevel: 4,
                    style: {
                        opacity: node.style.opacity,
                        textVerticalAlign: 'top',
                    },
                    ...options
                }
            );
            g.add(name);
        }

        return g;
    },

    text(text, options = {}, points) {
        const {
            position,
            style,
            align = textConfig.align,
            verticalAlign = textConfig.verticalAlign,
            fill = textConfig.color,
            ...option
        } = options;

        let rotation;
        if (points) {
            let p1 = points[0];
            let p2 = points[1];
            let angle = twoPointsAngle(p1[0], p1[1], p2[0], p2[1]);
            // 让文字始终正向
            if (angle >= 90 && angle <= 270) {
                angle += 180;
            }

            rotation = -angle * Math.PI / 180;
        }

        const opt = {
            rotation,
            origin: [position[0], position[1]],
            style: {
                x: position[0],
                y: position[1],
                text: text,
                textAlign: align,
                textVerticalAlign: verticalAlign,
                textFill: fill,
                ...style,
            },
            cursor: 'default',
            ...option
        };
        return new zr.Text(opt);
    },

    extendIcon(node, options = {}) {
        let { image, width, height, ...option } = options;
        const nodeR = gof(node, nodeConfig.size.normal.r)('style')('r')();
        width = width || nodeConfig.extend.width;
        height = height || nodeConfig.extend.height;
        const r = nodeConfig.extend.r;
        const opt = {
            style: {
                x: nodeR - r,
                y: -nodeR - r,
                width,
                height,
                image: image,
                opacity: node.style.opacity,
            },
            zlevel: 3,
            ...option
        };
        return new zr.Image(opt);
    },

    line(link, options = {}) {
        const g = new zr.Group();
        g.source = link;

        const p1 = link.fromNode.position;
        const p2 = link.toNode.position;
        const { color = linkConfig.color, style = {}, ...option } = options;

        const { fromNode, toNode } = link;
        const opacity = Math.min(fromNode.style.opacity, toNode.style.opacity);

        const opt = {
            source: link,  // 自定义属性
            shape: {
                x1: p1[0],
                y1: p1[1],
                x2: p2[0],
                y2: p2[1],
            },
            style: {
                stroke: color,
                lineWidth: linkConfig.lineWidth,
                opacity,
                ...style,
                ...link.style,
            },
            cursor: 'default',
            ...option
        };

        const line = new zr.Line(opt);
        g.add(line);
        // 添加文字
        const [x1, y1] = fromNode.position;
        const [x2, y2] = toNode.position;
        if (gof(link)('data')('text')() && !gof(link)('style')('hideText')()) {
            const textX = (x1 + x2) / 2;
            const textY = (y1 + y2) / 2;
            const text = this.text(linefeed(link.text, 10), { position: [textX, textY], style: { opacity, ...link.style } }, [fromNode.position, toNode.position]);
            g.add(text);
        }

        return g;
    },

    dashLine(link, options = {}) {
        let style = options.style || {};
        style = {
            lineWidth: linkConfig.lineWidth,
            ...style,
            lineDash: [5, 8]
        };
        options.style = style;
        return this.line(link, options);
    },

    bezierLink(link) {
        const g = new zr.Group();
        g.source = link;

        const p1 = link.fromNode.position;
        const p2 = link.toNode.position;

        const { fromNode, toNode } = link;
        const opacity = Math.min(fromNode.style.opacity, toNode.style.opacity);
        const cp = getControlPos(p1[0], p1[1], p2[0], p2[1]);

        const opt = {
            source: link,  // 自定义属性
            shape: {
                x1: p1[0],
                y1: p1[1],
                x2: p2[0],
                y2: p2[1],
                cpx1: cp[0],
                cpy1: cp[1],
            },
            style: {
                stroke: linkConfig.color,
                lineWidth: linkConfig.lineWidth,
                opacity,
                lineDash: link.style.dashed ? [5, 8] : null,
                ...link.style,
            },
            cursor: 'default',
        };

        const bezier = new zr.BezierCurve(opt);
        g.add(bezier);

        // 箭头
        const dis = twoPointsDistance(p2[0], p2[1], cp[0], cp[1]);
        const targetSize = gof(link.toNode, nodeConfig.size.normal.r)('style')('r')();
        const arrowPosRatio = (1 - (targetSize + linkConfig.side) / dis) * 0.5 + 0.5;
        const arrowPos = getPointOnBezier(arrowPosRatio, p1[0], p1[1], p2[0], p2[1], cp[0], cp[1]);
        const [triangleX, triangleY] = arrowPos;
        const angle = twoPointsAngle(cp[0], cp[1], p2[0], p2[1]);
        const halfSide = linkConfig.side / 2;
        let pos1 = [triangleX, triangleY - halfSide];
        let pos2 = [triangleX, triangleY + halfSide];
        let pos3 = [triangleX + halfSide * 2, triangleY];
        const rotation = -angle * Math.PI / 180;
        const triangle = this.triangle(pos1, pos2, pos3, { origin: arrowPos, rotation, style: { opacity, fill: link.style.stroke, ...link.style }, source: link });
        g.add(triangle);

        // 添加文字
        const cp2 = getControlPos(p1[0], p1[1], p2[0], p2[1], 10);  // 控制点偏移量的一半作为文字的坐标，文字基本上就在贝塞尔曲线上
        if (gof(link)('data')('text')()) {
            const text = this.text(linefeed(link.text, 10), { position: [cp2[0], cp2[1]], style: { opacity, textVerticalAlign: 'middle', ...link.style } }, [fromNode.position, toNode.position]);
            g.add(text);
        }

        return g;
    },

    link(link) {
        const g = new zr.Group();
        g.source = link;

        const { fromNode, toNode } = link;
        const [x1, y1] = fromNode.position;
        const [x2, y2] = toNode.position;
        const opacity = Math.min(fromNode.style.opacity, toNode.style.opacity);
        const opt = {
            source: link,  // 自定义属性
            shape: {
                x1,
                y1,
                x2,
                y2,
            },
            style: {
                stroke: linkConfig.color,
                lineWidth: linkConfig.lineWidth,
                opacity,
                lineDash: link.style.dashed ? [5, 8] : null,
                ...link.style,
            },
            cursor: 'default'
        };
        const line = new zr.Line(opt);
        g.add(line);

        // 画三角形箭头
        // 计算三角形原点坐标
        const toNodeR = gof(toNode, nodeConfig.size.normal.r)('style')('r')();
        const minusDistance = toNodeR + linkConfig.side;
        const triangleCoord = linePointCoordinate(x1, x2, y1, y2, minusDistance);
        const [triangleX, triangleY] = triangleCoord;

        const angle = twoPointsAngle(x1, y1, triangleX, triangleY);
        const halfSide = linkConfig.side / 2;
        let p1 = [triangleX, triangleY - halfSide];
        let p2 = [triangleX, triangleY + halfSide];
        let p3 = [triangleX + halfSide * 2, triangleY];
        const rotation = -angle * Math.PI / 180;
        const triangle = this.triangle(p1, p2, p3, { origin: triangleCoord, rotation, style: { opacity, fill: link.style.stroke || linkConfig.color, ...link.style }, source: link });
        g.add(triangle);

        // 添加文字
        if (gof(link)('data')('text')() && !gof(link)('style')('hideText')()) {
            const textX = (x1 + x2) / 2;
            const textY = (y1 + y2) / 2;
            const text = this.text(linefeed(link.text, 10), { position: [textX, textY], style: { opacity, ...link.style } }, [fromNode.position, toNode.position]);
            g.add(text);
        }

        return g;
    },

    triangle(p1, p2, p3, options = {}) {
        const { origin, rotation, style, ...option } = options;
        const opt = {
            origin,
            rotation,
            shape: {
                points: [p1, p2, p3]
            },
            style: {
                fill: linkConfig.color,
                ...style
            },
            cursor: 'default',
            ...option
        };
        return new zr.Polygon(opt);
    },
};
