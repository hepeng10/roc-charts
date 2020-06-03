import Base from '../../core/chart/Base';
import Layout from './layout';

import icon from '../../images/chartIcon/annular.svg';

export default class Annular extends Base {
    static chartName = 'annular';
    static chartZhName = '圆环图';
    static icon = icon;

    compute() {
        const { nodes, links } = this.$store;
        const layout = new Layout();
        const { positions, origin } = layout.layout(nodes, links);

        const center = this.$scene.getCenter();
        const offsetX = center[0] - origin.x;
        const offsetY = center[1] - origin.y;

        nodes.forEach((node, i) => {
            const x = positions[i].x + offsetX;
            const y = positions[i].y + offsetY;
            node.position = [x, y];
        });
        this.setStore(this.$store);
    }
}
