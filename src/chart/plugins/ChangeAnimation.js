import Base from '../core/plugin/Base';

import icon from '../images/pluginIcon/disableAnimation.svg';

export default class ChangeAnimation extends Base {
    static pluginName = 'changeAnimation';

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
            name: '关闭动画',
            info: '关闭动画',
            active: !this.$chart.config.animation
        });
    }

    onClick() {
        if (this.btn.active) {
            this.$chart.setConfig({ animation: false });
        } else {
            this.$chart.setConfig({ animation: true });
        }
    }
}
