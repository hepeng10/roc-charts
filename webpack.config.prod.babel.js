import path from 'path';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import baseConfig from './webpack.config.base';

export default webpackMerge(baseConfig, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                include: path.join(__dirname, 'src'),
                use: [{
                    loader: 'eslint-loader',
                    options: {
                        configFile: '.eslintrc.prod.json'
                    }
                }]
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: false,
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            // 抽离依赖
            cacheGroups: {
                // 将 node_modules 用到的包，每个都单独打包成一个 js 文件
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
                // 对于通过 MiniCssExtractPlugin 生成的 CSS 文件也可以通过 SplitChunks 来进行抽取公有样式
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                    priority: 100,
                }
            },
        },
    },
});
