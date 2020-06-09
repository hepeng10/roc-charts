import zr from 'zrender';
import gof from 'get-object-field';

import Base from '../Base';
import Draw from './Draw';

import { nodeConfig } from '../../config/config';
import { isMobile } from '../../utils/mobile';

export default class Painter extends Base {
    draw;
    group = {
        nodes: null,
        links: null
    };

    init() {
        this.initDraw();
        this.initNodeGroup();
        this.initLinkGroup();
        this.initEvent();
    }
    initDraw() {
        this.draw = new Draw(this.$chart);
        this.draw.init();
    }
    initNodeGroup() {
        this.group.nodes = new zr.Group();
    }
    initLinkGroup() {
        this.group.links = new zr.Group();
    }
    initEvent() {
        this.preventTouch();
    }

    // scene 拖动缩放的时候，画笔也要跟着移动缩放
    move(offsetX, offsetY) {
        for (let k in this.group) {
            const g = this.group[k];
            const pos = g.position;
            g.attr('position', [pos[0] + offsetX, pos[1] + offsetY]);
        }
    }
    // isDebounce 为 true 的时候，则缩放时重绘功能会添加防抖。主要用于当图谱过大时，进行缩放的时候减少重绘次数，提高性能
    scale(scale, isDebounce = false) {
        for (let k in this.group) {
            this.group[k].attr('scale', [scale, scale]);
        }
        isDebounce ? this.draw.debounceDraw() : this.draw.draw();
    }
    rotation(angle = 0) {
        const radian = Math.PI / 180 * angle;
        for (let k in this.group) {
            this.group[k].attr('rotation', radian);
        }
    }

    // 动画。将坐标从 prePosition 移动到 position
    animate() {
        this.group.nodes.children().forEach((nodeElement) => {
            nodeElement.animateTo({
                position: nodeElement.source.position
            }, () => {
                // 动画完成后 prePosition 设置为 position
                nodeElement.source.prePosition = nodeElement.source.position;
            });
        });
    }
    // 移动端阻止默认触摸事件
    preventTouch() {
        if (isMobile) {
            const dom = document.getElementById(this.$chart.domID);
            dom.addEventListener('touchdown', (e) => {
                e.preventDefault();
            }, false);
            dom.addEventListener('touchmove', (e) => {
                e.preventDefault();
            }, false);
            dom.addEventListener('touchup', (e) => {
                e.preventDefault();
            }, false);
        }
    }

    removeLinks() {
        this.group.links.removeAll();
    }
    addLinks() {
        this.draw.drawLinks(this.$store.linksKV);
        this.$zr.add(this.group.links);
    }
    refreshLinks() {
        this.removeLinks();
        this.addLinks();
    }

    // 高亮某个节点
    highlightNode(node) {
        node.style.opacity = 1;
    }
    // 淡化某个节点
    fadeNode(node) {
        node.style.opacity = nodeConfig.fadeOpacity;
    }
    // 隐藏某个节点
    hideNode(node) {
        node.style.hide = true;
    }
    hideNodes(nodesId = []) {
        nodesId.forEach((id) => {
            const node = this.$store.nodesKV[id];
            if (node) {
                this.hideNode(node);
            }
        });
        this.setNodesExtend();
    }
    // 显示与某个节点有关系的点
    showRelationNodes(id, deep = false) {
        const node = this.$store.nodesKV[id];
        const nodesId = this.getRelationNodes(node, deep);
        this.showNodes(nodesId);
    }
    showNodes(nodesId = []) {
        nodesId.forEach((id) => {
            const node = this.$store.nodesKV[id];
            if (node) {
                this.showNode(node);
            }
        });
        this.setNodesExtend();
    }
    showNode(node) {
        node.style.hide = false;
    }
    // 设置节点的 extend 属性，主要用户节点隐藏显示功能
    setNodesExtend() {
        const { nodes } = this.$store;
        nodes.forEach((node) => {
            const parents = gof(node, {})('parentsKV')();
            const children = gof(node, {})('childrenKV')();
            let extend = false;
            for (let k in parents) {
                if (gof(parents[k])('style')('hide')()) {
                    node.extend = true;
                    extend = true;
                }
            }
            for (let k in children) {
                if (gof(children[k])('style')('hide')()) {
                    node.extend = true;
                    extend = true;
                }
            }
            if (!extend) {
                node.extend = false;
            }
        });
    }
    // 删除节点
    deleteNode(node) {
        const originStore = this.$chart.getOriginStore();
        const { nodes, links } = originStore;
        nodes.forEach((n, i) => {
            if (n.id === node.id) {
                nodes.splice(i, 1);
            }
        });
        for (let i = 0; i < links.length; i++) {
            const l = links[i];
            if (l.from === node.id || l.to === node.id) {
                links.splice(i, 1);
                i--;
            }
        }
        this.$chart.setOriginStore(originStore);
        this.$chart.setStore({ nodes, links });
        this.$chart.changeChart(this.$chart.chartType);
    }
    deleteNodes(nodesId = []) {
        nodesId.forEach((id) => {
            const node = this.$store.nodesKV[id];
            if (node) {
                this.deleteNode(node);
            }
        });
    }
    // 高亮接收的 nodesId 数组中的所有节点
    highlightNodes(nodesId = []) {
        this._fadeAllNodes();
        nodesId.forEach((id) => {
            const node = this.$store.nodesKV[id];
            if (node) {
                this.highlightNode(node);
            }
        });
    }

    _highlightAll() {
        this.$store.nodes.forEach((node) => {
            this.highlightNode(node);
        });
    }
    // 所有节点都高亮
    highlightAll() {
        this._highlightAll();
        this._deleteLinksOpacity();
    }

    // 给节点添加边框，比如做节点选中效果等
    selectedNode(node) {
        node.selected = true;
    }
    // 给节点添加边框实现选中状态。type 支持 circle 和 rect
    select(nodesId = []) {
        nodesId.forEach((id) => {
            const node = this.$store.nodesKV[id];
            if (node) {
                this.selectedNode(node);
            }
        });
    }
    removeSelect(nodesId = []) {
        nodesId.forEach((id) => {
            const node = this.$store.nodesKV[id];
            if (node) {
                this.clearNodeSelected(node);
            }
        });
    }
    clearNodeSelected(node) {
        node.selected = false;
    }
    clearAllSelected() {
        this.$store.nodes.forEach((node) => {
            this.clearNodeSelected(node);
        });
    }

    // 高亮多条线
    highlightLinks(linksId) {
        this.fadeAllLinks();
        linksId.forEach((id) => {
            const link = this.$store.linksKV[id];
            if (link) {
                this.highlightLink(link);
            }
        });
    }
    // 淡化所有线
    fadeAllLinks() {
        this.$store.links.forEach((link) => {
            this.fadeLink(link);
        });
    }
    // 高亮某条线
    highlightLink(link) {
        link.style.opacity = 1;
    }
    // 淡化某条线
    fadeLink(link) {
        link.style.opacity = nodeConfig.fadeOpacity;
    }
    // 删除 links 的 opacity 属性，links 的 opacity 就根据 node 来决定
    _deleteLinksOpacity() {
        this.$store.links.forEach((link) => {
            delete link.style.opacity;
        });
    }

    // 递归获取所有 parents nodesId
    getParentsNodesId(node, deep = true) {
        // 这里不能简单的使用递归来拿所有的 parentsId，会导致有循环引用的时候栈溢出
        // 应该在递归的时候，每次递归把 parentsId 保存到一个全量数组中，如果这个 parentId 已存在，则说明已经探寻过了，则不再对这个 parentId 进行递归
        let parentsNodes = [];
        const getParents = (node) => {
            if (node.parents && node.parents.length > 0) {
                node.parents.forEach((nodeId) => {
                    if (!parentsNodes.includes(nodeId)) {
                        parentsNodes.push(nodeId);
                        if (deep) {
                            getParents(this.$store.nodesKV[nodeId]);
                        }
                    }
                });
            }
        };
        getParents(node);

        return parentsNodes;
    }
    // 递归获取所有 children nodesId
    getChildrenNodesId(node, deep = true) {
        let childrenNodes = [];
        const getchildren = (node) => {
            if (node.children && node.children.length > 0) {
                node.children.forEach((nodeId) => {
                    if (!childrenNodes.includes(nodeId)) {
                        childrenNodes.push(nodeId);
                        if (deep) {
                            getchildren(this.$store.nodesKV[nodeId]);
                        }
                    }
                });
            }
        };
        getchildren(node);

        return childrenNodes;
    }

    // 获取与 node 有关系的节点 id 列表
    getRelationNodes(node, deep = true) {
        const nodes = [];  // 所有与 node 有关联的节点 id 数组
        nodes.push(node.id);

        const parentsNodes = this.getParentsNodesId(node, deep);
        const childrenNodes = this.getChildrenNodesId(node, deep);
        return nodes.concat(parentsNodes, childrenNodes);
    }
    // 淡化所有 node
    _fadeAllNodes() {
        this.$store.nodes.forEach((node) => {
            this.fadeNode(node);
        });
    }

    // 接收要高亮的 node id，将与此 node 有连线的 node 都高亮
    relationHighlight(id, deep = true) {
        const node = this.$store.nodesKV[id];
        const nodesId = this.getRelationNodes(node, deep);
        this.highlightNodes(nodesId);
        return nodesId;
    }
    // 获取目标节点
    getTargetNode() {
        let targetNode = null;
        this.$store.nodes.forEach((node) => {
            if (node.target) {
                targetNode = node;
            }
        });
        return targetNode;
    }
    // 目标节点指出去的节点高亮
    fromTargetHighlight() {
        const targetNode = this.getTargetNode();
        let nodesId = [];
        if (targetNode) {
            const toNodesId = this.getChildrenNodesId(targetNode);
            nodesId = [...toNodesId, targetNode.id];
            this.highlightNodes(nodesId);
        } else {
            throw new Error('target node not found');
        }
        return nodesId;
    }

    // 指向目标节点的节点高亮
    toTargetHighlight() {
        const targetNode = this.getTargetNode();
        let nodesId = [];
        if (targetNode) {
            const fromNodesId = this.getParentsNodesId(targetNode);
            nodesId = [...fromNodesId, targetNode.id];
            this.highlightNodes(nodesId);
        } else {
            throw new Error('target node not found');
        }
        return nodesId;
    }

    // 清除所有元素
    clearElement() {
        for (let k in this.group) {
            this.group[k].removeAll();
        }
    }
}
