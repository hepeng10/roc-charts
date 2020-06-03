let event = {
    mousedown: 'mousedown',
    mousemove: 'mousemove',
    mouseup: 'mouseup',
};

let isMobile = false;

let isInit = false;

(() => {
    if (isInit) {
        return;
    }
    isInit = true;

    if(/Android|webOS|iPhone|iPad|BlackBerry/i.test(window.navigator.userAgent)) {
        isMobile = true;
        event = {
            mousedown: 'touchstart',
            mousemove: 'touchmove',
            mouseup: 'touchend',
        };
    } else {
        isMobile = false;
        event = {
            mousedown: 'mousedown',
            mousemove: 'mousemove',
            mouseup: 'mouseup',
        };
    }
})();

// 获取鼠标的当前位置
// e 可能是原生的 e，也可能是 zrender 的 e
const getClientXY = (e) => {
    let x, y;
    if (isMobile) {
        try {
            const touch = e.event ? e.event.changedTouches[0] : e.changedTouches[0];
            x = touch.clientX;
            y = touch.clientY;
        } catch (e) {
            x = e.event ? e.event.clientX : e.clientX;
            y = e.event ? e.event.clientY : e.clientY;
        }
    } else {
        x = e.event ? e.event.clientX : e.clientX;
        y = e.event ? e.event.clientY : e.clientY;
    }
    return [x, y];
};

// 判断是否是双指缩放操作
const isScale = (e) => {
    let bool = false;
    e = e.event ? e.event : e;
    if (e.touches && e.touches.length !== 1) {
        bool = true;
    }
    return bool;
};

export { isMobile, event, getClientXY, isScale };
