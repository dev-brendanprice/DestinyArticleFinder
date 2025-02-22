import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import path from 'path';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import DotenvWebpackPlugin from 'dotenv-webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';


const __dirname = path.resolve();
const config = merge(common, {
    mode: 'production',
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
        new DotenvWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
    ]
});

export default config;