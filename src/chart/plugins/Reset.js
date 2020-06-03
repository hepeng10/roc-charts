import Base from '../core/plugin/Base';

import icon from '../images/pluginIcon/reset.svg';

export default class Reset extends Base {
    static pluginName = 'reset';

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
            name: '复位图谱',
            info: '复位图谱',
            activeChange: false
        });
    }

    onClick() {
        this.$chart.reset();
    }
}
