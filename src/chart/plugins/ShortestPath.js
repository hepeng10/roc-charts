import Base from '../core/plugin/Base';
import toast from '../utils/toast/toast';

import icon from '../images/pluginIcon/shortestPath.svg';

export default class ShortestPath extends Base {
    static pluginName = 'shortestPath';

    btn;

    init() {
        this.initButton();

        this.btn.onClick(() => {
            this.onClick();
        });
    }

    initButton() {
        this.btn = this.createButton({
            icon,
            name: '最短路径',
            info: '最短路径：选择两个点后，点击可显示两点间的最短路径。',
            activeChange: false
        });
    }

    onClick() {
        this.$chart.showLoading();
        const ids = this.$chart.selectedNodes;
        if (ids.length !== 2) {
            toast({ text: '请选择两个节点' }).showToast();
            this.$chart.hideLoading();
            return;
        }

        setTimeout(() => {
            const pathArr = this.$chart.util.breadthFindShortestPath(ids[0], ids[1]);
            // console.log(pathArr);
            if (pathArr.length === 0) {
                toast({ text: '未找到最短路径' }).showToast();
            } else {
                this.$chart.util.highlightPath(pathArr);
            }
            this.$chart.hideLoading();
        }, 0);
    }
}
