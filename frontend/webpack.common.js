import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';


const __dirname = path.resolve();
const config = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.[contenthash].js', // apply cache-block to dev and prod
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader, // extract css into files
                    'css-loader' // turn css into commonjs
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name][ext]'
                }
            }
        ]
    }
};

export default config;