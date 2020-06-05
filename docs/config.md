# 图谱配置 - config
调用 chart.init() 方法的时候，可接受一个 config 对象，用于配置图谱的一些功能。
其中包括 core, chart, plugin 三类配置。
* core: 图谱的固定几项核心配置。
* chart: 传递给各个实现图谱算法类的配置，如力导向图的配置
* plugin: 传递给各个插件的配置

### 详细配置如下
```js
import Chart from 'roc-charts';
const chart = new Chart({...});

chart.init({
    // 核心配置
    core: {
        watermark: {  // 水印
            image: watermarkImg,  // 水印图片 dataURI
            width: 300,
            height: 300,
        },
        animation: true,  // 是否开启动画
        showExtend: true,  // 是否显示扩展标识
        initStore: true,  // 是否要初始化 store，通常传入的 data 是简单数据，只有 nodes 和 links，如果传入的 data 就是已经初始化后的数据结构，则不需要再初始化
        scale: 1,  // 缩放比例
        dynamicLineWidth: true,  // 线的粗细是否随缩放率变化
        initPlugin: true,  // 是否启用插件，为 false 时所有插件都不会实例化
    },
    // 所有图谱布局类型的配置
    chart: {
        // 字段名是图谱类的名称：static chartName = 'force'
        // force 力导图的配置
        force: {
            tickCount: 300  // 配置力导向图的计算次数
        },
        ...  // 其它图布局配置
    },
    // 插件的配置
    plugin: {
        // 插件的公共配置
        common: {
            // 配置禁用的插件，默认为空
            disable: ['changeNodeDrag', 'nodeInfo', 'changeLineWidth'],
            // 是否显示工具栏，默认为 true
            toolbarShow: true,
        },
        
        // 单个插件的配置
        // 字段名是插件类的名称：static pluginName = 'changeChart'
        changeChart: {  // 图谱切换插件配置
            charts: ['force', 'annular'],
        },
        nodeInfo: {  // 展示节点信息插件配置
            async getNodeInfo(node) {
                return await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(randomString(150));
                    }, 1000);
                });
            }
        },
        ...  // 其它插件配置
    }
});
```