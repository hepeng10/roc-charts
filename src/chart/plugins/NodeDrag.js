import Base from '../core/plugin/Base';
import { linkConfig } from '../config/config';
import { event, getClientXY, isScale } from '../utils/mobile';
import { isNode } from '../utils/util';

// 节点拖拽功能
export default class NodeDrag extends Base {
    static pluginName = 'nodeDrag';

    defaultConfig() {
        return {
            drag: true,
        };
    }

    init() {
        let nodeGroup, x, y, xm, ym;

        // 当 links 大于100条时，拖拽时移除线，优化性能
        let { links } = this.$store;
        const optimizeLinks = links && links.length > linkConfig.optimize;

        const mousemove = (e) => {
            if (isScale(e) || !this.config.drag) {
                return;
            }

            const xy = getClientXY(e);
            xm = xy[0];
            ym = xy[1];

            const offsetX = xm - x;
            const offsetY = ym - y;
            x = xm;
            y = ym;
            // 鼠标移动距离除以缩放系数，得到节点应该移动的距离
            const nodeOffsetX = offsetX / this.$scene.scale;
            const nodeOffsetY = offsetY / this.$scene.scale;
            const newPositionX = nodeGroup.position[0] + nodeOffsetX;
            const newPositionY = nodeGroup.position[1] + nodeOffsetY;
            nodeGroup.attr('position', [newPositionX, newPositionY]);
            nodeGroup.source.prePosition = [newPositionX, newPositionY];
            nodeGroup.source.position = [newPositionX, newPositionY];

            if (!optimizeLinks) {
                this.$painter.refreshLinks();
            }
        };
        const mouseup = () => {
            if (optimizeLinks) {
                this.$painter.addLinks();
            }
            document.removeEventListener(event.mousemove, mousemove);
            document.removeEventListener(event.mouseup, mouseup);
        };
        const nodeMousedown = (e) => {
            // 将 config 里的是否启用判断放在这里，而不是放在 initConfig 中，是为了可以在图谱初始化后还能随时修改 config
            if (!this.config.drag) {
                return;
            }
            if (isScale(e)) {
                return;
            }

            if (isNode(e)) {
                nodeGroup = e.target.parent;  // 得到 nodeGroup

                const xy = getClientXY(e);
                x = xy[0];
                y = xy[1];

                if (optimizeLinks) {
                    this.removeLinks();
                }
                // move 的时候可能会移动到画布外，或者从别的元素上移过，如果绑定到自身元素上，当从别的层级更高的元素上移过时就会失去焦点，丢失 mousemove 事件，所以绑定到 document 上，避免出现这类问题
                // 绑定到 document 上，可以整个屏幕有效，而不局限于某个 DOM 元素中拖动
                document.addEventListener(event.mousemove, mousemove);
                document.addEventListener(event.mouseup, mouseup);
            }
        };
        // 将事件绑定在 zr 上，而不是节点上，以提升性能
        this.$zr.on('mousedown', nodeMousedown);
    }
}
