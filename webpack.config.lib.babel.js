import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export default {
    // mode: 'development',
    mode: 'production',
    entry: './src/chart/index',
    output: {
        publicPath: '/',
        path: path.join(__dirname, 'lib'),
        filename: 'RCharts.js',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    resolve: {
        extensions: ['.js', '.css', '.less']
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            include: path.join(__dirname, 'src'),
            use: ['babel-loader']
        }, {
            test: /\.(css|less)$/,
            include: path.join(__dirname, 'src'),
            use: [
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 2,
                        localIdentName: '[name]_[local]--[hash:base64:5]',
                    }
                },
                'postcss-loader',
                'less-loader',
            ]
        }, {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            include: path.join(__dirname, 'src'),
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '/images/[hash].[ext]'
                }
            }]
        }, {
            test: /\.ico$/,
            include: path.join(__dirname, 'src'),
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: './images/[name].[ext]'
                }
            }]
        }]
    },
    devtool: 'none',
    plugins: [
        new CleanWebpackPlugin(['lib']),                  // 清除编译目录
    ],
};
