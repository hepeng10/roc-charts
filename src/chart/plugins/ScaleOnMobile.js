import Base from '../core/plugin/Base';
import { sceneConfig } from '../config/config';
import { event, isMobile, isScale } from '../utils/mobile';
import { getElementTop } from '../utils/util';
import { linePointCoordinate, twoPointsDistance } from '../utils/math';

// 点击空白处高亮所有节点
export default class ScaleOnMobile extends Base {
    static pluginName = 'scaleOnMobile';

    init() {
        if (!isMobile) {
            return;
        }

        let prePos = [];
        let preScale;

        const move = (e) => {
            const canvasTop = getElementTop(e.target);
            const x1 = e.touches[0].clientX;
            const y1 = e.touches[0].pageY - canvasTop;  // 触摸点到页面顶部的距离 - canvas到页面顶部的距离，得到触摸点到 canvas 顶部的距离
            const x2 = e.touches[1].clientX;
            const y2 = e.touches[1].pageY - canvasTop;

            const dis = twoPointsDistance(x1, y1, x2, y2);
            const pos = linePointCoordinate(x1, x2, y1, y2, dis / 2);  // 得到两指的中点坐标
            const x = pos[0] - this.$scene.offsetX;
            const y = pos[1] - this.$scene.offsetY;
            const offsetX = x * (this.$scene.scale - preScale) / preScale;
            const offsetY = y * (this.$scene.scale - preScale) / preScale;
            this.$scene.move(-offsetX, -offsetY);
        };

        const zrMouseDown = (e) => {
            if (!isScale(e)) {
                return;
            }

            prePos = e.event.touches;

            document.addEventListener(event.mousemove, mousemove);
            document.addEventListener(event.mouseup, mouseup);
        };

        // 缩放，勾股定理方法
        const getDistance = (p1, p2) => {
            const x = p2.clientX - p1.clientX;
            const y = p2.clientY - p1.clientY;
            return Math.sqrt((x * x) + (y * y));
        };
        const mousemove = (e) => {
            if (!isScale(e)) {
                return;
            }

            preScale = this.$scene.scale;
            // 得到第二组两个点
            const currentPos = e.touches;
            // 得到缩放比例
            let scaleRatio = (getDistance(currentPos[0], currentPos[1]) / getDistance(prePos[0], prePos[1]));
            scaleRatio = Number(scaleRatio.toFixed(2));
            const scale = this.$scene.scale * scaleRatio;
            prePos = currentPos;

            const { max, min } = sceneConfig.scale;
            if (scale > max || scale < min) {
                return;
            }

            this.$scene.setScale(scale, true);
            move(e);
        };

        const mouseup = () => {
            document.removeEventListener(event.mousemove, mousemove);
            document.removeEventListener(event.mouseup, mouseup);
        };

        this.$zr.on('mousedown', zrMouseDown);
    }
}
