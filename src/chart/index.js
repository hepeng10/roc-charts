import Chart from './core';
import Base from './core/chart/Base';
import PluginBase from './core/plugin/Base';

import './charts';  // 注册图谱
import './plugins';  // 注册插件

export { Base, PluginBase };
export default Chart;

window.RCharts = Chart;
