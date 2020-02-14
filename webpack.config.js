/**
 * Created by junjun on 17/8/2.
 */
var webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  //entry:__dirname+"/app/main.js", //唯一入口
  entry: __dirname + "/app/mainReact.js", //唯一入口
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },

  devServer: {
    contentBase: "./public",//页面所在目录
    disableHostCheck: true,
    //colors:true,
    historyApiFallback: true,//不跳转
    //inline:true, //实时刷新,
    //hot: true
  },

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',//在webpack的module部分的loaders里进行配置即可
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

  plugins: [
    new webpack.HotModuleReplacementPlugin(),//热加载插件
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin(),
    //new ExtractTextPlugin("[name]-[hash].css")
  ]

}