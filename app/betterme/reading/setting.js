import React, {Component} from 'react';
import * as base from "../base.js"
import {axios} from "../base.js"
import CCalendar from "./components/c_calendar.js"
import css from "./css/ireading.css"
import {connect} from "react-redux";
import {logout} from "../redux/actions/actions";

const BaseHost = base.BaseHostIreading();
import Moment from "moment"
import CSeperator from "./components/c_sperator";
import stopPng from "../../resource/imgs/stop.png";
import playPng from "../../resource/imgs/play.png";
import arrayLeftPng from "../../resource/imgs/array_left.png"
import arrayRightPng from "../../resource/imgs/array_right.png"

import CModalLogin from  "./components/c_modal_login.js"

class SettingPage_ extends Component
{
  constructor(props)
  {
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    super(props);
    this.state = {
      lan: base.getLan(),
      data: {},
      date:new Moment(),
    };

    
    this.logout = this.logout.bind(this);
    this.setLan = this.setLan.bind(this);
  }

  componentDidMount()
  {

  }

  setLan(lan){
    base.setLan(lan);
    setTimeout(()=>this.setState({lan:lan}),100);
  }

  logout()
  {
    if(window.Android)
    {
      var result = window.Android.logout();
    }
    else{
      this.props.dispatch(logout());

      setTimeout(()=>{
        base.back(1)
      },100);
    }

    console.log("logout");
  }

  render(){

    
    var lan = base.getLan();
    var lanItems = [];
    for(let key in  base.Languages){

      let name = base.Languages[key].name;
      let displayName = base.Languages[key].displayName;

      var backgroundColor = "";
      var color="gray";
      if(lan == name){
         backgroundColor = "gray";
         color = "white";
      }
      let div = <div style={{border:"1px solid gray",display:"inline-block",verticalAlign:"top",margin:"4px",padding:"4px",color:color,backgroundColor:backgroundColor}}
                     onClick={()=>this.setLan(name)}
      >
        {displayName}
        </div>
      lanItems.push(div);

    }

  
    let loginModal = <CModalLogin />
    
    return (
      <div style={{padding: "0px"}}>
          {loginModal}
        
          <div style={{textAlign:"left",textAlign:"center", width:"90%",borderRadius:"4px",margin:"auto",color:"gray",fontWeight:"bold",marginTop:"30px"}}>
            <div style={{marginBottom:"12px"}}>设置语言</div>
            <div style={{textAlign:"left"}}>{lanItems}</div>
          </div>  

         <CSeperator style={{marginTop:"20px"}}/>

          <div style={{textAlign:"center", width:"90%",borderRadius:"4px",margin:"auto",padding:"10px",backgroundColor:"gray",color:"white",fontWeight:"bold",marginTop:"30px"}}
             onClick={()=>this.logout()}>
            logout
          </div>  
      </div>
    );
  }
}



const mapStateToProps = state => {
  return {
    redux_data: state,
  }
}
const SettingPage = connect(mapStateToProps)(SettingPage_)
export default  SettingPage;