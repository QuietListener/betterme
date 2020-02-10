import React, {Component} from 'react';
import config from './conf/config.json';

import "./css/Greeter.css"
import styles from './css/Greeter.css';
import RNWebviewMessager from "./lib/rn_webview_messager.js"

console.log(styles)

class GreeterReact extends Component{

    constructor(props)
    {
      super(props);
      this.state = {share_result:"no result",chanel:null};
      this.msger = new RNWebviewMessager();
      this.show = this.show.bind(this);
      this.share_callback = this.share_callback.bind(this);
    }


    share_callback(result,chanel)
    {
      alert(`chanel:${chanel}, result:${JSON.stringify(result)}`)
      this.setState({result:result,chanel:chanel});
    }

    show()
    {
      alert("show--")
      var url = "https://mango.baicizhan.com/react_reading/reading/daka_package?di=TPh7RzkGNfiIB8PU/KlTR7owIk2T0c8u78JsdoJmBSM="
      var img = "https://7n.bczcdn.com/cover_img/rimg_package_999999999_1503051309_13505.jpeg"

      var share_data = {"url": url, "title": "测试", "desc": "desc", "img": img, "share_type": "", "share_media": ""}
      this.msger.share(share_data, this.share_callback)
    }

    render(){
        return (
            <div className={styles.root}>

               <div> {config.greetText}</div>
                <div>
                  chanel:{this.state.chanel}
                  <br/>
                  result:{this.state.result==null?"没有":JSON.stringify(this.state.result)}
                </div>

                <div style={{fontSize:40}} onClick={this.show.bind(this)}>show</div>

                 {/*<div style={{fontSize:40}} onClick={()=>this.msger.call("startRecord",{},()=>{})}>startRecord</div>*/}
                 {/*<div style={{fontSize:40}} onClick={()=>this.msger.call("stopRecord",{},()=>{})}>stopRecord</div>*/}
                 {/*<div style={{fontSize:40}} onClick={()=>this.msger.call("playRecord",{},()=>{})}>playRecord</div>*/}
            </div>
        )
    }
}

export default GreeterReact