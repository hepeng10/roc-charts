import Base from '../core/plugin/Base';
import gof from 'get-object-field';

// 点击节点，有关系的节点高亮功能
export default class NodeClick extends Base {
    static pluginName = 'nodeClick';

    clickTime;
    t;

    defaultConfig() {
        return {
            click: true,
            deep: false
        };
    }

    init() {
        // 使用 mousedown 和 mouseup 来模拟 click 事件，在 mouseup 的时候获取节点来进行高亮即可
        let time;
        let isAutoMove = false;

        // mousedown 执行后，mousemove 会自动执行一次。所以使用一个 isAutoMove 来判断是否已自动执行，isAutoMove 为 false 时说明是第一次，不重置 time
        const clearTime = () => {
            if (isAutoMove) {
                time = 0;
            }
            isAutoMove = true;
        };

        this.$zr.on('mousedown', (e) => {
            // 避免双击触发两次单击
            if (this.clickTime && Date.now() - this.clickTime < 300) {
                clearTimeout(this.t);
                this.clickTime = 0;
                return;
            }
            this.clickTime = Date.now();

            // 鼠标左键或触屏点击才执行
            if (e.which === 1 || e.which === 0) {
                time = Date.now();
            }

            // 如果移动了，则把 time 设置为0，mouseup 里的 time2 - time 肯定就是大于500的，不会执行代码
            this.$zr.on('mousemove', clearTime);
        });
        this.$zr.on('mouseup', (e) => {
            this.$zr.off('mousemove', clearTime);
            isAutoMove = false;

            const time2 = Date.now();
            // 延迟300ms执行，如果是双击，第二次按下时就会清除定时器
            this.t = setTimeout(() => {
                if (time2 - time < 500) {
                    if (!this.config.click) {
                        return;
                    }
                    console.log(gof(e.target)('source')());

                    const source = gof(e.target)('source')();
                    if (source && source.category === 'node') {
                        this.$painter.highlightAll();
                        this.$painter.relationHighlight(source.id, this.config.deep);
                        this.$painter.clearAllSelected();
                        this.$painter.select([source.id]);
                        this.$chart.util.getSelectedNodes();
                        this.$chart.draw();
                    }
                }
            }, 300);
        });
    }
}
