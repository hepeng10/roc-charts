# 图谱数据 - data
data 是传入 roc-charts 的用于绘制节点和连线的数据，包括 nodes 和 links 两个数组对象，nodes 数组里的每一个对象是一个节点，links 数组里的每一个对象是一条连线，他们都有一些可选属性，具体属性如下：
:::tip
除了说明必选的都为可选属性
:::
```js
import Chart from 'roc-charts';

const data = {
    nodes: [
        {
            id: 'xxx',  // 节点的 id (必选)
            name: '节点名称',  // 图谱中显示在节点下面的文字
            extend: false, // 节点是否可扩展。隐藏节点相关功能，为 true 时右上角显示可扩展+号图标
            selected: false,  // 是否处于选中状态。选中时会显示边框
            degree: 0,  // 节点度数，主要用于层级类图
            style: {  // 节点样式
                image: icon,  // 节点图标 dataURI
                hide: false,  // 是否隐藏节点
                size: 'small|normal|large',  // 节点的大小，默认为 normal
                // 节点的半径，优先级高于 size
                r: 30,
                // 其它 zrender 的样式，详见：https://ecomfe.github.io/zrender-doc/public/api.html#zrenderdisplayable 表格里的 opts.style
                ...otherZrenderStyle
            },
            subImage: {  // 环绕节点的图标
                r: 6,  // 半径，默认大小和 extend 图标相同
                hide: false,  // 设置为 true 则不绘制 subImage
                images: [{  // 图标为数组，可显示多个
                    image: subIcon,  // 图标 dataURI
                    hide: false,  // 设置为 true 则不绘制此图标
                }]
            },
            // 其它属性，主要是一些图算法需要用到，比如圈层图中心节点需要设置 target: true
            ...otherAttr
        }
    ],
    links: [
        {
            from: 'id1',  // 起始 node 节点 id（必选）
            to: 'id2',  // 目标 node 节点 id （必选）
            text: 'xxx',  // 线上的文字
            directionless: false,  // 是否为无向线（没有箭头的直线）
            style: {
                dashed: false,  // 是否为虚线，默认为 false
                // 其它 zrender 的样式，详见：https://ecomfe.github.io/zrender-doc/public/api.html#zrenderdisplayable 表格里的 opts.style
                ...otherZrenderStyle
            }
        }
    ]
};

// 使用 data
const chart  = new Chart({
    id: 'domID',
    type: 'chartType',
    data  // 这里传入 data
});

chart.init(config);  // 调用 chart 对象的 init 方法绘图。config 为图谱的配置，详见图谱配置。
```
