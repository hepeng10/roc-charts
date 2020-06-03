import path from 'path';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import baseConfig from './webpack.config.base';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';

export default webpackMerge(baseConfig, {
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
        minimizer: [
            new UglifyJSPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
                extractComments: false,
                uglifyOptions: {
                    warnings: false,
                    output: {
                        comments: false
                    },
                    compress: {
                        drop_debugger: true,
                        drop_console: true
                    }
                }
            }),
        ]
    },
});
