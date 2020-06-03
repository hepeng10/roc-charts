import Base from '../Base';

export default class Scene extends Base {
    offsetX = 0;
    offsetY = 0;
    scale = 1;

    init() {
        this.addEventListener();
    }

    getWidth() {
        return this.$zr.getWidth();
    }

    getHeight() {
        return this.$zr.getHeight();
    }

    getCenter() {
        return [this.getWidth() / 2, this.getHeight() / 2];
    }

    move(offsetX, offsetY) {
        this.offsetX += offsetX;
        this.offsetY += offsetY;
        this.$painter.move(offsetX, offsetY);
    }

    // setScale 需要在 painter 初始化后调用
    setScale(scale, isDebounce = false) {
        this.scale = scale;
        this.$painter.scale(scale, isDebounce);
    }
    getScale() {
        return this.scale;
    }
    setRotation(angle) {
        this.$painter.rotation(angle);
    }
    // 添加事件
    addEventListener() {
        // 将 event 中定义的默认支持事件添加给 zrender 对象
        for (let eventName in this.$event.event) {
            this.$zr.on(eventName, (e) => {
                this.$event.trigger(eventName, e.target);
            });
        }
    }
}
