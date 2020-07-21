import React, {Component} from 'react';
import * as base from "../base.js"
import {axios} from "../base.js"
import CCalendar from "./components/c_calendar.js"
import css from "./css/ireading.css"


const BaseHost = base.BaseHostIreading();
import Moment from "moment"
import CSeperator from "./components/c_sperator";
import stopPng from "../../resource/imgs/stop.png";
import playPng from "../../resource/imgs/play.png";
import arrayLeftPng from "../../resource/imgs/array_left.png"
import arrayRightPng from "../../resource/imgs/array_right.png"
import CShareContent from "./components/c_share_content";
import CSignin from "./components/c_sigin";
import {connect} from "react-redux";

class Signin_ extends Component
{

  constructor(props)
  {
    super(props);
  }

  render(){

   var userInfo = this.props.redux_data.reading[base.URLS.signin.name]||{};

   let showDiv = null;
    if(userInfo && userInfo["data"] && userInfo["data"]["user"]){
      let name = userInfo["data"]["user"]["name"];
      showDiv = <div>
            <div>{name} 已经登录</div>
            <div onClick={()=>base.goto("/")}>去首页</div>
      </div>
    }else{
      showDiv = <CSignin></CSignin>;
    }

   

    return (
      <div style={{textAlign:"center"}}>
        <div> 小蜜蜂英文阅读 </div>
          {showDiv}
      </div>
    );
  }
}

const inner_style = {
}

const mapStateToProps = state => {
  return {
    redux_data: state,
  }
}
const Signin = connect(mapStateToProps)(Signin_)
export default Signin;