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
    this.loginCallBack = this.loginCallBack.bind(this);
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

  loginCallBack(data){
     this.load();  
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
         <span style={{fontSize:"16px",color:base.COLOR.red,fontWeight:"bold"}}> {user.name} </span>
        }

        <span>登录成功</span>

        <button style={{marginTop:"20px",width:"200px",height:"30px",background:base.COLOR.red,color:"white",border:"0px"}} onClick={()=>base.goto("/")}>去首页 开始阅读吧</button>
      </div>
    }else{
      showDiv = <CSignin loginCallBack={this.loginCallBack}></CSignin>;
    }

   
    let tip = <div></div>

    return (
      <div style={{textAlign:"center"}}>
       
        <div style={{position:"fixed",fontSize:"16px",top:"2px",left:"2px",padding:"6px"}} onClick={()=>{base.goto("/")}}>
              <img width={14} src={arrayLeftPng}/>
        </div>

        <div style={{marginBottom:"30px",marginTop:"20px"}}> 
        小蜜蜂英文阅读 
        </div>

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