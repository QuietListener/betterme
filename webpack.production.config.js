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
    entry: {
        bundle: __dirname+"/app/mainReact.js",
      // Since react is installed as a node module, node_modules/react,
      // we can point to it directly, just like require('react');
      // 当 React 作为一个 node 模块安装的时候，
      // 我们可以直接指向它，就比如 require('react')
      vendors: ['react','moment','axios','lodash','redux','react-redux']
      },
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
        new webpack.optimize.UglifyJsPlugin(
          {comments: false,        //去掉注释
              compress: {
              warnings: false    //忽略警告,要不然会有一大堆的黄色字体出现……
              }
          }
        ),
        //new ExtractTextPlugin("[name]-[hash].css")
      //CommonsChunkPlugin提取第三方库单独打包
      new webpack.optimize.CommonsChunkPlugin({name:'vendors', filename:'vendors.js'})
    ]
}