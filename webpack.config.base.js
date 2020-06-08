import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const STATIC_PATH = 'static';

const IS_DEV = process.env.ENV !== 'PROD';

function resolve(dir) {
    return path.join(__dirname, dir);
}

export default {
    entry: {
        main: ['./src/index.jsx']
    },
    output: {
        publicPath: '/',
        path: path.join(__dirname, 'build'),
        filename: `${STATIC_PATH}/js/[hash].[name].js`,
        chunkFilename: `${STATIC_PATH}/js/[name].[hash:5].chunk.js`,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.less'],
        alias: {
            '@': resolve('src'),
            '@images': resolve('src/images'),
            '@styles': resolve('src/styles'),
            '@utils': resolve('src/utils'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.join(__dirname, 'src'),
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                include: path.join(__dirname, 'node_modules'),
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.(css|less)$/,
                include: path.join(__dirname, 'src'),
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: IS_DEV,  // 开发的时候开启hmr
                        },
                    },
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
            },
            {
                test: /\.(woff|eot|ttf|svg)$/,
                include: path.join(__dirname, 'src/fonts'),
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10,
                        name: `${STATIC_PATH}/fonts/[hash].[ext]`
                    }
                }]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|xlsx)$/,
                exclude: path.join(__dirname, 'src/fonts'),
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: `${STATIC_PATH}/images/[hash].[ext]`
                    }
                }]
            },
            {
                test: /\.ico$/,
                include: path.join(__dirname, 'src/images'),
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: `${STATIC_PATH}/images/[name].[ext]`
                    }
                }]
            },
            {
                test: /\.json$/,
                include: path.join(__dirname, 'src'),
                use: [{
                    loader: 'json-loader'
                }]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'vendor',
                    chunks: 'initial',
                    minChunks: 2
                },
            }
        },
    },
    plugins: [
        new CleanWebpackPlugin(['build']),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: IS_DEV ? `${STATIC_PATH}/css/[name].css` : `${STATIC_PATH}/css/[name].[hash].css`,
            chunkFilename: IS_DEV ? `${STATIC_PATH}/css/[name].css` : `${STATIC_PATH}/css/[name].[hash].css`
        }),
        new CaseSensitivePathsPlugin(),
    ]
};
