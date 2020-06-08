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

// 函数防抖
export const debounce = (func, wait) => {
    let timer;

    return () => {
        clearTimeout(timer);
        timer = setTimeout(func, wait);
    };
};
