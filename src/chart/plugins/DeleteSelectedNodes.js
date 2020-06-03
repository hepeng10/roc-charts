import Base from '../core/plugin/Base';

// 按 Delete 键删除选中的节点
export default class DeleteSelectedNodes extends Base {
    static pluginName = 'deleteSelectedNodes';

    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete') {
                this.onClick();
            }
        }, false);
    }

    onClick() {
        const selectedNodes = this.$chart.selectedNodes;
        this.$chart.util.deleteNodes(selectedNodes);
    }
}
