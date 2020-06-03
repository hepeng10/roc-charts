import gof from 'get-object-field';

export const uuid = (len = 6, radix) => {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [],
        i;
    radix = radix || chars.length;

    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    return uuid.join('');
}

// 获取元素到页面顶部的距离
export const getElementTop = (element) => {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}

export const isNode = (e) => {
    return gof(e.target)('source')('category')() === 'node';
};

export const getNode = (e) => {
    return gof(e.target)('source')();
};

// 两点坐标求距离
export const twoPointsDistance = (x1, y1, x2, y2) => {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
};
// 两点坐标求角度
export const twoPointsAngle = (x1, y1, x2, y2) => {
    let x = x2 - x1;
    let y = y2 - y1;
    let angle = 360 * Math.atan(x / y) / (2 * Math.PI);
    // 修正角度
    if (x <= 0 && y > 0) {
        angle = Math.abs(angle) + 90;
    }
    if (x > 0 && y >= 0) {
        angle = 90 - angle;
    }
    if (x >= 0 && y < 0) {
        angle = Math.abs(angle) + 270;
    }
    if (x < 0 && y <= 0) {
        angle = 270 - Math.abs(angle);
    }

    return angle;
};
// 求线上某点的坐标
export const linePointCoordinate = (x1, x2, y1, y2, minusDistance) => {
    const distance = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)); // 两点的距离
    const pointDistance = distance - minusDistance; // 三角形原点距离
    const x = pointDistance * (x2 - x1) / distance + x1;
    const y = pointDistance * (y2 - y1) / distance + y1;
    return [x, y];
};
// 获取图的宽高
export const getNodesBox = nodes => {
    if (!nodes || nodes.length === 0) {
        return { x: 0, y: 0, w: 0, h: 0 };
    }
    let x0 = Infinity,
        y0 = Infinity,
        x1 = -Infinity,
        y1 = -Infinity;
    nodes.forEach(node => {
        if (node.position[0] < x0) {x0 = node.position[0];}
        if (node.position[0] > x1) {x1 = node.position[0];}
        if (node.position[1] < y0) {y0 = node.position[1];}
        if (node.position[1] > y1) {y1 = node.position[1];}
    });
    return {
        x: x0,
        y: y0,
        w: x1 - x0,
        h: y1 - y0
    };
};

// 贝塞尔相关
export const normalize = (vector) => {
    let len = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
    if (len == 0) return [0, 0];
    return [vector[0] / len, vector[1] / len];
};
// 获取贝塞尔曲线控制点坐标
export const getControlPos = (x1, y1, x2, y2, factor = 20, count = 1, order) => {
    let ratio = (count) % 2 == 1 ? 1 : -1;
    ratio *= order ? 1 : -1;

    factor *= ratio * ((count + 1) >> 1);

    let norV = normalize([y1 - y2, x2 - x1]);
    return [norV[0] * factor + (x1 + x2) / 2, norV[1] * factor + (y1 + y2) / 2];
};
export const getPointOnBezier = (t, x1, y1, x2, y2, xi, yi) => {
    // http://stackoverflow.com/a/5634528
    return [
        Math.pow(1 - t, 2) * x1 + 2 * (1 - t) * t * xi + Math.pow(t, 2) * x2,
        Math.pow(1 - t, 2) * y1 + 2 * (1 - t) * t * yi + Math.pow(t, 2) * y2
    ];
};
export const getPointTangentOnBezier = (t, x1, y1, x2, y2, xi, yi) => {
    let pos1 = getPointOnBezier(t, x1, y1, x2, y2, xi, yi);
    let pos2 = getPointOnBezier(t + 0.001, x1, y1, x2, y2, xi, yi);
    return normalize([pos2[0] - pos1[0], pos2[1] - pos1[1]]);
};

// 函数防抖
export const debounce = (func, wait) => {
    let timer;

    return () => {
        clearTimeout(timer);
        timer = setTimeout(func, wait);
    };
};
