import styles from './test.less';
import React, { Component } from 'react';

// import Chart from 'roc-charts';
import Chart from '../../chart';

import icon1 from '@images/node/head1.svg';
import icon2 from '@images/node/head2.svg';
import icon3 from '@images/node/head3.svg';
import icon4 from '@images/node/head4.svg';
import icon5 from '@images/node/head5.svg';
import watermarkPNG from '@images/watermark.png';

import data from './graph.js';

function randomString(len) {
    len = len || parseInt(Math.random() * 5, 10) + 2;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

let count = 0;

export default class Test extends Component {
    chart1;
    chart2;

    componentDidMount() {
        const res = this.getNodesLinks(JSON.parse(JSON.stringify(data[0])));
        this.drawChart('chart1', res);
    }

    getNodesLinks(data) {
        let nodes = data.nodes;
        let links = data.links;

        nodes.forEach((node) => {
            const image = [icon1, icon2, icon3, icon4, icon5];

            node.style = {
                ...node.style,
                image: image[count % 5],
                size: node.important ? 'large' : ''
            };

            count++;
        });

        links.forEach((link) => {
            if (link.dashed) {
                link.style = {};
                link.style.dashed = true;
            }
            link.text = link.relation;
        });

        return { nodes, links };
    }

    drawChart(id, data, large) {
        if (large) {
            this.chart2 = new Chart({
                id,
                type: 'annular',
                data,
            });
            this.chart2.init({
                core: {
                    animation: false,
                    watermark: {
                        image: watermarkPNG,
                        width: 300,
                        height: 300,
                    },
                    // initPlugin: false
                },
                chart: {
                    // 传递给图谱的配置
                    force: {
                        // 对力导向图进行独立配置
                    }
                },
                plugin: {
                    common: {
                        disable: ['changeNodeDrag', 'nodeInfo', 'changeLineWidth'],
                    },
                    changeChart: {
                        charts: ['force', 'annular'],
                    },
                }
            });
        } else {
            this.chart1 = new Chart({
                id,
                type: 'force',
                data,
            });
            this.chart1.init({
                core: {
                    // animation: false,
                    watermark: {
                        image: watermarkPNG,
                        width: 300,
                        height: 300,
                    },
                    // initPlugin: false
                },
                plugin: {
                    rightKey: {
                        keys: [
                            {
                                name: '隐藏节点',
                                click: (params) => {
                                    const node = params.target.source;
                                    this.chart1.util.hideNodes([node.id]);
                                },
                                isShow(params) {
                                    if (params.isNode) {
                                        return true;
                                    }
                                }
                            },
                            {
                                name: '删除节点',
                                click: (params) => {
                                    const node = params.target.source;
                                    this.chart1.util.deleteNodes([node.id]);
                                },
                                isShow(params) {
                                    if (params.isNode) {
                                        return true;
                                    }
                                }
                            },
                            {
                                name: '复位',
                                click(params) {
                                    // params.$chart.reset();
                                    // 调用插件的方法，被调用的插件必须被实例化
                                    params.plugins.reset.onClick();
                                },
                            },
                        ]
                    },
                    nodeInfo: {
                        async getNodeInfo(node) {
                            return await new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve(randomString(150));
                                }, 1000);
                            });
                        }
                    }
                }
            });
        }
    }

    showBigChart = () => {
        const res = this.getNodesLinks(JSON.parse(JSON.stringify(data[1])));
        this.drawChart('chart2', res, true);
    };

    render() {
        return (
            <div className={styles.container}>
                <div className="container">
                    <p className={styles.title}>关系图谱 Demo</p>
                    <p className={styles.info}>此图谱框架可扩展图谱坐标算法，支持工具栏插件开发，支持移动端操作。更多功能正在完善中...</p>
                    <div className={styles.tips}>
                        <p>单击节点：高亮与此节点相关联的节点。</p>
                        <p>套索工具：圈选节点。选中的节点再次圈选为取消选择。</p>
                        <p>隐藏节点：隐藏选中的节点，快捷键 h。</p>
                        <p>删除节点：使用 Delete 键删除选中的节点，删除后不可恢复。（节点删除会重新布局，并且可能导致某些类型的图报错不能显示。如圆形图存在孤立节点就会报错。）</p>
                        <p>双击节点：恢复与其直接相连的隐藏节点。</p>
                        <p>最短路径：选中两个节点后点击，可以查找出两点间的最短路径。</p>
                        <p>搜索节点：以节点名称进行搜索并高亮显示节点。</p>
                        <p>右键：自定义右键菜单功能，可根据条件动态改变。</p>
                        <p>节点悬浮窗：鼠标放在节点上显示节点信息，支持异步请求获取信息。</p>
                        <p>保存图片：保存整张图谱，包括绘制在可见区域以外的内容。</p>
                        <p>......</p>
                    </div>
                    <br />
                    <hr />
                    <div className={styles.result}>
                        <div id="chart1" className={styles.chart}>
                            <p className={styles.noData}>暂无数据</p>
                        </div>
                        <br />
                        <br />
                        <span className={styles.btn} onClick={this.showBigChart}>展示超大节点图</span>
                        <div id="chart2" className={styles.chart} >
                            <p className={styles.noData} > 暂无数据 </p>
                        </div >
                    </div>
                </div>
            </div >
        );
    }
}
