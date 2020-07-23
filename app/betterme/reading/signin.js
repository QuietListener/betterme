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
import CLoading from './components/c_loading.js';

class Signin_ extends Component
{

  constructor(props)
  {
    super(props);
    this.state = {loading:false}
    this.load = this.load.bind(this);
  }

  componentDidMount()
  {
    this.load();
  }

  load()
  {
    let access_token = base.getCookie("access_token");
    if(access_token && access_token.length > 0){
      var that = this;
      this.setState({loading: true});

      var id = this.state.id;
      axios.get(`${BaseHost}/reading/userInfo.json`).then((res) => {
        console.log("res", res);
        that.setState({data: res.data});
        console.log(that.state);
        // that.load_plans(user.id)
        this.setState({loading: false});
      }).catch(e => {
        console.log(e);
        this.setState({loading: false});
      })

    }
  }

  render(){


   let access_token = base.getCookie("access_token");

   let data = this.state.data;
   let user = data && data['user'] ? data['user'] : {};

   let showDiv = null;
   if(access_token){
      showDiv = <div>
      
        {this.state.loading == true 
        ? 
         <CLoading></CLoading>
         :
         <span> {user.name} </span>
        }
        <span>登录成功</span>
        <div onClick={()=>base.goto("/")}>去首页</div>
      </div>
    }else{
      showDiv = <CSignin></CSignin>;
    }

   
    let tip = {
      
    }

    return (
      <div style={{textAlign:"center"}}>
        <div> 小蜜蜂英文阅读 </div>
          {showDiv}
        <div>
          {}
        </div>  
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