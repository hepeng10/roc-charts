# 事件系统
图谱实现了一个简单的事件系统，支持的事件类型包括：click | dblclick | mousedown | mousemove | mouseup | mousewheel ，当在图谱上进行这些操作的时候就会触发相应类型的事件。
:::tip
移动端的 touchdtart, touchmove, touchend 事件也使用 mousedown, mousemove, mouseup
:::
```js
import Chart from 'roc-charts';

const chart = new Chart(...);
chart.init(...);

// 添加事件，回调函数接收一个 target 对象
chart.addEventListener('click', (target) => {
    // 通过 target.source 获取到点击的元素
    const source = target.source;
    
    if (source) {
        // 通过 category 判断元素类型
        if (source.category === 'node') {
            // 点击元素为节点，source 为这个节点对象
            console.log('node', source);
        } else if (source.category === 'link') {
            // 点击元素为线，source 为这条线对象
            console.log('link', source);
        }
    } else {
        // source 为 undefined 则点击的空白处
    }
});
```