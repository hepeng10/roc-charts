export default class Base {
    $chart;

    constructor(chart) {
        this.$chart = chart;
    }

    get $zr() {
        return this.$chart.zr;
    }
    get $config() {
        return this.$chart.config;
    }
    get $event() {
        return this.$chart.event;
    }
    get $painter() {
        return this.$chart.painter;
    }
    get $scene() {
        return this.$chart.scene;
    }
    get $util() {
        return this.$chart.util;
    }
    get $store() {
        return this.$chart.store;
    }
}
