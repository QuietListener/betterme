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

const PlanName = "plan_name";
const Start = "start";
const End = "end";


import init_share from "../lib/weixin_share.js"

export default class Home extends Component{

  constructor(props)
  {

    var init_plans = [{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
      {id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    super(props);
    this.state={
      show_new_plan:false,
      plan_name:"",
      plans:init_plans,
      MAX_DAYS:7,
      loading:true,
      daka_loading:false
    };

    this.load = this.load.bind(this);
    this.load_plans =this.load_plans.bind(this);

    this.canel_new_plan = this.canel_new_plan.bind(this);
    this.show_create_plan = this.show_create_plan.bind(this);
    this.valueChange = this.valueChange.bind(this);

    this.componentDidMount = this.componentDidMount.bind(this);


    this.daka_error = this.daka_error.bind(this);
    this.daka_start = this.daka_start.bind(this);

  }


  componentDidMount()
  {
      this.load();
      console.log("componentDidMount",this.state);
      var url = `${base.BaseHost}/weixin/get_share_config.json`
      init_share(url)
  }


  load_plans(user_id)
  {
    var that = this;
    axios.get(`${base.BaseHost}/index/plans.json?user_id=${user_id}`).then((res)=>{
      console.log("res",res);
      var plans = res.data.data;
      that.setState({plans:plans});
      console.log(that.state);
      this.setState({loading:false});
    }).catch(e=>{
      this.setState({loading:false});
    })
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

  deletePlan(id)
  {
    var plans = this.state.plans;
    var index = _.findIndex(plans,(item)=>item.id == id);

    if(index >= 0)
    {
      plans.splice(index, 1);
      this.setState({plans:plans})
    }
  }


  canel_new_plan()
  {
    this.setState({show_new_plan:false});
  }

  show_create_plan()
  {
    this.setState({show_new_plan:true});
  }

  valueChange(event,item_name)
  {
    console.log(item_name)
    var new_state = {};
    new_state[item_name] =  event.target.value;
    this.setState(new_state);
  }

  daka_start()
  {
    this.setState({loading:true})
  }

  daka_error(e)
  {
    console.error(e);
    this.setState({loading:false})
  }

  render(){

    var loading_view = <CLoading/>
    if(this.state.loading == false)
      loading_view = true;

    var user = this.state.user;
    if(user == null)
      return loading_view;

    var plans = this.state.plans;
    var new_plan = null;

    //plans = [];


    var show_view = null;
    if(plans.length == 0 )
    {
      var add_btn = null;

      if(this.state.show_new_plan == false)
      {
        add_btn = <div>
          <div style={{marginTop: "10px"}}>
            <p  style={{fontSize: "20px",color:"black",fontSize: "18px"}}>
              <span  style={{fontSize:"28px",padding:"8px",color:base.COLOR.red}}>@{user.nick_name}</span>
              来制定你第一个小目标吧~</p>
          </div>
          <div style={{
                      position: "relative", margin: "auto",
                      width: 200, height: 200, borderRadius: 100,
                      backgroundColor: base.COLOR.red, marginTop: "20px",
                      boxShadow:"0 4px 8px hsla(0,0%,71%,.8)"
                    }}
               onClick={()=>base.goto("/new_plan/-1")
               }
          >

            <div
              style={{
                width: "100px",
                textAlign: "center",
                verticalAlign: "center",
                position: "absolute",
                top: "50%", left: "50%",
                marginLeft: "-50px", marginTop: "-20px"
              }}
            >
              <span style={{fontSize: "30px",color:"white",fontWeight:"bold"}}>GO</span>
            </div>
          </div>
        </div>
      }

      show_view =<div style={{marginTop:"30px"}}>
        {add_btn}
        {new_plan}
      </div>
    }
    else
    {

      var plans_ = plans.map((item)=>{

          var start = base.formatDate(item.start);
          var end = base.formatDate(item.end);
          let item_=item;

          return <div style={{border:"1px solid #fff",
                              backgroundColor:"white",
                              padding:"20px",paddingTop:"2px",margin:"10px",borderRadius:"4px",
                              boxShadow:"0 4px 8px hsla(0,0%,71%,.8)"

          }}
          >
            <div style={{display:"inline-block",width:"100%"}}>
              <div style={{}}>

                <div style={{padding:"4px",display:"inline-block",color:base.COLOR.red, fontSize:"18px",width:"100%",textAlign:"left"}}

                >
                  <div style={{display:"inline-block",width:"80%"}}  onClick={()=>base.goto(`/plan_details/${item.id}`)}>
                  <span>{item.name}</span>
                </div>

                <div style={{display:"inline-block",width:"18%",textAlign:"center",backgroundColor:base.COLOR.gray,padding:"2px",borderRadius:"2px"}}
                onClick={()=>base.goto(`/new_plan/${item.id}`)}
                >
                  <IconEdit style={{fontSize:"14px"}}></IconEdit><span style={{fontSize:"14px"}}>编辑</span>
               </div>

                </div>

                <div style={{borderBottom:"1px solid #f2f2f2"}}/>

                <div style={{display:"inline-block",fontSize:"14px",width:"58%",textAlign:"left"}}>
                  <span style={{color:base.COLOR.red}}>{start}</span> 到 <span  style={{color:base.COLOR.red}}>{end}</span>
                </div>

                <div style={{display:"inline-block",fontSize:"14px",width:"40%",textAlign:"right"}}>
                  已经完成 <span style={{fontSize:"20px",color:"red",padding:"6px"}}>{item.finished_days_count}</span>/{item.total_days_count}天
                </div>


              </div>
            </div>

            <div style={{marginTop:"4px",marginBottom:"20px"}}>
              <CProgress percent={0.5} />
            </div>

            {/*<p>{start} - {end}</p>*/}
            <CDaka plan={item_}
                   daka_success={this.componentDidMount}
                   daka_start={()=>this.daka_start()}
                   daka_error={(e)=>this.daka_error(e)}
                   style={{}} />
            {/*<button onClick={()=>this.deletePlan(item.id)}>删除</button>*/}
          </div>
      })

      var new_plan_small_btn = null;
      if(this.state.show_new_plan == false)
        new_plan_small_btn = <button  style={{fontSize:"16px",backgroundColor:base.COLOR.red,
          color:"white",borderRadius:"4px",marginTop:"10px",padding:"8px"}}
         onClick={()=>base.goto(`/new_plan/-1`)}
        >

          <IconControlPoint style={{fontSize:"18px",marginRight:"4px",marginBottom:"2px"}}/>

          <span>我还有一个小目标</span>

      </button>

      var show_view = <div style={{marginTop:"10px"}}>
        {plans_}

        {new_plan_small_btn}
      </div>
    }




    return (
      <div style={{width:"100%"}}>
        {loading_view}
        <div style={{backgroundColor:base.COLOR.red,textAlign:"center",padding:"10px",
          linearGradient:"(90deg,#5dc5ff,#638fff)"}}>
          <img style={{margin:"auto",width:50,height:50,borderRadius:25}} src={user.avatar}></img>
          <div style={{margin:"auto",fontSize:"20px",color:"white"}}>{user.nick_name}</div>
        </div>

        <div style={{textAlign:"center",marginTop:"20px"}}>
          <p style={{color:base.COLOR.red,fontWeight:"bold",fontSize:"14px"}}>  {base.slogon1} <br/><span style={{color:"black",fontSize:"12px",fontWeight:"normal"}}>今天是{base.today()}</span></p>
        </div>
        {new_plan}
        <div style={{textAlign:"center",marginTop:"20px"}}>
          {show_view}
        </div>

      </div>
    )
  }
}

const inner_style = {
  input:{fontSize:"22px",minWidth:"120px",border:"0px",borderBottom:"1px solid #f2f2f2",marginTop:"10px"}
}