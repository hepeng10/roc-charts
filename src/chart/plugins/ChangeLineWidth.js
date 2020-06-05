import Base from '../core/plugin/Base';
import gof from 'get-object-field';
import { linkConfig } from '../config/config';

import icon1 from '../images/pluginIcon/1px.svg';
import icon2 from '../images/pluginIcon/2px.svg';
import icon3 from '../images/pluginIcon/3px.svg';
import icon4 from '../images/pluginIcon/4px.svg';

export default class ChangeLineWidth extends Base {
    static pluginName = 'changeLineWidth';

    select;

    defaultConfig() {
        return {
            width: 1,
        };
    }

    init() {
        this.initSelect();
        this.select.onChange(value => {
            this.onChange(value);
        });
    }

    initSelect() {
        const defaultLineW = this.config.width;
        const icons = [icon1, icon2, icon3, icon4];

        let options = [];
        for (let i = 1; i <= 4; i++) {
            let selected = false;
            if (defaultLineW === i) {
                selected = true;
            }
            options.push({
                icon: icons[i - 1],
                value: i,
                label: `${i}px`,
                selected
            });
        }

        this.select = this.createSelect(options);
    }

    onChange(width) {
        linkConfig.lineWidth = width;
        this.$chart.refresh();
    }
}
