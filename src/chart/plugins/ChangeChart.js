import Base from '../core/plugin/Base';
import gof from 'get-object-field';
import toast from '../utils/toast/toast';

export default class ChangeChart extends Base {
    static pluginName = 'changeChart'

    select;

    defaultConfig() {
        return {
            charts: [],
        };
    }

    init() {
        this.initSelect();
        this.select.onChange(value => {
            this.onChange(value);
        });
    }

    initSelect() {
        const charts = this.$chart.getCharts();

        let options = [];

        if (gof(this.config)('charts')('length')()) {
            this.config.charts.forEach((name) => {
                let selected = false;
                if (this.$chart.chartType === name) {
                    selected = true;
                }

                if (charts[name]) {
                    options.push({
                        icon: charts[name].icon,
                        value: name,
                        label: charts[name].chartZhName || charts[name].chartName,
                        selected
                    });
                }
            });
        } else {
            for (let chartName in charts) {
                options.push({
                    icon: charts[chartName].icon,
                    value: chartName,
                    label: charts[chartName].chartZhName || charts[chartName].chartName
                });
            }
        }

        this.select = this.createSelect(options);
    }

    onChange(chartName) {
        try {
            this.$chart.changeChart(chartName);
        } catch (e) {
            toast({ text: '抱歉，图谱切换失败' }).showToast();
            throw new Error(e);
        }
    }
}
