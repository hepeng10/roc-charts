# 自定义布局
图谱通过不同的算法将节点展现成不同的布局是核心功能。但是每个项目想要呈现的布局是千差万别的，roc-charts 不可能实现所有的布局给开发者使用，所以更好的做法是开发者根据需求自己实现布局算法，将其注册到图谱中使用。

下面就将讲解如何实现并注册自己的布局算法。
```js
// 首先要引入一个 ChartBase 基类
import Chart, { ChartBase } from 'roc-charts';

// 创建一个自定义布局类继承 ChartBase
class CustomChart extends ChartBase {
    /* 继承 ChartBase 后会拥有以下成员属性
    * 主要的：
    * $chart;  // roc-charts 实例，同 new Chart() 生成的对象实例
    * $store;  // data 生成的 store 对象。包括 nodes, links, nodesKV, linksKV, nodesDegree
    * $config;  // core 配置
    * config;  // 此布局算法配置，chart.init() 配置中传递给此布局算法
    * $util;  // $chart.util 对象
    * 
    * 次要的：通常不会用到，一些深入操作可能会使用，有兴趣可以查看源码中相关类以及力导图布局算法的实现
    * $scene;  // scene 类实例对象
    * $painter; // painter 类实例对象
    * $plugin;  // plugin 类实例对象
    * $zr;  // zrender 实例对象
    */
    
    // 必须的静态属性，图谱中会用到
    static chartName = 'customChart';  // 设置图谱的名称，初始化图谱及切换图谱使用
    // 下面两个如果不启用切换图谱插件也可以不配置
    static chartZhName = '自定义图谱';  // 设置中文名称，切换图谱插件中鼠标悬停显示
    static icon = icon;  // 设置 dataURI 图标，切换图谱插件使用
    
    // 设置默认配置，返回一个对象（非必须）
    defaultConfig() {
        return {
            interval: 20,  // 配置默认节点间距为20
        }
    }

    // ready 方法用于做一些准备工作（非必须）
    ready() {
    }
    
    // 核心方法，在此方法中计算节点坐标（必须）
    computed() {
        const { nodes, links } = this.$store;
        // 通过算法给所有的 node 设置 position 实现布局
        nodes.forEach(node => {
            ...
            node.position = [x, y];
        });
    }
    
    // 计算坐标后图谱会开始渲染，渲染完成后会调用 rendered 方法（非必须）
    rendered() {
    }
    
    // 当调用 chart.distroy() 的时候，这里的 destroy 也会调用，做一些销毁工作（非必须）
    destroy() {
    }
}

Chart.registerChart(CustomChart);

const chart = new Chart({
    id: 'xx',
    type: 'customChart',  // 上面设置的图谱名称
    data
});
```
