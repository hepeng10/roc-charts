import gof from 'get-object-field';
import plugins from './plugins';

import IconBtn from '../../component/IconBtn';
import IconSelect from '../../component/IconSelect';

export default class Base {
    static pluginName = '';

    $chart;

    boxID;
    dependLoaded = true;  // 依赖是否都成功加载

    constructor(chart, boxID) {
        this.$chart = chart;

        this.boxID = boxID;

        this.setConfig();
        this.newDependency();
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
        return gof(this.$plugin.config, {})(this.constructor.pluginName)();
    }

    init() {
        // 入口方法
    }

    setConfig() {
        // 修改插件自身的配置
        const selfConfig = gof(this.$plugin.config, {})(this.constructor.pluginName)();
        const defaultConfig = this.defaultConfig();
        this.$plugin.config[this.constructor.pluginName] = { ...defaultConfig, ...selfConfig };
    }

    // 插件默认配置。每个插件的配置必须是个对象。
    defaultConfig() {
        return {};
    }

    // 依赖的插件
    depend() {
        return [
            // 'nodeClick'  返回依赖插件名数组
        ];
    }
    // 实例化依赖的插件
    newDependency() {
        const dependList = this.depend();
        dependList.forEach(pluginName => {
            // 判断依赖的插件是否实例化，没有实例化则实例化依赖插件
            if (!this.$plugin.plugins[pluginName]) {
                if (plugins[pluginName]) {
                    if (gof(this.$plugin.config, [])('common')('disable')().includes(pluginName)) {
                        this.dependLoaded = false;
                        console.log(`依赖的插件 ${pluginName} 被配置为 disable，插件 ${this.constructor.pluginName} 可能无法使用`);
                        return;
                    }
                    // 实例化依赖的插件
                    const instance = new plugins[pluginName](this.$chart, this.$chart.domID, this.$plugin.config);
                    instance.init();
                } else {
                    this.dependLoaded = false;
                    console.log(`未发现依赖插件：${pluginName}，插件 ${this.constructor.pluginName} 可能无法使用`);
                }
            }
        });
    }

    onClick() {
        // 工具栏插件点击事件
        // 统一放在这个方法中可以提供出来方便调用。比如工具栏隐藏了但又想调用这个插件的功能。
    }

    createButton({ icon, name, info, active, activeChange }) {
        const toolbar = document.getElementById(this.boxID);
        const iconBtn = new IconBtn({ icon, name, info, active, activeChange });
        toolbar.appendChild(iconBtn.elem);
        return iconBtn;
    }

    // [{ icon, value: 'xxx', label: 'yyy', selected: true }]
    createSelect(optionsArr) {
        const toolbar = document.getElementById(this.boxID);
        const iconSelect = new IconSelect(optionsArr);
        toolbar.appendChild(iconSelect.elem);
        return iconSelect;
    }
}
