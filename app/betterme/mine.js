import React, {Component} from 'react';
import config from '../conf/config.json';
import * as base from "./base.js"
import _ from "lodash"
import  '../css/app.css';
import NewPlanFlow from "../components/new_plan_flow.js"
import {axios} from "./base.js"

import CDaka from "../components/c_daka.js"
import CProgress from "../components/c_progress.js"

import moment from "moment"
import DatePicker  from 'material-ui/DatePicker';
import TextField   from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
const IconControlPoint = require('react-icons/lib/md/control-point');
const IconEdit = require("react-icons/lib/fa/edit");
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CLoading from "../components/loadings/c_loading";
import CBottomSaveBar from "../components/c_bottom_save_bar"
import Moment from "moment"

const PlanName = "plan_name";
const Start = "start";
const End = "end";

import init_share from "../lib/weixin_share.js"
import CReward from "../components/c_reward";

const PlanTypeIng = 0
const PlanTypeOverdue = 1
export default class Mine extends Component{

  constructor(props)
  {
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
      //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    super(props);
    this.state={
      show_new_plan:false,
      plan_name:"",
      plans:init_plans,
      MAX_DAYS:7,
      loading:true,
      daka_loading:false,
      plan_type:PlanTypeIng
    };

    this.load = this.load.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }


  componentDidMount()
  {
      this.load();
  }


  load()
  {
    var that = this;
    this.setState({loading:true});

    axios.get(`${base.BaseHost}/index/user.json`).then((res)=>{
      console.log("res",res);
      var user = res.data.data;
      that.setState({user:user});
      console.log(that.state);
      that.load_plans(user.id)
    }).catch(e=>{
      console.log(e);
      this.setState({loading:false});
    })
  }



  render()
  {
    var loading_view = <CLoading/>
    if(this.state.loading == false)
      loading_view = true;

    var user = this.state.user;
    if(user == null || this.state.loading == true)
      return loading_view;

    return (
      <div style={{width:"100%",overflow:"no-display",backgroundColor:base.COLOR.gray}}>

      <div style={{overflowY:"scroll",paddingTop:"6px",marginBottom:"60px"}}>
        {loading_view}

        <div style={{paddingLeft:"20px",borderBottom:"1px solid #fafafa",paddingBottom:"8px"}}>
          <div style={{height:"50px",textAlign:"left",verticalAlign:"middle"}}>
             <img style={{margin:"auto",width:"50px",height:"50px",borderRadius:"25px"}}
                  src={"http://7n.bczcdn.com/pack/assets/default_avatar.png"||user.avatar}></img>

            <div style={{height:"50px",display:"inline-block",verticalAlign:"middle",marginLeft:"8px",fontSize:"20px",color:base.COLOR.red}}>
              {user.nick_name||user.name}
            </div>

          </div>

          <p style={{marginTop:"8px",color:base.COLOR.red,fontWeight:"bold",fontSize:"14px"}}>
              <span style={{color:"black",fontSize:"12px",fontWeight:"normal"}}>
                Hi,今天是{base.today()}
                </span>
          </p>
        </div>


        <div style={{textAlign:"center",marginTop:"20px"}}>
          <div style={inner_style.stat_row}>

            <div style={inner_style.tip}>我已经坚持打卡：</div>
            <div style={inner_style.content}><span style={inner_style.hilight}>{user.statistics.daka_count}</span>次</div>

          </div>

          <div style={inner_style.stat_row}>
            <div  style={inner_style.tip}> 我的总积分：</div>
            <div  style={inner_style.content}> <span style={inner_style.hilight}>{user.statistics.total_score}</span>分</div>
          </div>
        </div>


      </div>

        <CBottomSaveBar active_item_index={1}
                        items={[{title:"打卡"},{title:"我"}]}
                        onItemClick={(i)=>{if(i == 0) base.goto("/")}}
                        style={{position:"fixed",bottom:0,zIndex:1000}}
        />

      </div>
    )
  }
}

const inner_style = {
   stat_row:{
     borderRadius:"4px",
     padding:"6px",
     fontSize:"14px",
     margin:"8px"
   },
  tip:{
     width:"50%",
     textAlign:"right",
    display:"inline-block",
     fontSize:"18px",

  },
  content:{
    width:"50%",
    textAlign:"left",
    display:"inline-block",
     fontSize:"20px"
  },
  hilight:{color:base.COLOR.red,fontSize:"25",margin:5}
}