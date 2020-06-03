// 按 h 键隐藏选中的节点
import gof from 'get-object-field';
import Base from '../core/plugin/Base';

import icon from '../images/pluginIcon/hide.svg';

export default class HideSelectedNodes extends Base {
    static pluginName = 'hideSelectedNodes';

    btn;

    init() {
        this.initButton();
        this.addBtnEvent();
        this.addNodeDblClick();
    }

    initButton() {
        this.btn = this.createButton({
            icon,
            name: '隐藏节点',
            info: '隐藏选中的节点，快捷键 h。隐藏后双击节点会显示与其相邻被隐藏的节点。',
            activeChange: false
        });
    }

    addBtnEvent() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'h') {
                this.onClick();
            }
        }, false);

        this.btn.onClick(() => {
            this.onClick();
        });
    }

    onClick() {
        const selectedNodes = this.$chart.selectedNodes;
        this.$chart.util.hideNodes(selectedNodes);
    }

    addNodeDblClick() {
        // 双击节点显示与其相邻的节点
        this.$chart.addEventListener('dblclick', (target) => {
            const source = gof(target, {})('source')();
            if (source.category === 'node') {
                this.$chart.util.showRelationNodes(source.id);
            }
        });
    }
}
