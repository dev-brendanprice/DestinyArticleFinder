import Dotenv from 'dotenv-webpack';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';

const __dirname = path.resolve();
const config = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        static: false,
        port: 3000,
        hot: true,
        liveReload: true,
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/template.html')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        new ESLintWebpackPlugin(),
        new Dotenv()
    ]
});

export default config;
