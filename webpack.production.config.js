/**
 * Created by junjun on 17/8/2.
 */
/**
 * Created by junjun on 17/8/2.
 */
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports={
    //devtool:'eval-source-map',
    //entry:__dirname+"/app/main.js", //唯一入口
    entry:__dirname+"/app/mainReact.js", //唯一入口
    output:{
        path:__dirname+"/public",
        filename: "[name]-[hash].js"
    },

    devServer:{
        contentBase:"./public",//页面所在目录
        //colors:true,
        historyApiFallback:true,//不跳转
        inline:true, //实时刷新,
        hot: true
    },

    module:{
        loaders:[
            {
                test: /\.json$/,
                loader:"json-loader"
            },
            {
                test:/\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'//在webpack的module部分的loaders里进行配置即可
            },
            {
                test: /\.css$/,
                use: [ 'style-loader?modules', 'css-loader?modules' ]
                //use: ExtractTextPlugin.extract({
                //    fallback: "style-loader",
                //    use: "css-loader"
                //})
            }
        ]

    },

    plugins:[
        new webpack.HotModuleReplacementPlugin(),//热加载插件
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        //new ExtractTextPlugin("[name]-[hash].css")
    ]
}