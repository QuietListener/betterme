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
export default class Home extends Component{

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
    this.load_plans =this.load_plans.bind(this);

    this.canel_new_plan = this.canel_new_plan.bind(this);
    this.show_create_plan = this.show_create_plan.bind(this);
    this.valueChange = this.valueChange.bind(this);

    this.componentDidMount = this.componentDidMount.bind(this);


    this.daka_error = this.daka_error.bind(this);
    this.daka_start = this.daka_start.bind(this);
    this.plan_mapper = this.plan_mapper.bind(this);

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

  active_type(type)
  {
    var ret = {};
    if(this.state.plan_type==type)
    {
      ret["color"]=base.COLOR.red;
      ret["backgroundColor"]="white"
      ret['border']=`1px solid ${base.COLOR.red}`
      ret['borderRadius']="4px";
    }
    else
    {
      ret;
    }

    return ret;
  }

  plan_mapper(item)
  {
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
            <div style={{display:"inline-block",width:"69%"}}  onClick={()=>base.goto(`/plan_details/${item.id}`)}>
              <span>{item.name}</span>
            </div>

            <div style={{display:"inline-block",width:"30%",textAlign:"center",backgroundColor:base.COLOR.gray,padding:"2px",borderRadius:"2px"}}
                 onClick={()=>base.goto(`/new_plan/${item.id}`)}
            >
              <IconEdit style={{fontSize:"14px"}}></IconEdit><span style={{fontSize:"14px"}}>编辑</span>
            </div>

          </div>

          <div style={{borderBottom:"1px solid #f2f2f2"}}/>

          <div style={{display:"inline-block",fontSize:"14px",width:"69%",textAlign:"left"}}>
            <span style={{color:base.COLOR.red}}>{start}</span> 到 <span  style={{color:base.COLOR.red}}>{end}</span>
          </div>

          <div style={{display:"inline-block",fontSize:"14px",width:"30%",textAlign:"right"}}>
            <span style={{fontSize:"20px",color:"red",padding:"6px"}}>{item.finished_days_count}</span>/ {item.total_days_count}天
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
  }
  render(){

    var loading_view = <CLoading/>
    if(this.state.loading == false)
      loading_view = true;

    var user = this.state.user;
    if(user == null || this.state.loading == true)
      return loading_view;

    var plans = this.state.plans;
    var new_plan = null;

    //plans = [];





    var show_view = null;
    var plans_ing = [];
    var plans_overdue = [];
    if(plans.length == 0 )
    {
      var add_btn = null;

      if(this.state.show_new_plan == false)
      {
        add_btn = <div>
          <div style={{marginTop: "10px"}}>
            <p  style={{fontSize: "20px",color:"black",fontSize: "18px"}}>
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
                verticalAlign: "middle",
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

       plans_ing = plans.filter((item1)=>{
        if(!item1 || !item1.end)
          return false;

         var today_ = Moment();
         var end  = Moment(item1.end);

        var finished_days = item1.finished_days_count
        var total_days = item1.total_days_count

        if(total_days >= finished_days &&  today_ - end <= 0)
        {
          return true;
        }

        return false;

      }).map((item)=>{
          return this.plan_mapper(item);
      });


       plans_overdue = plans.filter((item1)=>{
         if(!item1 || !item1.end)
           return false;

         var today_ = Moment();
         var end  = Moment(item1.end);

         var finished_days = item1.finished_days_count
         var total_days = item1.total_days_count

         if(total_days >= finished_days &&  today_ - end <= 0)
         {
           return false;
         }

         return true;

      }).map((item)=>{
        return this.plan_mapper(item);
      })


      var new_plan_small_btn = null;
      if(this.state.show_new_plan == false)
        new_plan_small_btn = plans_ing.length < 4 ? <button  style={{fontSize:"16px",backgroundColor:base.COLOR.red,
          color:"white",borderRadius:"4px",marginTop:"10px",padding:"8px"}}
         onClick={()=>base.goto(`/new_plan/-1`)}
        >

          <IconControlPoint style={{fontSize:"18px",marginRight:"4px",marginBottom:"2px"}}/>

          <span>添加小目标</span>

      </button>:null;

      var show_view = <div style={{marginTop:"10px"}}>
        {this.state.plan_type == PlanTypeIng ? plans_ing : plans_overdue}
        {new_plan_small_btn}
      </div>
    }


    var btn = <div style={{display:"inline-block"}}  onClick={()=>{
      if(this.state.plan_type  == PlanTypeIng)
        this.setState({plan_type:PlanTypeOverdue})
      else
        this.setState({plan_type:PlanTypeIng})
    }}>

      <div style={Object.assign({padding:"4px",display:"inline-block",marginLeft:"4px"},this.active_type(PlanTypeIng))}>进行中的计划({plans_ing.length})</div>
      <div  style={Object.assign({padding:"4px",display:"inline-block",marginLeft:"4px"},this.active_type(PlanTypeOverdue))}>完成了的计划({plans_overdue.length})</div>

    </div>


    var reward = <CReward/>;

    return (
      <div style={{width:"100%",overflow:"no-display",backgroundColor:base.COLOR.gray}}>
        {reward}

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





        {new_plan}
        <div style={{textAlign:"center",marginTop:"20px"}}>
          {btn}
          {show_view}
        </div>


      </div>

        {/*<CBottomSaveBar active_item_index={0}*/}
                        {/*items={[{title:"打卡"},{title:"我"}]}*/}
                        {/*onItemClick={(i)=>console.log(`CBottomSaveBar ${i} clicked`)}*/}
                        {/*style={{position:"fixed",bottom:0,zIndex:1000}}*/}
        {/*/>*/}

      </div>
    )
  }
}

const inner_style = {
  input:{fontSize:"22px",minWidth:"120px",border:"0px",borderBottom:"1px solid #f2f2f2",marginTop:"10px"}
}