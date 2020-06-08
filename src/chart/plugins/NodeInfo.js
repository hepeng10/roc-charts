import Base from '../core/plugin/Base';

import { isNode, getNode } from '../utils/util';

// 节点 mouseover 时浮动窗口显示信息
export default class NodeInfo extends Base {
    static pluginName = 'nodeInfo';

    init() {
        // 没传 rightKey 配置，则不初始化，直接退出
        if (!this.config.getNodeInfo) {
            return;
        }

        this.dom = null;
        this.content = '';
        this.x = 0;
        this.y = 0;
        this.display = 'none';
        this.t = null;
        this.preventShow = false;  // 阻止显示
        this.isRequest = false;

        this.createDom();
        this.mouseover();
        this.specialFixed();  // 处理一些需要隐藏 DOM 的特殊情况
    }

    createDom() {
        const elem = document.createElement('div');
        elem.setAttribute('class', 'nodeInfo-roc');
        elem.setAttribute('style', 'display:none');
        const parent = document.querySelector('body');
        parent.appendChild(elem);
        this.dom = elem;

        this.dom.addEventListener('mouseover', () => {
            this.hide();
        }, false);
    }

    specialFixed() {
        document.addEventListener('mousedown', () => {
            this.display = 'none';
            this.computeStyle();
        }, false);
        document.addEventListener('mouseup', () => {
            this.preventShow = true;
            setTimeout(() => {
                this.preventShow = false;
            }, 200);
        }, false);
    }

    mouseover() {
        this.$chart.zr.on('mousemove', (e) => {
            // 鼠标按下时不显示
            // this.preventShow 为 false 时不显示（mouseup 时会执行一次 mousemove 事件，从而导致在放开鼠标时会显示信息框，所以在 mouseup 时将 preventShow 改为 true，从而避免鼠标抬起显示信息框的BUG）
            if (isNode(e) && e.which !== 1 && !this.preventShow) {
                this.show(e);
            } else {
                this.hide();
            }
        });
    }

    async show(e) {
        clearTimeout(this.t);
        this.t = null;

        let info = getNode(e).info;
        if (info) {
            this.showInfo(e, info);
        } else if (this.config.getNodeInfo) {
            info = '数据请求中...';
            this.showInfo(e, info);
            if (!this.isRequest) {
                try {
                    this.isRequest = true;
                    info = await this.config.getNodeInfo(getNode(e));
                    this.isRequest = false;
                    getNode(e).info = info;
                    this.showInfo(e, info);
                } catch (e) {
                    throw new Error(e);
                }
            }
        } else {
            info = '无数据';
            this.showInfo(e, info);
        }
    }

    showInfo(e, info) {
        this.insertInfo(info);
        this.updatePosition(e.event.pageX, e.event.pageY);
        this.display = 'block';
        this.computeStyle();
    }

    hide() {
        // this.t 为 null 的时候才执行 hide。也就是在空白处一直滑动也只会执行一次
        if (this.dom && !this.t) {
            this.t = setTimeout(() => {
                this.display = 'none';
                this.computeStyle();
            }, 200);
        }
    }

    insertInfo(info) {
        this.dom.innerHTML = info;
    }

    computeStyle() {
        this.dom.style.position = 'absolute';
        this.dom.style.top = this.y + 'px';
        this.dom.style.left = this.x + 'px';
        this.dom.style.display = this.display;
    }

    updatePosition(x, y) {
        this.x = x + 20;
        this.y = y + 10;
        this.computeStyle();
    }
}
