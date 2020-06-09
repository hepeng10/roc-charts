import gof from 'get-object-field';
import layout from './layout';
import { linkConfig } from '../../config/config';
import { event, getClientXY, isScale } from '../../utils/mobile';

import Base from '../../core/chart/Base';
import ForceConfig from './config';

import icon from '../../images/chartIcon/force.svg';

// 继承 Base 才能响应 store 的更新和通过 setStore 修改 store
export default class Force extends Base {
    static chartName = 'force';
    static chartZhName = '力导图';
    static icon = icon;

    force = null;
    bindOnDrag = false;
    optimizeLinks = false;
    count = 0;
    tickCount = 0;

    mousedown;
    mousemove;
    mouseup;

    get animation() {
        return this.$chart.config.animation;
    }

    get nodeDrag() {
        return gof(this.$chart.plugin.config)('nodeDrag')('drag')();
    }

    set nodeDrag(bool) {
        this.$chart.plugin.config.nodeDrag.drag = bool;
    }

    defaultConfig() {
        return {
            tickCount: 200,
            preventCompute: false
        }
    }

    calcPosition() {
        let { nodes, links } = this.$store;

        links.forEach(item => {
            item.source = item.from;
            item.target = item.to;
        });

        this.setForce(nodes, links);

        // 当 links 大于100条时，拖拽时移除线，优化性能
        this.optimizeLinks = links && links.length > linkConfig.optimize;

        this.onTick();
        this.onTickEnd();
    }

    setForce(nodes, links) {
        const width = this.$scene.getWidth();
        const height = this.$scene.getHeight();

        this.force = layout(nodes, links, {
            center: [width / 2, height / 2],  // 设置画布中心为重心
            interval: ForceConfig.interval,
            strength: ForceConfig.strength,
            distance: ForceConfig.distance,
            distanceMax: ForceConfig.distanceMax,
        });
    }

    onTick() {
        let { nodes } = this.$store;
        this.force.on('tick', () => {
            this.count++;
            if (this.animation) {
                if (nodes.length > 100) {
                    // 当节点数大于100时，偶数 count 才重绘。减少一半重绘，提高性能
                    if (!(this.count % 2)) {
                        this.reRenderNodes();
                    }
                } else {
                    this.reRenderNodes();
                }
            } else {
                this.force.stop();
                this.$chart.refresh();

                // 下面不能直接在 config.tickCount 上进行减操作，这样会导致切换到其它图谱再切换回来，config.tickCount 的值就为0了，就无法进行坐标计算了
                this.tickCount = this.config.tickCount;
                if (this.tickCount > 0) {
                    this.$chart.showLoading();
                    // 使用 setTimeout，放到事件循环中运算，避免阻塞优化性能
                    setTimeout(() => {
                        while (this.tickCount--) {
                            this.force.tick();  // 手动 tick，而不使用 d3-force 内部的 timer，速度更快
                        }
                        this.$chart.hideLoading();
                        this.reRenderNodes();
                        this.$chart.refresh();
                    }, 0);
                }
            }
        });
    }

    onTickEnd() {
        this.force.on('end', () => {
            console.log('tick end')
            this.$chart.refresh();
        });
    }

    // 将力导向算法计算的 x,y 赋值给 position
    reRenderNodes() {
        const { nodes } = this.$store;
        nodes.forEach(node => {
            // 力导向动画开启的时候，要修改 prePosition
            if (this.animation) {
                node.prePosition = [node.x, node.y];
            }
            node.position = [node.x, node.y];
        });

        if (this.optimizeLinks) {
            this.$chart.painter.draw.onlyDrawNodes();
        } else {
            this.$chart.painter.draw.draw();
        }
    }

    stop() {
        this.force && this.force.stop();
    }

    onDrag() {
        let node, x, y, xm, ym, move;

        this.mousedown = (e) => {
            if (!this.nodeDrag || !this.animation) {
                return;
            }

            if (isScale(e)) {
                return;
            }

            const source = gof(e)('target')('source')();
            if (source && source.category === 'node') {
                // 将 nodeDrag 设置为 false，阻止拖动插件
                this.nodeDrag = false;

                const xy = getClientXY(e);
                x = xy[0];
                y = xy[1];

                node = this.force.find(source.x, source.y);
                node.fx = node.x;
                node.fy = node.y;
                document.addEventListener(event.mousemove, this.mousemove, false);
                document.addEventListener(event.mouseup, this.mouseup, false);
            }
        };
        this.mousemove = (e) => {
            if (isScale(e)) {
                return;
            }

            if (!move) {
                this.force.alphaTarget(.5).restart();
            }
            move = true;

            const xy = getClientXY(e);
            xm = xy[0];
            ym = xy[1];

            const offsetX = xm - x;
            const offsetY = ym - y;
            x = xm;
            y = ym;
            // 鼠标移动距离除以缩放系数，得到节点应该移动的距离
            const nodeOffsetX = offsetX / this.$scene.scale;
            const nodeOffsetY = offsetY / this.$scene.scale;
            const newPositionX = node.x + nodeOffsetX;
            const newPositionY = node.y + nodeOffsetY;
            node.fx = newPositionX;
            node.fy = newPositionY;
            node.x = newPositionX;
            node.y = newPositionY;
        };
        this.mouseup = () => {
            this.nodeDrag = true;
            move = false;
            if (node) {
                this.force.alphaTarget(0);
                node.fx = null;
                node.fy = null;
                document.removeEventListener(event.mousemove, this.mousemove, false);
                document.removeEventListener(event.mouseup, this.mouseup, false);
            }
        };

        this.$zr.on('mousedown', this.mousedown);
    }

    compute() {
        // preventCompute 为 true 时不计算坐标，通常是在要进行图谱切换等操作时才传这个参数
        // 第一次绘制力导向图时 preventCompute 为 false，计算好坐标，此时 node 便有了 x, y 属性
        // 切换为别的图再切换回来时，preventCompute 改为 true，就直接用已有的 x, y 坐标进行渲染
        if (!this.config.preventCompute) {
            this.calcPosition();
        } else {
            this.reRenderNodes();  // 直接使用已有的x, y坐标进行渲染
        }
    }

    rendered() {
        // onDrag 只执行一次
        if (!this.bindOnDrag) {
            this.onDrag();
            this.bindOnDrag = true;
        }
    }

    destroy() {
        this.stop();
        this.force = null;
        if (this.mousedown) {
            // mousedown 存在时才 off，否则 this.$zr.off('mousedown') 会将所有的 mousedown 都 off，导致 painter 里的也被 off（zrender off 方法第二个参数为空则清空所有相应事件）
            this.$zr.off('mousedown', this.mousedown);
        }
        if (this.mouseup) {
            document.removeEventListener('mouseup', this.mouseup, false);
        }
    }
}
