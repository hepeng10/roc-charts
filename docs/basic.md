# 基本使用
### 基本用法
src/containers/Test/test.jsx 文件有基本的用法。

可下载项目，安装依赖后（推荐使用 yarn 安装），运行 yarn start 查看效果。

### 安装 roc-charts:
yarn add roc-charts  
```js
import Chart from 'roc-charts;
```
或者下载项目，拷贝出 src/chart 目录到自己的项目中使用相对路径引入
```js
import Chart from './chart';  // 本地引入
```
**Chart 的使用**
```js
const chart = new Chart({
    id: 'chart',  // 绘制图谱 dom 的 id
    type: 'force',  // 图谱类型
    data: chartData,  // 图谱数据
});
chart.init(config);  // 调用 init 方法绘图，配置项可选
```

### 基本参数说明
图谱接收的 data 数据为一个对象，包括 nodes（节点） 和 links（节点之间的连线） 两个数组
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
            text: 'yyy',  // 线上的文字（可选）
        }
        ...
    ]
}
```
将包含 nodes 和 links 的对象传入 data 中就能绘图了。
