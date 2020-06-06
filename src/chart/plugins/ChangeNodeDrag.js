import Base from '../core/plugin/Base';

import icon from '../images/pluginIcon/disableDrag.svg';

export default class ChangeNodeDrag extends Base {
    static pluginName = 'changeNodeDrag';

    btn;

    depend() {
        return ['nodeDrag'];
    }

    init() {
        // 依赖的插件未加载，自身也不创建
        if (!this.dependLoaded) {
            return;
        }

        this.initButton();

        this.btn.onClick(() => {
            this.onClick();
        });
    }

    initButton() {
        this.btn = this.createButton({
            icon,
            name: '关闭节点拖拽',
            info: '关闭节点拖拽',
            active: !this.$plugin.config.nodeDrag.drag
        });
    }

    onClick() {
        this.$plugin.config.nodeDrag.drag = !this.btn.active;
    }
}
