// 事件对象，采用订阅-发布功能实现
export default class Event {
    event = {
        click: [],
        dblclick: [],
        mousedown: [],
        mousemove: [],
        mouseup: [],
        mousewheel: [],
    };

    add(eventName, cb) {
        if (!this.event[eventName]) {
            this.event[eventName] = [];
        }
        this.event[eventName].push(cb);
    }

    remove(eventName, cb) {
        if (!this.event[eventName]) {
            return;
        }
        for (let i = 0; i < this.event[eventName].length; i++) {
            if (this.event[eventName][i] === cb) {
                this.event[eventName].splice(i, 1);
                break;
            }
        }
    }

    trigger(eventName, ...args) {
        const cbs = this.event[eventName];
        if (cbs) {
            cbs.forEach((cb) => {
                cb(...args);
            });
        }
    }
}
