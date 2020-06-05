# 目录结构
```
└── src
    ├── chart  (roc-charts 根目录，所有图谱文件都在这里面)
    │   ├── charts  (各种图谱的布局算法具体实现)
    │   │   ├── annular
    │   │   ├── circle
    │   │   └── force
    │   ├── component  (封装图谱用的 DOM 组件，原生 JS 实现)
    │   │   ├── IconBtn
    │   │   └── IconSelect
    │   ├── config (图谱的一些配置)
    │   ├── core (核心代码)
    │   │   ├── chart  (图谱算法基类)
    │   │   ├── event  (事件类，订阅发布模式)
    │   │   ├── graph  (绘制各种图形的具体实现)
    │   │   ├── painter  (画笔类)
    │   │   ├── plugin  (插件基类)
    │   │   ├── scene  (场景类)
    │   │   └── util  (暴露给用户用于操作图谱的一些常用方法)
    │   ├── images
    │   │   ├── chartIcon
    │   │   └── pluginIcon
    │   ├── plugins  (插件目录，各种插件的具体实现)
    │   ├── styles  (图谱的公共样式)
    │   └── utils  (图谱用的一些工具方法)
    └── containers
        └── test  (调用图谱的 demo 文件)
```
