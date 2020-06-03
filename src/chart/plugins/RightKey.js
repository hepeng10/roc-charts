import Base from '../core/plugin/Base';

import { isNode } from '../utils/util';

export default class RightKey extends Base {
    static pluginName = 'rightKey';

    init() {
        // 没传 rightKey 配置，则不初始化，直接退出
        if (!this.config.keys) {
            return;
        }

        this.dom = null;
        this.items = [];  // 被添加的功能数组对象
        this.x = 0;
        this.y = 0;
        this.display = 'none';

        this.create();
    }

    create() {
        this.$chart.zr.on('contextmenu', (e) => {
            e.event.preventDefault();

            if (this.display === 'block') {
                this.hide();
            }
            this.show(e);
        });

        this.$chart.zr.on('click', () => {
            this.hide();
        });
    }

    show(e) {
        this.addItem(e);
        if (!this.items.length) {
            return;
        }

        this.createDom();
        this.updatePosition(e.event.pageX, e.event.pageY);
        this.display = 'block';
        this.dom.style = this.computeStyle();
    }

    hide() {
        if (this.dom) {
            this.display = 'none';
            this.dom.style = this.computeStyle();
        }
    }

    // 动态添加功能。只有当 config 中 isShow 未定义 或 返回值 ture 时，这个功能才会被添加到右键菜单中
    addItem(e) {
        this.items = [];
        this.config.keys.forEach((item) => {
            const params = {
                isNode: isNode(e),
                target: e.target,
                $chart: this.$chart,
                plugins: this.$plugin.plugins,
            };
            if (item.isShow === undefined || item.isShow(params)) {
                this.items.push({
                    name: item.name,
                    click: item.click.bind(null, params),
                });
            }
        });
    }

    createDom() {
        const elem = document.createElement('div');
        elem.setAttribute('class', 'contextMenu-roc');
        elem.setAttribute('style', 'display:none');
        this.items.forEach((item) => {
            const child = document.createElement('div');
            item.dom = child;
            child.setAttribute('class', 'menu-item-roc');
            child.textContent = item.name;
            child.addEventListener('click', () => {
                item.click.apply(null);
                this.hide();
            });
            elem.appendChild(child);
        });
        const parent = document.querySelector('body');
        parent.appendChild(elem);
        this.dom = elem;
    }

    computeStyle() {
        return `position:absolute;top:${this.y}px;left:${this.x}px;display:${this.display};`;
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
        this.dom.style = this.computeStyle();
    }
}
