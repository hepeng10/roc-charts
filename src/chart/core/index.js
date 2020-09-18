import zrender from 'zrender';
import gof from 'get-object-field';
import { merge } from 'lodash';

import '../styles/common.less';

import * as globalConfig from '../config/config'

import Event from './event';
import Scene from './scene';
import Painter from './painter';

import Chart from './chart';
import charts from './chart/charts';
import Plugin from './plugin';
import plugins from './plugin/plugins';

import Util from './util';

class Core {
    zr;
    globalConfig;
    config;
    domID;

    originStore = {};  // 原始的 nodes 和 links，没有添加 children 等这些框架附加的属性
    store = {};  // 切勿随便给 store 直接赋值，这样做会切断引用，painter，charts 里就不能得到新的 store 了。通过 setStore 来修改 store

    scene;
    painter;
    event;
    util;

    chartType;
    chart;

    plugin;

    loadingDom;

    selectedNodes = [];

    // 修改全局配置
    static changeConfig(config) {
        merge(globalConfig.sceneConfig, config.scene);
        merge(globalConfig.nodeConfig, config.node);
        merge(globalConfig.linkConfig, config.link);
        merge(globalConfig.textConfig, config.text);
    }

    static registerChart(chartClass) {
        if (chartClass.chartName) {
            Chart.register(chartClass);
        } else {
            throw new Error('图谱需要设置静态属性 chartName');
        }
    }

    static registerPlugin(pluginClass) {
        if (pluginClass.pluginName) {
            Plugin.register(pluginClass);
        } else {
            throw new Error('插件需要设置静态属性 pluginName');
        }
    }

    // 初始化 scene, painter, store
    // data 包括 nodes 和 links
    constructor({ id, type, data = {} }) {
        if (!gof(data)('nodes')('length')()) {
            console.log('数据为空');
            return;
        }

        this.domID = id;
        this.chartType = type;
        this.store = data;
    }

    init({ core = {}, chart = {}, plugin } = {}) {
        // 默认配置项
        let defaultConfig = {
            showExtend: true,  // 显示扩展标识
            animation: true,  // 开启动画
            initStore: true,  // 是否要初始化 store，通常传入的 data 是简单数据，只有 nodes 和 links，如果传入的 data 就是已经初始化后的数据结构，则不需要再初始化
            // scale: 1,
            dynamicLineWidth: true,  // 线的粗细随缩放率变化
            initPlugin: true,
        };
        this.config = {
            ...defaultConfig,
            ...core
        };

        this._init(chart, plugin);
    }

    _init(chartConfig, pluginConfig) {
        this._initZr(this.domID);
        this._initLoading(this.domID);

        this.scene = new Scene(this);
        this.painter = new Painter(this);
        this.event = new Event(this);
        this.util = new Util(this);

        this.scene.init();

        this._initStore();  // store 依赖场景的中心坐标，所以要先 init scene

        this.painter.init();  // painter 依赖 store

        this._initChart(chartConfig);

        this._lifeCircle();
        this._setConfig();

        this._initPlugins(pluginConfig);
    }

    _initZr(id) {
        const dom = document.getElementById(id);
        // 用户没设置 position 则赋值为 relative。因为插件工具根据 dom 定位，所以 dom 的 position 不能为 static
        if (window.getComputedStyle(dom).position === 'static') {
            dom.style.position = 'relative';
        }
        this.zr = zrender.init(dom);
        dom.addEventListener('mousewheel', (e) => {
            e.preventDefault();
        });
    }

    _initLoading(id) {
        const dom = document.getElementById(id);

        let loadingDom = document.createElement('div');
        loadingDom.classList.add('chartLoading-roc');
        loadingDom.innerHTML = '<div class="chartDot1-roc"></div><div class="chartDot2-roc"></div>';
        dom.appendChild(loadingDom);

        this.loadingDom = loadingDom;
    }

    // 接收的 data 包括 nodes 和 links，以及其他可能的数据
    _initStore() {
        if (this.config.initStore) {
            // 深拷贝一份 data 作为 originStore
            this.originStore = JSON.parse(JSON.stringify(this.store));
            // 强化 store
            const enhancer = this.enhancerNodesLinks(this.store.nodes, this.store.links);
            for (let k in enhancer) {
                this.store[k] = enhancer[k];
            }
        } else {
            this.originStore = this.store;
        }
    }

    _initChart(chartConfig) {
        this.chart = new Chart(this);
        this.chart.init(this.chartType, chartConfig);
    }

    _lifeCircle() {
        this.ready();
        if (this.config.initStore) {
            this.compute();
        }
        this.render();
    }

    // 某些配置项需要在 Chart 中进行操作生效
    _setConfig() {
        // 设置缩放
        if (this.config.scale) {
            this.setScale(this.config.scale);
        }
    }

    // 添加插件
    _initPlugins(pluginConfig) {
        if (this.config.initPlugin) {
            this.plugin = new Plugin(this);
            this.plugin.initPlugins(pluginConfig);
        }
    }

    showLoading() {
        this.loadingDom.style.display = 'block';
    }
    hideLoading() {
        this.loadingDom.style.display = 'none';
    }

    // 强化 nodes 和 links 的数据结构。返回 { nodesKV, nodesDegree, linksKV }
    enhancerNodesLinks(nodes = [], links = []) {
        const center = this.scene.getCenter();

        let nodesKV = {};
        let nodesDegree = {};

        nodes.forEach((node) => {
            node.category = 'node';
            // 添加 style 属性
            node.style = {
                opacity: 1,
                ...node.style
            };

            // 添加 position 属性
            if (node.position) {
                node.prePosition = node.position;
            } else {
                node.prePosition = [center[0], center[1]];
                node.position = [center[0], center[1]];
            }
            // 添加进 nodesKV
            nodesKV[node.id] = node;
            // 添加进 nodesDegree
            const degree = node.degree === undefined ? 1 : node.degree;
            if (!nodesDegree[degree]) {
                nodesDegree[degree] = [];
            }
            nodesDegree[degree].push(node);
        });

        let linksKV  = {};
        // 通过遍历 links，给 nodes 添加 children
        links.forEach((link) => {
            link.category = 'link';
            // 添加 style 属性
            link.style = {
                ...link.style
            };

            const fromNode = nodesKV[link.from];
            const toNode = nodesKV[link.to];

            // 初始化 children 和 childrenKV
            if (!fromNode || !toNode) {
                console.log('存在没有节点的线', link);
                return;
            }
            if (!fromNode.children) {
                fromNode.children = [];
            }
            if (!fromNode.childrenKV) {
                fromNode.childrenKV = {};
            }
            // 添加 children 和 childrenKV
            if (!fromNode.children.includes(link.to)) {
                fromNode.children.push(link.to);
            }
            fromNode.childrenKV[link.to] = toNode;

            // 初始化 parents 和 parentsKV
            if (!toNode.parents) {
                toNode.parents = [];
            }
            if (!toNode.parentsKV) {
                toNode.parentsKV = {};
            }
            // 添加 parents 和 parentsKV
            if (!toNode.parents.includes(link.from)) {
                toNode.parents.push(link.from);
            }
            toNode.parentsKV[link.from] = fromNode;

            if (link.directionless) {
                linksKV[`${link.from}->${link.to}->directionless`] = {
                    fromNode,
                    toNode,
                    ...link
                };
            } else {
                linksKV[`${link.from}->${link.to}`] = {
                    fromNode,
                    toNode,
                    ...link
                };
            }
        });

        return { nodesKV, nodesDegree, linksKV };
    }

    // 绑定事件。cb 中可通过接收的参数来判断点击到的是啥子
    addEventListener(eventName, cb) {
        this.event.add(eventName, cb);
    }
    /**
     * 扩展方法
     * @param {string} nodeId 扩展点击的节点的 id
     * @param {array} nodes 扩展出的 nodes
     * @param {array} links 扩展出的 links
    **/
    extend(nodeId, nodes = [], links = []) {
        const node = this.store.nodes.find(node => node.id === nodeId);
        // 扩展出来的 node 可能在已有的 store 中，需要清理
        for (let i = 0; i < nodes.length; i++) {
            for (let j = 0; j < this.store.nodes.length; j++) {
                if (nodes[i].id === this.store.nodes[j].id) {
                    nodes.splice(i, 1);
                    i--;
                    break;
                }
            }
        }

        node.extend = false;

        // 将坐标设置为扩展点的坐标，动画的时候就能从扩展点坐标开始
        nodes.forEach((item) => {
            item.prePosition = node.position;
            item.position = node.position;
        });

        nodes = this.store.nodes.concat(nodes);
        links = this.store.links.concat(links);
        this.setStore({ nodes, links });

        this.compute();
        this.render();
    }

    getOriginStore() {
        return JSON.parse(JSON.stringify(this.originStore));
    }
    setOriginStore(originStore) {
        this.originStore = JSON.parse(JSON.stringify(originStore));
    }
    getStore() {
        return this.store;
    }
    // 接收新的 data
    // 当传入的 data 为强化后的 data 时，则第二个参数传 false。不再强化
    setStore(data, enhancer = true) {
        this.store = data;
        if (enhancer) {
            this._initStore(data);
        }
    }

    getScale() {
        return this.scene.getScale();
    }
    // 修改缩放比例
    setScale(scale = 1) {
        this.config.scale = scale;
        this.scene.setScale(this.config.scale);
        // 缩放后需要移动到画布中心
        const w = this.getWidth();
        const h = this.getHeight();
        const centerOffsetX = w / 2 * (this.config.scale - 1);
        const centerOffsetY = h / 2 * (this.config.scale - 1);
        this.move(-centerOffsetX, -centerOffsetY);
    }

    getCharts() {
        return charts;
    }
    getPlugins() {
        return plugins;
    }

    setConfig(config) {
        this.config = {
            ...this.config,
            ...config
        };
    }

    // 修改 chart 类型，切换图布局样式
    changeChart(type, config = {}, chartConfig = {}) {
        this.chartType = type;
        this.config = {
            ...this.config,
            ...config
        };
        const newChartConfig = {
            ...this.chart.config,
            ...chartConfig
        };

        this.scene.move(-this.scene.offsetX, -this.scene.offsetY);  // 移动到左上角原点
        this.setScale(this.config.scale);  // 调用 setScale 移动到画布中心

        this.chart.chart.destroy();

        this._initChart(newChartConfig);
        this._lifeCircle();
    }

    getWidth() {
        return this.scene.getWidth();
    }
    getHeight() {
        return this.scene.getHeight();
    }

    move(x, y) {
        this.scene.move(x, y);
    }

    // 生命周期
    ready() {
        this.chart.chart.ready();
    }
    compute() {
        this.chart.chart.compute();
    }
    // 可以通过传入 data 进行绘图，但是不建议，不传 data 就通过 store 来绘图
    render(data) {
        this.draw(data);
        this.chart.chart.rendered();
    }
    draw(data) {
        this.painter.draw.draw(data);
    }

    refresh() {
        this.draw();
    }

    // 复位功能
    reset() {
        this.changeChart(this.chartType);
    }

    clear() {
        this.zr.clear();
    }

    destroy() {
        this.chart && this.chart.chart && this.chart.destroy();
        this.scene = null;
        this.painter = null;
        this.chartType = null;
        this.chart = null;
        this.store = null;
        this.event = null;
        this.zr && this.zr.dispose();
    }

    resize() {
        this.zr.resize();
        this.painter.draw.drawWatermark();
    }
}

export default Core;
