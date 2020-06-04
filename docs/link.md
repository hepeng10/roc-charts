# link 属性
```js
const data = {
    nodes: [],
    links: [
        {
            from: 'id1',  // 起始 node 节点 id（必选）
            to: 'id2',  // 目标 node 节点 id （必选）
            text: 'xxx',  // 线上的文字
            style: {
                dashed: false,  // 是否为虚线，默认为 false
                // 其它 zrender 的样式，详见：https://ecomfe.github.io/zrender-doc/public/api.html#zrenderdisplayable 表格里的 opts.style
                ...otherZrenderStyle
            }
        }
    ]
};

```
