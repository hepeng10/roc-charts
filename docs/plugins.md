# 内置插件
插件用于扩展图谱功能，通过添加自定义操作并调用图谱提供的方法以及修改图谱 store 等操作实现。
可以通过在配置中禁用插件功能，一些插件也有独立的配置。
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
### 独立插件的配置
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
## 插件说明
:::tip
所有插件的配置都统一使用对象 {} 格式进行配置。  
插件配置为空对象 {}，说明此插件没有配置项。
:::
### 核心插件
核心插件的配置通常用户图谱内部的操作，一般不需要配置核心插件
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
}
```
### 工具栏插件
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
}
```
### 其它插件
```js
plugin: {
}
```