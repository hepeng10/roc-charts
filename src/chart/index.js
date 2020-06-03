import Chart from './core';
import ChartBase from './core/chart/Base';
import PluginBase from './core/plugin/Base';

import './charts';  // 注册图谱
import './plugins';  // 注册插件

export { ChartBase, PluginBase };
export default Chart;

window.RCharts = Chart;
