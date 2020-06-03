
import Base from '../../core/chart/Base';
import layout from './layout';
import chartConfig from './config';

import icon from '../../images/chartIcon/circleRound.svg';

export default class Circle extends Base {
    static chartName = 'circleRound';
    static chartZhName = '圈层图';
    static icon = icon;

    compute() {
        let { nodes, links } = this.$store;
        const center = this.$scene.getCenter();
        const info = {
            center,
            size: chartConfig
        };
        layout({ nodes, links }, info);
    }

}
