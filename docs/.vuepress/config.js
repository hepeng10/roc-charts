/**
 * Created by hepeng on 2020/6/4
 */
module.exports = {
    base: '/roc-charts-document/',

    title: 'roc-charts 开发文档',
    description: 'roc-charts 是一个基于 zrender 的开源关系图谱框架',
    port: 9090,
    extraWatchFiles: ['**/*.md', '**/*.vue'],

    themeConfig: {
        sidebar: [
            {
                title: '指南',
                collapsable: false,
                children: [
                    '/',
                    '/basic',
                    '/directory',
                ]
            },
            {
                title: '进阶',
                collapsable: false,
                children: [
                    '/node',
                    '/link',
                ]
            },
        ],
    }
}
