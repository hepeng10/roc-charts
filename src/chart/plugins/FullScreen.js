import Base from '../core/plugin/Base';

import icon from '../images/pluginIcon/fullScreen.svg';

export default class FullScreen extends Base {
    static pluginName = 'fullScreen';

    container;
    btn;
    top = 0;

    init() {
        this.initButton();
        this.btn.onClick(() => {
            this.onClick();
        });
        this.container = document.getElementById(this.$chart.domID);
    }

    initButton() {
        this.btn = this.createButton({
            icon,
            name: '全屏',
            info: '全屏'
        });
    }

    onClick() {
        if (this.btn.active) {
            this.top = document.documentElement.scrollTop;
            document.documentElement.scrollTop = 0;
            this.container.style.position = 'fixed';
            this.container.classList.add('chartFullScreen-roc');
        } else {
            document.documentElement.scrollTop = this.top;
            this.container.style.position = 'relative';
            this.container.classList.remove('chartFullScreen-roc');
        }
        this.$chart.resize();
    }
}
