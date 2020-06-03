import gof from 'get-object-field';
import plugins from './plugins';
import { uuid } from '../../utils/util';

export default class Plugin {
    $chart;
    toolbar;
    boxID = '';

    plugins = {};

    defaultCommonConfig = {
        toolbarShow: true
    };
    config = {};

    static register(Plugin) {
        plugins[Plugin.pluginName] = Plugin;
    }

    constructor($chart) {
        this.$chart = $chart;
    }

    initPlugins(config = {}) {
        this.config = config;
        this.config.common = { ...this.defaultCommonConfig, ...this.config.common }

        this.initToolbar();
        this.initPlugin();
    }

    initToolbar() {
        this.container = document.getElementById(this.$chart.domID);
        const toolbar = document.createElement('div');
        this.boxID = `chartToolbar-roc-${uuid()}`;
        toolbar.id = this.boxID
        toolbar.classList.add('chartToolbar-roc');
        this.container.appendChild(toolbar);
        this.toolbar = toolbar;

        if (!gof(this.config)('common')('toolbarShow')()) {
            toolbar.classList.add('hide-roc');
        }
    }

    initPlugin() {
        const disablePlugins = gof(this.config)('common')('disable')();
        if (disablePlugins) {
            for (let pluginName in plugins) {
                if (!disablePlugins.includes(pluginName)) {
                    this.newPlugin(pluginName);
                }
            }
        } else {
            for (let pluginName in plugins) {
                this.newPlugin(pluginName);
            }
        }
    }

    newPlugin(pluginName) {
        if (!this.plugins[pluginName]) {
            const ins = new plugins[pluginName](this.$chart, this.boxID);
            ins.init();
            this.plugins[pluginName] = ins;
        }
    }
}
