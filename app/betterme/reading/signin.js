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


   let access_token = base.getCookie("access_token");

   let showDiv = null;
    if(access_token){
      showDiv = <div>
        <div>登录成功</div>
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