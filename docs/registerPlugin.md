# 自定义插件
插件也是 roc-charts 的一个重要功能，可以扩展对图谱的操作。roc-charts 内置了多个插件，开发者也能方便的开发自定义插件。

## 插件的属性和方法
```js
import Chart, { PluginBase } from 'roc-charts';

// 创建一个自定义插件类并继承 PluginBase 类
class CustomPlugin extends PluginBase {
    /* 通自定义布局一样，插件也拥有以下属性。而插件的开发可能更需要了解 roc-charts 的源码，可参考内置插件的代码。
    * $chart;  // roc-charts 实例，同 new Chart() 生成的对象实例
    * $store;  // data 生成的 store 对象。包括 nodes, links, nodesKV, linksKV, nodesDegree
    * $config;  // core 配置
    * config;  // 此插件配置，chart.init() 配置中传递给此插件
    * $util;  // $chart.util 对象
    * 
    * $scene;  // scene 类实例对象
    * $painter; // painter 类实例对象
    * $plugin;  // plugin 类实例对象
    * $zr;  // zrender 实例对象
    *
    * dependLoaded;  // 插件可能依赖其它插件，通过此属性判断依赖是否都成功加载
    */
    
    // 设置插件的名称，chart.init() 中的插件配置时依据此名称
    static pluginName = 'customPlugin';
    
    // 此插件默认配置，返回一个对象
    defaultConfig() {
        return {};
    }
    
    /*
    * 指定依赖的插件，在实例化此插件的时候会先实例化依赖的插件
    * 但是如果依赖的插件在 chart.init() 时被配置在 disable 中，则依赖的插件不会被实例化，但是此插件依然会实例化。
    */
    depend() {
        return [
            // 'nodeClick'  返回依赖插件名数组
        ];
    }
    
    /*
    * PluginBase 提供的创建插件工具栏 button 组件的方法
    * @param icon {dataURI} 工具栏中显示的图标
    * @param name {str} 插件的名称（可选）
    * @param info {str} 插件提示信息，鼠标悬浮展示
    * @param active {bool} 图标是否处于激活状态（可选）
    * @param activeChange {bool} 能否修改图标的激活状态。比如下载图谱的插件，点击后就不会修改激活状态（可选）
    * @return btn {obj} 返回创建的 btn 对象，可通过 btn.elem 获取到 dom 元素
    * btn.onClick(cb) 通过 onClick 添加点击事件
    */
    // createButton({ icon, name, info, active, activeChange }) {}
    
    /*
    * PluginBase 提供的创建插件工具栏 select 组件的方法
    * 参数是 options 数组对象，每一项是一个下拉按钮
    * @param icon {dataURI} 此选项的图标
    * @param value {str} 此选项的值，onChange 获取
    * @param label {str} 鼠标悬浮提示文字
    * @param selected {bool} 此选项是否处于选中状态（可选）
    * @return select {obj} 返回创建的 select 对象，可通过 select.elem 获取到 dom 元素
    * select.onChange(cb) 通过 onChange 添加事件
    */
    // createSelect([{ icon, value, label, selected }]) {}
    
    // 核心方法，在此实现插件功能
    init() {
        ...
    }
}

// 注册自定义插件
Chart.registerPlugin(CustomPlugin);
```

## 插件 Demo
### 工具栏 button 按钮 demo
```js
import Chart, { PluginBase } from 'roc-charts';
import icon from './disableDrag.svg';

export default class ChangeNodeDrag extends Base {
    static pluginName = 'changeNodeDrag';

    btn;

    // 依赖 nodeDrag 插件
    depend() {
        return ['nodeDrag'];
    }

    init() {
        // 依赖的插件未加载，自身也不创建
        if (!this.dependLoaded) {
            return;
        }

        this.initButton();
        // 添加工具栏按钮点击事件
        this.btn.onClick(() => {
            this.onClick();
        });
    }

    initButton() {
        // 创建工具栏按钮组件
        this.btn = this.createButton({
            icon,
            name: '关闭节点拖拽',
            info: '关闭节点拖拽',
            active: !this.$plugin.config.nodeDrag.drag
        });
    }

    // 建议将 button 组件插件的点击事件写到 onClick 方法中，这样可以在别的地方获取到此插件实例，然后直接调用 onClick 方法实现插件功能
    onClick() {
        // 修改 nodeDrag 插件的状态
        this.$plugin.config.nodeDrag.drag = !this.btn.active;
    }
}

Chart.registerPlugin(ChangeNodeDrag);
```

### 工具栏 select 按钮 demo
```js
import Chart, { PluginBase } from 'roc-charts';
import gof from 'get-object-field';

export default class ChangeChart extends Base {
    static pluginName = 'changeChart'

    select;

    // 默认配置
    defaultConfig() {
        return {
            charts: [],
        };
    }

    init() {
        this.initSelect();
        // 绑定 select 组件的 onChange 方法，回调函数接收 option 的 value 值
        this.select.onChange(value => {
            this.onChange(value);
        });
    }

    initSelect() {
        // 获取所有注册的图布局
        const charts = this.$chart.getCharts();

        let options = [];
        // 通过 this.config 获取本插件的配置，并构造 options 数组
        if (gof(this.config)('charts')('length')()) {
            this.config.charts.forEach((name) => {
                let selected = false;
                if (this.$chart.chartType === name) {
                    selected = true;
                }

                if (charts[name]) {
                    options.push({
                        icon: charts[name].icon,
                        value: name,
                        label: charts[name].chartZhName || charts[name].chartName,
                        selected
                    });
                }
            });
        } else {
            for (let chartName in charts) {
                options.push({
                    icon: charts[chartName].icon,
                    value: chartName,
                    label: charts[chartName].chartZhName || charts[chartName].chartName
                });
            }
        }
        // 创建 select 组件
        this.select = this.createSelect(options);
    }

    // 建议将 select 组件插件的 change 事件写到 onChange 方法中，这样可以在别的地方获取到此插件实例，然后直接调用 onChange 方法实现插件功能
    onChange(chartName) {
        try {
            this.$chart.changeChart(chartName);
        } catch (e) {
            throw new Error('切换图谱失败');
        }
    }
}

Chart.registerPlugin(ChangeChart);
```