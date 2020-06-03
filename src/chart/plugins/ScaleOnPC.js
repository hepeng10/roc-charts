import Base from '../core/plugin/Base';
import { sceneConfig } from '../config/config';
import { isMobile } from '../utils/mobile';

// 点击空白处高亮所有节点
export default class ScaleOnPC extends Base {
    static pluginName = 'scaleOnPC';

    init() {
        if (isMobile) {
            return;
        }

        let preScale;

        const move = (e) => {
            const x = e.offsetX - this.$scene.offsetX;
            const y = e.offsetY - this.$scene.offsetY;
            const offsetX = x * (this.$scene.scale - preScale) / preScale;
            const offsetY = y * (this.$scene.scale - preScale) / preScale;
            this.$scene.move(-offsetX, -offsetY);
        };

        const { max, min, step } = sceneConfig.scale;

        this.$zr.on('mousewheel', (e) => {
            const { wheelDelta } = e;
            preScale = this.$scene.scale;
            if (wheelDelta > 0) {
                if (this.$scene.scale < max) {
                    this.$scene.scale += step;
                    this.$scene.scale = Number(this.$scene.scale.toFixed(2));
                    if (this.$scene.scale > max) {
                        this.$scene.scale = max;
                    }
                    this.$painter.scale(this.$scene.scale, true);
                    // 要根据鼠标位置缩放，则要在缩放后再次移动，将缩放点的位置移动到鼠标位置
                    move(e);
                }
            } else if (this.$scene.scale > min) {
                this.$scene.scale -= step;
                this.$scene.scale = Number(this.$scene.scale.toFixed(2));
                if (this.$scene.scale < min) {
                    this.$scene.scale = min;
                }
                this.$painter.scale(this.$scene.scale, true);

                move(e);
            }
        });
    }
}
