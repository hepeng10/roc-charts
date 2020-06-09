import zr from 'zrender';
import gof from 'get-object-field';
import { event } from '../utils/mobile';

import Base from '../core/plugin/Base';

import icon from '../images/pluginIcon/lasso.svg';

// 套索工具
export default class LassoSelect extends Base {
    static pluginName = 'lasso';

    group;
    btn;
    points = [];  // 绘制选择框的所有坐标
    selectArea;

    defaultConfig() {
        return {
            backgroundColor: 'orange',
            borderColor: 'red',
        }
    }

    init() {
        this.initButton();
        this.initPainter();

        this.btn.onClick(() => {
            this.onClick();
        });
    }

    get blankDrag() {
        return gof(this.$plugin.config)('blankDrag')('drag')();
    }
    set blankDrag(bool) {
        if (this.$plugin.config.blankDrag) {
            this.$plugin.config.blankDrag.drag = bool;
        }
    }

    initButton() {
        this.btn = this.createButton({
            icon,
            name: '套索工具',
            info: '套索工具：圈选节点',
            active: !this.blankDrag
        });
    }

    initPainter() {
        this.group = new zr.Group();

        const mousemove = (e) => {
            const x = e.zrX;
            const y = e.zrY;
            this.points.push([x, y]);
            this.group.removeAll();
            this.drawSelector();
        };

        const zrMouseDown = (e) => {
            // 点击位置不在空白处，或 blankDrag 为 true 时，不能筛选
            if (e.target?.source || this.blankDrag) {
                return;
            }
            const x = e.event.zrX;
            const y = e.event.zrY;
            this.points.push([x, y]);
            document.addEventListener(event.mousemove, mousemove);
            document.addEventListener(event.mouseup, mouseup);
        };

        const mouseup = () => {
            this.getSelectedNodes();

            document.removeEventListener(event.mousemove, mousemove);
            document.removeEventListener(event.mouseup, mouseup);
            this.points = [];
            this.group.removeAll();
            this.$zr.remove(this.group);
        };
        this.$zr.on('mousedown', zrMouseDown);
    }

    drawSelector() {
        const opt = {
            shape: {
                points: this.points,
                smooth: 0,
            },
            style: {
                fill: this.config.backgroundColor,
                stroke: this.config.borderColor,
                opacity: .5,
            },
            zlevel: 100,
        };
        this.selectArea = new zr.Polygon(opt);

        this.group.add(this.selectArea);
        this.$zr.add(this.group);
    }
    // 获取选框中的节点
    getSelectedNodes() {
        const store = this.$store;
        const scene = this.$chart.scene;
        const { offsetX, offsetY, scale } = scene;
        const nodes = store.nodes;
        // 没选中的节点圈中变成选中状态，选中的节点再圈变成取消选中状态
        let selectedNodes = [];  // 选中的节点
        let clearNodes = [];  // 清除边框的节点
        nodes.forEach((node) => {
            // 节点坐标 * scale + offset 得到距离左上角原点的坐标
            let x = node.position[0] * scale + offsetX;
            let y = node.position[1] * scale + offsetY;
            if (this.selectArea && this.selectArea.contain(x, y)) {
                if (node.selected) {
                    clearNodes.push(node.id);
                } else {
                    selectedNodes.push(node.id);
                }
            }
        });
        this.$chart.painter.removeSelect(clearNodes);
        this.$chart.util.addSelect(selectedNodes);
    }

    onClick() {
        this.blankDrag = !this.blankDrag;
    }
}
