import Base from '../core/plugin/Base';

import icon from '../images/pluginIcon/saveImg.svg';

export default class SaveImg extends Base {
    static pluginName = 'saveImg';

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
            name: '保存图片',
            info: '保存图片',
            activeChange: false
        });
    }

    onClick() {
        this.$chart.util.saveImg((base64) => {
            // console.log(base64)
        });
    }
}
