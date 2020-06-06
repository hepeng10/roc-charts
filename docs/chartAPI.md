# 图谱 API
图谱对外暴露了一些实用的 API 以供调用操作图谱。
```js
import chart from 'roc-charts';

const chart = new Chart({...});
chart.init();

// 当我们实例化图谱后便可调用图谱的 API 用来操作图谱，如：
chart.showLoading();  // 显示图谱的 loading动画
chart.util.highlightNodes([id1, id2, id3]);  // 高亮一组节点
```

API 包括两种类型，一种是通过 chart 直接调用，一种是通过 chart.util 调用。
## chart API
通过 chart 直接调用，如：
```js
chart.showLoading();
```

|  API   | 参数 | 说明  |
|  ----  | ---- | ----  |
| showLoading | 无 | 显示图谱 loading 动画 |
| hideLoading | 无 | 隐藏图谱 loading 动画 |
| extend | (nodeId: str\|num, nodes: arr, links: arr)<br/>node: 扩展源节点的 id<br/>nodes: 添加的节点，同创建图谱 data 里的 nodes<br/>links: 添加的线，同创建图谱 data 里的 links| 扩展（添加）节点和线 |
| getStore | 无 | 获取图谱 store 数据，此数据由 data 生成 |
| getScale | 无 | 获取当前缩放率 |
| setScale | (scale: num) | 修改缩放率 |
| setConfig | (config: obj) obj 为创建图谱时 config 中的 core | 修改 core 配置 |
| changeChart | (type: str, config: obj, chartConfig: obj)<br/>type: 图谱类型<br/>config: config 中的 core 配置<br/>chartConfig: config 中的 chart 配置 | 修改图谱类型 |
| getWidth | 无 | 获取画布宽度 |
| getHeight | 无 | 获取画布高度 |
| move | (x: int, y: int) | 移动图谱 |
| addEventListener | (callback: fn) | 绑定事件，[查看详情]('/event')
| refresh | 无 | 刷新图谱。比如通过 getStore 获取 store 后，自行修改了一些节点的 position，再调用此方法实现修改节点坐标。 |
| reset | 无 | 复位图谱 |
| resize | 无 | 容器大小改变后调用修改画布大小 |
| destroy | 无 | 销毁图谱 |

## util API
通过 chart.util 调用，如：
```js
chart.util.highlightNodes([id1, id2, id3]);
```
| API | 参数 | 说明 |
| ---- | ---- | ---- |
| highlightAll | 无 | 高亮所有节点和线 |
| relationHighlight | (nodeId, deep: bool)<br/>nodeId: 节点 id<br/>deep: 是否深度查找。a->b->c 为 true 时 c 会高亮，false 时只会高亮直接相连的 b，默认为 false | 高亮与某个节点有连线的节点 |
| highlightNodes | (nodesId: arr) 节点 id 数组 | 高亮一组节点 |
| hideNodes | (nodesId: arr) 节点 id 数组 | 隐藏一组节点 |
| deleteNodes | (nodesId: arr) 节点 id 数组 | 删除一组节点（某些图谱算法删除一些关键节点后会无法绘制） |
| showRelationNodes | (nodeId, deep: bool)<br/>deep: 是否深查找 | 显示与某个节点有联系的所有节点。用于与某节点有联系的节点被隐藏后再显示的操作 |
| select | (nodesId, bgType: str)<br/>bgType 值为 circle 或 rect，默认为 circle，当节点为方形则要传 rect | 清空已选的节点，然后选中参数中的节点 |
| addSelect | 同上 | 不会清空已选节点，添加选中的节点 |
| removeSelect | (nodesId) | 移除选中节点中的部分节点 |
| getSelectedNodes | 无 | 获取所有选中节点的 id |
| highlightLinks | (linksId: arr)<br/>这里 link 的 id 是由 from 和 to 组成的`${from}->${to}` | 高亮连线 |
| fadeAllLinks | 无 | 淡化所有线，突出显示节点 |
| highlightPath | (nodesId: arr)<br/>参数是路径上所有节点的 id | 高亮一条路径的节点和连线 |
| find2PointsPath | (nodeId1, nodeId2) | 返回两点间所有路径的节点数组 |
| depthFindShortestPath | (nodeId1, nodeId2) | 深度遍历查找两点间的最短路径 |
| breadthFindShortestPath | (nodeId1, nodeId2) | 广度遍历查找两点间的最短路径（通常比深度遍历性能更好）|
| getImg | callback(dataURI) | 获取图谱图片，返回图片 dataURI |
| saveImg | callback(dataURI) 可选参数 | 下载图片
