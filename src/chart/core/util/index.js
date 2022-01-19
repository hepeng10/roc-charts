import gof from 'get-object-field';
import { saveAs } from 'file-saver';

import Base from '../Base';

import chart2img from '../../utils/chart2img';

export default class Util extends Base {
    refresh() {
        this.$chart.refresh();
    }

    // 高亮所有节点和线
    highlightAll() {
        this.$painter.highlightAll();
        this.refresh();
    }

    // 接收要高亮的 node id，将与此 node 有连线的 node 都高亮
    relationHighlight(id, deep = true) {
        const nodesId = this.$painter.relationHighlight(id, deep);
        this.refresh();
        return nodesId;
    }

    // 高亮传入的节点 id 数组
    highlightNodes(nodesId) {
        this.$painter.highlightNodes(nodesId);
        this.refresh();
    }

    // 隐藏节点 id 数组
    hideNodes(nodesId) {
        this.$painter.hideNodes(nodesId);
        this.refresh();
    }
    // 删除节点 id 数组
    deleteNodes(nodesId) {
        this.$painter.deleteNodes(nodesId);
        this.refresh();
    }

    // 显示与某个节点有联系的所有节点。用于与某节点有联系的节点被隐藏后再显示的操作
    showRelationNodes(id, deep = false) {
        this.$painter.showRelationNodes(id, deep);
        this.refresh();
    }

    // 给节点加边框。这个方法会先清空所有节点的边框
    select(nodesId) {
        this.$painter.clearAllSelected();
        this.addSelect(nodesId);
    }
    // 这个方法不会清空已有节点的边框
    addSelect(nodesId) {
        this.$painter.select(nodesId);
        this.getSelectedNodes();
        this.refresh();
    }
    // 移除选中的节点
    removeSelect(nodesId) {
        this.$painter.removeSelect(nodesId);
        this.getSelectedNodes();
        this.refresh();
    }
    // 统计添加了边框的节点id
    getSelectedNodes() {
        this.$chart.selectedNodes = [];

        const nodes = this.$store.nodes;
        nodes.forEach((node) => {
            if (node.selected) {
                this.$chart.selectedNodes.push(node.id);
            }
        });
        return this.$chart.selectedNodes;
    }

    // id 是 linksKV 的字段名（id1->id2）
    highlightLinks(linksId) {
        this.$painter.highlightLinks(linksId);
        this.refresh();
    }
    // 淡化所有线
    fadeAllLinks() {
        this.$painter.fadeAllLinks();
        this.refresh();
    }

    // 目标节点指出去的节点高亮
    fromTargetHighlight() {
        const nodesId = this.$painter.fromTargetHighlight();
        this.refresh();
        return nodesId;
    }
    // 指向目标节点的节点高亮
    toTargetHighlight() {
        const nodesId = this.$painter.toTargetHighlight();
        this.refresh();
        return nodesId;
    }

    // 高亮某条路径
    // @params path 数组，一条路径的节点 id
    highlightPath(path) {
        let pathLinks = [];
        path.forEach((node, i) => {
            if (i > 0) {
                const p1 = `${path[i - 1]}->${path[i]}`;
                const p2 = `${path[i]}->${path[i - 1]}`;
                pathLinks.push(p1, p2);
            }
        });
        this.$painter.highlightNodes(path);  // 不使用 util 的 highlightNodes 是为了减少一次 refresh
        this.highlightLinks(pathLinks);
    }

    // 寻找连接图中两点的所有路径。将图看成树进行深度遍历探寻
    find2PointsPath(sourceId, targetId) {
        const { nodesKV } = this.$store;
        let pathArr = [];  // 保存找到的所有路径

        const findPath = (sourceId, targetId, pathNodes = []) => {
            pathNodes = [...pathNodes];  // 存储当前路径的节点。拷贝一下，避免引用传递导致递归调用时相互影响。
            pathNodes.push(sourceId);
            // 找到终点，保存路径退出
            if (sourceId === targetId) {
                pathArr.push(pathNodes);
                return;
            }

            const node = nodesKV[sourceId];
            // 取出相邻的节点
            const neighborNodes = { ...gof(node, {})('childrenKV')(), ...gof(node, {})('parentsKV')() };
            for (let id in neighborNodes) {
                // 没在已探寻中的才递归探寻，避免图中的环导致循环探寻
                if (!pathNodes.includes(id)) {
                    findPath(id, targetId, pathNodes);
                }
            }
        };
        findPath(sourceId, targetId);

        // 路径长度由短到长排序
        pathArr.sort((path1, path2) => {
            return path1.length - path2.length;
        });

        return pathArr;
    }
    // 深度优先遍历查找两点间最短路径
    depthFindShortestPath(sourceId, targetId) {
        const { nodesKV } = this.$store;
        let pathArr = [];  // 已找到的最短路径

        const findPath = (sourceId, targetId, pathNodes = []) => {
            pathNodes = [...pathNodes];  // 存储当前路径的节点。拷贝一下，避免引用传递导致递归调用时相互影响。
            pathNodes.push(sourceId);
            // 找到了一条路径后，继续找的时候，路径长度大于找到的，就不必继续找了
            if (pathArr.length > 0 && pathNodes.length > pathArr.length) {
                return;
            }
            // 找到终点，保存路径退出
            if (sourceId === targetId) {
                pathArr = pathNodes;
                return;
            }

            const node = nodesKV[sourceId];
            // 取出相邻的节点
            const neighborNodes = { ...gof(node, {})('childrenKV')(), ...gof(node, {})('parentsKV')() };
            for (let id in neighborNodes) {
                // 没在已探寻中的才递归探寻，避免图中的环导致循环探寻
                if (!pathNodes.includes(id)) {
                    findPath(id, targetId, pathNodes);
                }
            }
        };
        findPath(sourceId, targetId);

        return pathArr;
    }
    // 广度优先遍历查找两点间最短路径
    breadthFindShortestPath(sourceId, targetId) {
        const { nodesKV } = this.$store;
        let visitedNodes = [];  // 出现过的节点列表
        let degreeNodes = [[sourceId]];  // 二维数组，每个数组是每一度的节点列表。0度就是起点
        let degree = 0;  // 当前查找的度数
        let index = 0;  // 当前查找的当前度数节点数组中的索引
        let nodesParent = {};  // 记录每个节点的父节点是谁。广度优先遍历，每个节点就只有一个父节点
        let pathArr = [];  // 最短路径

        visitedNodes.push(sourceId);

        outer:
        while (degreeNodes[degree][index]) {

            degreeNodes[degree + 1] = degreeNodes[degree + 1] || [];  // 初始化下一度

            const node = nodesKV[degreeNodes[degree][index]];
            const neighborNodes = [...node.children || [], ...node.parents || []];

            for (let i = 0; i < neighborNodes.length; i++) {
                const id = neighborNodes[i];
                // 如果找到了，则退出
                if (id === targetId) {
                    nodesParent[id] = degreeNodes[degree][index];  // 记录目标节点的父节点是谁
                    break outer;
                } else if (!visitedNodes.includes(id)) {  // 如果没有找到，并且这个节点没有访问过，则把它添加到下一度中
                    visitedNodes.push(id);
                    degreeNodes[degree + 1].push(id);
                    nodesParent[id] = degreeNodes[degree][index];
                }
            }

            // 如果当前节点后面还有节点，则查找后一个节点
            if (degreeNodes[degree][index + 1]) {
                index++;
            } else {
                degree++;
                index = 0;
            }
        }

        // 通过目标节点的父节点，层层追溯找到起点，得到最短路径
        let nodeId;
        nodeId = targetId;
        while (nodeId) {
            pathArr.push(nodeId);
            // 当前节点有父节点，则将 nodeId 设置为父节点的 id，继续循环查找父节点
            if (nodesParent[nodeId]) {
                nodeId = nodesParent[nodeId];
            } else {  // 没有父节点，则说明到了起点。nodeId 设为 null，退出循环
                nodeId = null;
            }
        }

        // 如果长度小于2，则说明没找到最短路径，将最短路径设置为空数组
        if (pathArr.length < 2) {
            pathArr = [];
        }

        return pathArr;
    }

    // 获取图片。图片转换成功，cb 会接收到图片的 base64 编码，失败则什么也接收不到
    getImg(cb) {
        chart2img(this.$chart, (base64) => {
            let success = base64.includes('base64');
            if (success) {
                cb(base64);
            } else {
                cb();
            }
        });
    }
    // 保存图片
    saveImg(cb) {
        this.getImg((base64) => {
            if (base64) {
                saveAs(base64, 'chart.png');  // 图片太大时，控制台会有个警告，不影响使用
            }
            if (cb) {
                cb(base64);
            }
        });
    }

}
