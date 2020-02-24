/**
 * Created by junjun on 17/8/2.
 */
/**
 * Created by junjun on 17/8/2.
 */
process.env.NODE_ENV = 'production'
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// var ETP = require("extract-text-webpack-plugin");

module.exports={
  //devtool:'eval-source-map',
  //entry:__dirname+"/app/main.js", //唯一入口
  entry:__dirname+"/app/mainReact.js", //唯一入口
  output:{
    path:__dirname+"/public",
    filename: "bundle-[hash].js"
  },

  devServer:{
    contentBase:"./public",//页面所在目录
    //colors:true,
    historyApiFallback:true,//不跳转
    disableHostCheck: true   // That solved it
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
        use: ['style-loader?modules', 'css-loader?modules']
      }
      ,
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loader: 'file-loader?hash=sha512&digest=hex&name=[hash].[ext]'
      }
    ]
  },

  plugins:[
    new HtmlWebpackPlugin({
      title:"test",
      template: __dirname + "/app/index_p.tmpl.html",//new 一个这个插件的实例，并传入相关的参数
      filename: __dirname + '/public/index1.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),
    //根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id，使得ids可预测，降低文件大小，该模块推荐使用
    new webpack.optimize.OccurrenceOrderPlugin(),
    //压缩Js文件
    new webpack.optimize.UglifyJsPlugin()
    //new ExtractTextPlugin("[name]-[hash].css")
    //new ExtractTextPlugin("style.css")
  ]
}