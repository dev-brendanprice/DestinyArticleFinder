import path from 'path';
import dotenv from 'dotenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import DotenvWebpackPlugin from 'dotenv-webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

dotenv.config();
const __dirname = path.resolve();

const config = (cli_env) => {

    return {
        entry: path.resolve(__dirname, 'src/index.js'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js'
        },
        // mode: `${process.env.MODE}`,
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/[name][ext]'
                    }
                }
            ]
        },
        plugins: [
            new DotenvWebpackPlugin({
                path: path.resolve(__dirname, '.env'),
                prefix: 'import.meta.env.'
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src/index.html'),
                filename: 'index.html'
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css'
            })
        ],
        devServer: {
            static: {
                directory: path.join(__dirname, 'src')
            },
            port: process.env.DEV_PORT || 3300,
            hot: true,
            liveReload: true
        }
    };
};

export default config;