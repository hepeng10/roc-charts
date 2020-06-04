# node 属性
```js
const data = {
    nodes: [
        {
            id: 'xxx',  // 节点的 id (必选)
            name: '节点名称',  // 图谱中显示在节点下面的文字
            style: {  // 节点样式
                image: icon,  // 节点图标 dataURI
                hide: false,  // 是否隐藏节点，默认为 false
                size: 'small|normal|large',  // 节点的大小，默认为 normal
                // 节点的大小，优先级高于 size
                width: 50,
                height: 50,
                // 其它 zrender 的样式，详见：https://ecomfe.github.io/zrender-doc/public/api.html#zrenderdisplayable 表格里的 opts.style
                ...otherZrenderStyle
            },
            subImage: {  // 节点右上角图标
                image: subIcon,  // 图标 dataURI
                width: 10,
                height: 10
            },
            // 其它属性，主要是一些图算法需要用到，比如圈层图中心节点需要设置 target: true
            ...otherAttr
        }
    ],
    links: []
};
```
