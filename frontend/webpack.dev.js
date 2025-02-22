import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import path from 'path';
import DotenvWebpackPlugin from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';


const __dirname = path.resolve();
const config = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        static: false,
        port: 3300,
        hot: true,
        liveReload: true
    },
    plugins: [
        new DotenvWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/template.html')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
    ]
});

export default config;