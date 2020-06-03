import Base from '../core/plugin/Base';

// 点击空白处高亮所有节点
export default class BlankClick extends Base {
    static pluginName = 'blankClick';

    defaultConfig() {
        return {
            click: true,
        };
    }

    init() {
        this.$zr.on('click', (e) => {
            if (!this.config.click) {
                return;
            }

            console.log('取消高亮')
            if (!e.target || !e.target.source) {
                this.$painter.highlightAll();
                this.$painter.clearAllSelected();
                this.$painter.draw.draw();
            }
        });
    }
}
