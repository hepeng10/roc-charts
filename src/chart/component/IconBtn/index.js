import './style.less';

export default class IconBtn {
    config = {
        width: 35,
        height: 30
    }

    icon;
    info;
    active;
    activeChange;

    elem;

    /*
    * @param {base64} icon 图标
    * @param {string} name 图标名称
    * @param {string} info 鼠标放上去显示的内容
    * @param {bool} active 是否处于激活状态
    * @param {bool} changeActive 是否能修改激活状态
    * */
    constructor({ icon, name = '', info = '', active, activeChange = true }) {
        this.icon = icon;
        this.info = info || name;
        this.active = active;
        this.activeChange = activeChange;

        this.createElement();
        this.addEvent();
    }

    createElement() {
        this.elem = document.createElement('span');
        this.elem.classList.add('icon-btn-roc');
        this.elem.style.width = this.config.width + 'px';
        this.elem.style.height = this.config.height + 'px';
        this.elem.style.backgroundImage = `url(${this.icon})`;

        this.elem.setAttribute('title', this.info);

        this.changeActive(this.active);
    }

    addEvent() {
        this.elem.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                this.elem.classList.add('mouseDown-roc');
            }
        }, false);
        this.elem.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                this.elem.classList.remove('mouseDown-roc');
            }
        }, false);

        // 判断是否要添加点击事件来修改按钮的 active 样式。有些插件不需要点击修改样式，比如 HideSelectedNodes 插件
        if (this.activeChange) {
            // 添加点击事件修改 active 样式
            this.elem.addEventListener('click', () => {
                this.changeActive(!this.active);
            }, false);
        }
    }

    changeActive(bool) {
        this.active = bool;
        if (this.active) {
            this.elem.classList.add('active-roc');
        } else {
            this.elem.classList.remove('active-roc');
        }
    }

    changeIcon(btn) {
        this.elem.style.backgroundImage = `url(${btn.icon})`;
        this.elem.setAttribute('title', btn.info);
    }

    onClick(cb) {
        this.elem.addEventListener('click', cb, false);
    }
}
