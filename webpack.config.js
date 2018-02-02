const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    //入口
    entry: path.join(__dirname, 'src/app.js'),
    //输出
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    // 解析器
    module: {

        rules: [{
                test: /\.js$/,
                loader: "babel-loader"
            }, {
                test: /\.html$/,
                loader: "html-loader"
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }, {
                test: /\.(eot|svg|ttf|woff|woff2|otf)/,
                use: "url-loader?limit=50000&name=[path][name].[ext]"
            },
            {
                test: /\.(jpg|jpeg|png|gif)/,
                loader: "file-loader"
            }
        ]
    },
    devServer: {
        host: 'localhost',
        port: 8080,
        contentBase: '.',
        setup(app) {
            app.get('/mock', function(req, res) {
                let filepath = path.join(__dirname, 'src/mock/data/imgs.json');
                fs.readFile(filepath, function(err, data) {
                    if (err) return console.log(err);
                    res.end(data);
                })
            })
        }
    },
    plugin: [
        new EctractTextPlugin('main.css'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunckPlugin({
            name: 'common',
            filename: 'common.js'
        }),
        new HtmlWebpackPlugin({
            title: 'index',
            filename: 'index.html',
            template: './index.html',
            inject: 'body',
            hash: true
        })
    ]
}