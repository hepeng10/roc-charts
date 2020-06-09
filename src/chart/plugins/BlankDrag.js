import Base from '../core/plugin/Base';
import { event, getClientXY, isScale } from '../utils/mobile';
import { isNode } from '../utils/util';
import { linkConfig } from '../config/config';

// 点击空白处高亮所有节点
export default class BlankDrag extends Base {
    static pluginName = 'blankDrag';

    defaultConfig() {
        return {
            drag: true,
        };
    }

    init() {
        let x, y, xm, ym;
        let optimizeLinks, isRemoveLinks;

        const mousemove = (e) => {
            if (isScale(e)) {
                return;
            }

            const xy = getClientXY(e);
            xm = xy[0];
            ym = xy[1];

            const offsetX = xm - x;
            const offsetY = ym - y;
            x = xm;
            y = ym;
            // 优化 Link 的时候，需要在鼠标按下并移动后才优化，而不是鼠标按下时就优化，所以需要判断 offset
            if ((offsetX !== 0 || offsetY !== 0) && optimizeLinks && !isRemoveLinks) {
                this.$painter.removeLinks();
                isRemoveLinks = true;
            }
            this.$scene.move(offsetX, offsetY);
        };

        const zrMouseDown = (e) => {
            // 点击位置是节点，或 drag 为 false 时，不能拖拽
            if (isNode(e) || !this.config.drag) {
                return;
            }
            if (isScale(e)) {
                return;
            }
            const xy = getClientXY(e);
            x = xy[0];
            y = xy[1];

            document.addEventListener(event.mousemove, mousemove);
            document.addEventListener(event.mouseup, mouseup);

            // 当 links 大于100条时，拖拽时移除线，优化性能
            let { links } = this.$store;
            optimizeLinks = links.length > linkConfig.optimize;
        };

        const mouseup = () => {
            if (optimizeLinks) {
                this.$painter.addLinks();
                isRemoveLinks = false;
            }

            document.removeEventListener(event.mousemove, mousemove);
            document.removeEventListener(event.mouseup, mouseup);
        };
        this.$zr.on('mousedown', zrMouseDown);
    }
}
