# 内置插件
插件用于扩展图谱功能，通过添加自定义操作并调用图谱提供的方法以及修改图谱 store 等操作实现。今后也会添加更多插件功能，欢迎提需求。
可以通过在配置中禁用插件功能，一些插件也有单独的配置。
### 禁用所有插件
```js
chart.init({
    core: {
        initPlugin: false
    }
});
```
### 禁用部分插件
```js
chart.init({
    plugin: {
        // 插件的公共配置
        common: {
            // 配置禁用的插件，默认为空
            disable: ['changeNodeDrag', 'nodeInfo', 'changeLineWidth'],
        }
    }
});
```
### 插件的配置
```js
chart.init({
    plugin: {
        // 与 common 配置项同级，除了 common 都是独立插件的配置。字段名为插件的名称
        changeChart: {  // 图谱切换插件配置
            charts: ['force', 'annular'],
        },
    }
});
```

:::tip
所有插件的配置都统一使用对象 {} 数据格式进行配置。  
插件配置为空对象 {}，说明此插件没有配置项。
:::

## 核心插件
核心插件的配置通常用于图谱内部的操作，一般不需要配置核心插件
```js
plugin: {
    // 点击空白处，所有节点和线高亮功能
    blankClick: {
        click: true  // 默认为 true，设为 false 则禁用。也可通过 disable 配置禁用。
    },
    // 拖拽空白处图谱移动功能
    blankDrag: {
        drag: true  // 默认为 true，设为 false 则禁用。也可通过 disable 配置禁用。
    },
    // 点击节点高亮与之相连的点功能
    nodeClick: {
        click: true,
        deep: false  // 默认为 false，设置为 true 则会深度查找
    },
    // 节点拖拽功能
    nodeDrag: {
        drag: true  // 默认为 true，设为 false 则禁用。也可通过 disable 配置禁用。
    },
    scaleOnPC: {},  // PC 端鼠标滚轮缩放功能
    scaleOnMobile: {},  // 移动端双指缩放功能
}
```
## 工具栏插件
顶部工具栏按钮相关插件
```js
plugin: {
    changeAnimation: {},  // 图谱动画是否启动插件
    changeChart: {  // 图谱切换插件
        charts: ['force']  // 配置可切换的图谱
    },
    changeLineWidth: {  // 线条宽度切换插件
        width: 1
    },
    changeNodeDrag: {},  // 节点拖拽功能是否启用插件
    fullScreen: {},  // 全屏插件
    hideSelectedNodes: {},  // 隐藏选中节点插件
    lasso: {  // 套索工具插件
        backgroundColor: 'orange',
        borderColor: 'red',
    },
    reset: {},  // 重置图谱插件
    saveImg: {},  // 保存图谱为图片的插件
    searchNode: {},  // 搜索节点插件
    shortestPath: {},  // 最短路径插件
}
```
## 其它插件
```js
plugin: {
    deleteSelectedNodes: {},  // 删除选中的节点插件
    // 鼠标悬停节点，显示信息浮动层
    nodeInfo: {
        // 节点鼠标悬停时会调用 getNodeInfo 方法，支持异步操作。
        // 接收鼠标悬停的 node 节点对象
        async getNodeInfo(node) {
            // 这里使用 Promise 来模拟异步操作，返回展示的内容
            return await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // 这里假设 node 节点上自定义了一个 info 字段来提供节点信息。
                    resolve(node.info);
                }, 1000);
            });
        },
    },
    // 右键菜单功能
    rightKey: {
        // keys 的值为数组，每一项为一个菜单按钮功能
        keys: [
            {
                name: '隐藏节点',  // 右键菜单按钮显示的文本
                /*
                * 菜单点击时调用 click 方法。接收一个 params 对象
                * @param isNode {bool} 是否为节点
                * @param target {obj}  右键点击位置的目标对象
                * @param $chart {obj} 当前图谱对象实例。同 new Chart(...) 得到的对象实例
                */
                click: ({ isNode, target, $chart }) => {
                    const node = target.source;  // 获取节点信息
                    $chart.util.hideNodes([node.id]);  // 使用 chart 的工具方法隐藏节点
                },
                // isShow 方法用于决定当前点击的右键菜单中是否显示这个按钮，这个方法需要返回一个 bool 值
                isShow({ isNode, target, $chart }) {
                    // 判断点击的是节点才显示此按钮
                    if (isNode) {
                        return true;
                    }
                }
            },
            // 另一个按钮
            {
                name: '复位',
                click({ $chart }) {
                    $chart.reset();
                },
            },
        ]
    }
}
```