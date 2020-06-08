import path from 'path';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import Config from './src/config';
import baseConfig from './webpack.config.base';

const env = process.env;
const LocalServer = {
    'local': Config.LocalServer.local,
    'mock': Config.LocalServer.mock
};
const port = LocalServer.local.port;

export default webpackMerge(baseConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                include: path.join(__dirname, 'src'),
                use: [{
                    loader: 'eslint-loader',
                    options: {
                        configFile: '.eslintrc.json',
                    },
                }],
            },
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            __DEV__: true,
            __MOCK__: env.NODE_ENV === 'mock'
        }),
    ],
    devServer: {
        host: '0.0.0.0',
        port: port,
        disableHostCheck: true,
        compress: true,
        contentBase: path.join(__dirname, 'build'),
    }
});

