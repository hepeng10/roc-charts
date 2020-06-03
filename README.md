## 关于此框架
此框架基于 zrender 开发，用于展示节点之间的关系。关系的呈现（图谱布局）主要还是由使用者决定，可以很简单的将自己的布局算法加入到此框架中，而框架更多的作用是实现图谱操作功能，此框架内置了一些常用功能，也提供了插件机制可开发更多功能。  

[**点击查看在线 DEMO**](https://hepeng10.github.io/RCharts-demo/#/)

## 框架的使用
项目中 src/containers/Test/test.jsx 文件有基本的用法。
框架的文件位于 src/chart 目录。
可下载项目，安装依赖后，运行 npm start 查看效果

**基本用法：**
```javascript
import Chart from '../../chart';  // 本地引入
or
import Chart from 'roc-charts';  // 安装 npm 包引入


const chart = new Chart({
    id: 'chart',  // 绘制图谱 dom 的 id
    type: 'force',  // 图谱类型
    data: chartData,  // 图谱数据
});
chart.init(config);  // 调用 init 方法绘图，配置项可选
```
## 基本参数说明
接收的 chartData 基本数据格式
```javascript
const chartData = {
    nodes: [
        {
            id: 1,  // 节点 id
            name: 'xxx',  // 节点名称（可选）
        },
        ...
    ],
    links: [
        {
            from: 1,  // 开始节点 id
            to: 2,  // 结束节点 id
            data: {
                text: 'yyy',  // 线上的文字（可选）
            }
        }
    ]
}
```
demo 中有相对完善的格式，暂时请自行查看。

## 图谱扩展
**自定义图谱：**
```javascript
import Chart, { ChartBase } from 'roc-charts';

// 创建自己算法类，继承 ChartBase，通过 compute 方法计算坐标
class CustomChart extends ChartBase {
    // 必须的静态属性，图谱中会用到
    static chartName = 'custom';  // 设置图谱的名称
    static chartZhName = '自定义图谱';  // 设置中文名称
    static icon = icon;  // 设置 base64 图标
    
    // compute 方法中获取 store，通过算法修改 store 中 nodes 的 position 实现自定义图谱布局
    compute() {
        const { nodes } = this.$store;
        // 修改节点的 position 即可
        nodes.forEach((node, i) => {
            const x = positions[i].x;
            const y = positions[i].y;
            node.position = [x, y];
        });
    }
}
// 通过 registerChart 方法注册自定义图谱即可使用
Chart.registerChart(CustomChart);

const chart = new Chart({
    id: 'xx',
    type: 'custom',  // 上面设置的图谱名称
    data: originData
});
```


**自定义插件：**
```javascript
import Chart, { PluginBase } from 'roc-charts';

class CustomPlugin extends PluginBase {
    // 实现插件功能
    init() {
        ...
    }
}
// 注册自定义插件
Chart.registerPlugin(CustomPlugin);
```
### 文档完善中...
