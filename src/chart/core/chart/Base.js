import gof from 'get-object-field';

export default class Base {
    static chartName = '';  // 图的名字
    static chartZhName = '';  // 图的中文名

    $chart = null;  // Chart 对象
    $$chart;

    constructor(chart) {
        this.$chart = chart;
        this.$$chart = chart.chart;

        this.setConfig();
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
    get $plugin() {
        return this.$chart.plugin;
    }

    get config() {
        return gof(this.$$chart.config, {})(this.constructor.chartName)();
    }

    init() {
        // 一些初始化工作
    }

    setConfig() {
        const selfConfig = gof(this.$$chart.config, {})(this.constructor.chartName)();
        const defaultConfig = this.defaultConfig();
        this.$$chart.config[this.constructor.chartName] = { ...defaultConfig, ...selfConfig };
    }
    // 设置图谱默认配置，返回一个配置对象
    defaultConfig() {
        return {};
    }

    // 提供给图谱 charts 的方法，用来修改 store 并画图
    setStore(store, enhancer = false) {
        this.$chart.setStore(store, enhancer);
        this.$chart.render();
    }

    ready() {
        // compute 之前调用
    }

    compute() {
        throw new Error('请复写 compute 方法，在此进行坐标计算');
    }

    rendered() {
        // 渲染完成后调用
    }

    destroy() {
        // 销毁
    }
}
