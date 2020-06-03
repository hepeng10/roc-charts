import charts from './charts';

export default class Chart {
    $chart;
    config;

    chart;  // 实例化的图谱

    static register(Chart) {
        charts[Chart.chartName] = Chart;
    }

    constructor($chart) {
        this.$chart = $chart;
    }

    init(type, chartConfig) {
        this.config = chartConfig;
        this.chart = new charts[type](this.$chart);
        this.chart.init();
    }
}
