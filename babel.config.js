module.exports = (api) => {
    api.cache(true);

    const presets = [
        ['@babel/preset-env', {
            targets: [
                'last 2 version',
                'ie >= 9'
            ],
            // Allow importing core-js in entrypoint and use browserlist to select polyfills
            useBuiltIns: 'entry', // https://www.cnblogs.com/amiezhang/p/11384309.html
            corejs: 3,  // corejs version
            // Exclude transforms that make all code slower
            exclude: ['transform-typeof-symbol'],
        }],
        '@babel/preset-react'
    ];

    const plugins = [
        'react-hot-loader/babel',
        [  // antd 按需引入
            'import',
            { libraryName: 'antd-mobile', style: 'css' }
        ],

        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
        [
            '@babel/plugin-proposal-decorators',
            {
                // decoratorsBeforeExport: true,
                legacy: true,
            }
        ],
        [
            '@babel/plugin-proposal-class-properties',
            {
                loose: true
            }
        ],
    ];

    return {
        presets,
        plugins
    };
};
