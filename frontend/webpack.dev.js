import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';


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
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/template.html')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        new ESLintWebpackPlugin()
    ]
});

export default config;