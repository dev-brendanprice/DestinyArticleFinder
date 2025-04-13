import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';

const __dirname = path.resolve();
const config = merge(common, {
    mode: 'production',
    output: {
        publicPath: '/' // SPA routes
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(), // minify css
            new TerserPlugin(), // minify js > has to be here bc CssMinimizer replaces it
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src/template.html') // minify html
            })
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        new Dotenv()
    ]
});

export default config;
