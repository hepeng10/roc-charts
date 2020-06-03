##关系图谱展示框架

###关于此框架
此框架基于 zrender 开发，用于展示节点之间的关系。关系的呈现（图谱布局）主要还是由使用者决定，可以很简单的将自己的布局算法加入到此框架中，而框架更多的作用是实现图谱操作功能，此框架内置了一些常用功能，也提供了插件机制可开发更多功能。  

[**点击在线查看 DEMO**](https://hepeng10.github.io/RCharts-demo/#/)

###框架的使用
项目中 src/containers/Test/test.jsx 文件有基本的用法。
框架的文件位于 src/chart 目录。
可下载项目，安装依赖后，运行 npm start 查看效果

**基本用法：**
```javascript
import Chart from '../../chart';  // 引入框架


const chart = new Chart({
    id: 'chart',  // 绘制图谱 dom 的 id
    type: 'force',  // 图谱类型
    data: chartData,  // 图谱数据
});
chart.init(config);  // 调用 init 方法绘图，配置项可选
```
### 基本参数说明
1、接收的 chartData 基本数据格式
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
demo 中有相对完善的格式，请自行查看。
###文档完善中...