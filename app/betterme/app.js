import React, {Component} from 'react';
import config from '../conf/config.json';

import  '../css/app.css';


const avatar = "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTInk6tZfjiaebxVTn2TkN0ImuRYGyg3p19uUPMSFyU1GD4vrj3yh2C2E7SLsC7rgibOu0sCAUZedK6g/0"
const user_name = "君君"

export default class App extends Component{

  constructor(props)
  {
    super(props);
  }


  render(){
    return (
      <div style={{width:"100%"}}>
        <div style={{backgroundColor:"red",textAlign:"center"}}>

        <div style={{width:"100%"}}>
          <img style={{margin:"auto",width:60,height:60,borderRadius:30,marginTop:30}} src={avatar}></img>
        </div>

        <div>
          <div style={{margin:"auto",fontSize:"18px"}}>{user_name}</div>
        </div>

        </div>

      </div>
    )
  }
}