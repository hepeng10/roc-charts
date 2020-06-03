import './style.less';
import IconBtn from '../IconBtn';
import moreIcon from './more.svg';

export default class IconSelect {
    config = {
        height: 30
    }

    options = [];
    selectIndex = 0;

    elem;
    optionsContainerElem;

    showBtn;
    optionsBtn = [];

    cb = () => {
        // 传入的回调函数
    };

    // [{ icon, value: 'xxx', label: 'yyy', selected: true }]
    constructor(options) {
        // 创建一个容器，将组件内容放于容器中，更新组建就清空容器内容再通过新的状态创建组件，而不是通过操作 dom 细节来更新组件
        this.createContainer();
        this.init(options);
    }

    init(options) {
        this.options = options;
        this.options.forEach((option, i) => {
            if (option.selected) {
                this.selectIndex = i;
            }
        });
        this.optionsBtn = [];

        this.createElement();
        this.addEvent();
    }

    createElement() {
        this.createShowBtn();
        this.createOptionsContainer();
        this.createOptionsBtn();
    }

    createContainer() {
        this.elem = document.createElement('div');
        this.elem.classList.add('icon-select-roc');
        this.elem.style.backgroundImage = `url(${moreIcon})`;
    }

    get selectedOption() {
        return this.options[this.selectIndex];
    }

    createShowBtn() {
        this.showBtn = new IconBtn({
            icon: this.selectedOption.icon,
            info: this.selectedOption.label,
        });
        this.elem.appendChild(this.showBtn.elem);
    }

    createOptionsContainer() {
        this.optionsContainerElem = document.createElement('div');
        this.optionsContainerElem.classList.add('icon-options-container-roc');
        this.optionsContainerElem.classList.add('hide-roc');
        this.optionsContainerElem.style.top = this.showBtn.config.height + 'px';
        this.elem.appendChild(this.optionsContainerElem);
    }

    createOptionsBtn() {
        this.options.forEach((item, i) => {
            const btn = new IconBtn({
                icon: item.icon,
                info: item.label,
            });
            this.optionsBtn.push(btn);
            this.optionsContainerElem.appendChild(btn.elem);

            if (i === this.selectIndex) {
                btn.changeActive(true);
            }
        });
    }

    addEvent() {
        this.addShowBtnClick();
        this.addOptionsBtnClick();
    }
    addShowBtnClick() {
        this.showBtn.onClick(() => {
            this.changeOptionsShow(this.showBtn.active);
        });
    }
    addOptionsBtnClick() {
        // 没几个按钮就不用事件委托，直接给所有按钮绑定事件
        this.optionsBtn.forEach((btn, i) => {
            btn.onClick(() => {
                this.options.forEach((option, j) => {
                    option.selected = i === j;
                });
                this.update(this.options);

                this.cb(this.options[i].value);
            });
        });
    }

    changeOptionsShow(bool) {
        if (bool) {
            this.optionsContainerElem.classList.remove('hide-roc');
        } else {
            this.optionsContainerElem.classList.add('hide-roc');
        }
    }

    update(options) {
        this.elem.innerHTML = '';
        this.init(options);
    }

    onChange(cb) {
        this.cb = cb;
    }
}
