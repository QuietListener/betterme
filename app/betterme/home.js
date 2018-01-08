import React, {Component} from 'react';
import config from '../conf/config.json';
import * as base from "./base.js"
import _ from "lodash"
import  '../css/app.css';
import NewPlanFlow from "../components/new_plan_flow.js"
import axios from "axios"

import CDaka from "../components/c_daka.js"
import CProgress from "../components/c_progress.js"

const PlanName = "plan_name";
const Start = "start";
const End = "end";
import moment from "moment"

export default class Home extends Component{

  constructor(props)
  {

    var init_plans = [{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
      {id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    super(props);
    this.state={
      show_new_plan:false,
      plan_name:"",
      plans:init_plans
    };

    this.load = this.load.bind(this);
    this.load_plans =this.load_plans.bind(this);

    this.canel_new_plan = this.canel_new_plan.bind(this);
    this.show_create_plan = this.show_create_plan.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.create_new_plan = this.create_new_plan.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }


  componentDidMount()
  {
      this.load();
      console.log("componentDidMount",this.state);
  }


  load_plans(user_id)
  {
    var that = this;
    axios.get(`${base.BaseHost}/index/plans.json?user_id=${user_id}`).then((res)=>{
      console.log("res",res);
      var plans = res.data.data;
      that.setState({plans:plans});
      console.log(that.state);
    })
  }

  load()
  {
    var that = this;
    axios.get(`${base.BaseHost}/index/user.json`).then((res)=>{
      console.log("res",res);
      var user = res.data.data;
      that.setState({user:user});
      console.log(that.state);
      that.load_plans(user.id)
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

  create_new_plan()
  {
      var plan_name = this.state.plan_name;
      var start = this.state.start;
      var end  = this.state.end;

      var new_plan = {plan_name,start,end};

      var plans = this.state.plans;
      plans.push(new_plan);

     var that = this;
     axios.post(`${base.BaseHost}/index/create_plan.json`,
             {
               name:plan_name,
               start_time:start,
               end_time:end
             }).then((res)=>{
                that.load_plans(that.state.user.id)
                that.canel_new_plan();
                })
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

  render(){

    var user = this.state.user;
    if(user == null)
      return null;

    var plans = this.state.plans;
    var new_plan = null;

    //plans = [];
    if(this.state.show_new_plan == true)
    {
       new_plan = <div style={{}}>
         <div style={{textAlign:"center"}}>
          <input style={inner_style.input}
                 value={this.state.plan_name}
                 placeholder={"输入我要制定的目标"}
                 onChange={(event)=>this.valueChange(event,PlanName)} />
         </div>

         <div>
         <input style={inner_style.input}
                value={this.state.start}
                placeholder={"开始日期"}
                onChange={(event)=>this.valueChange(event,Start)} />

         <input style={inner_style.input}
                value={this.state.end}
                placeholder={"结束日期"}
                onChange={(event)=>this.valueChange(event,End)} />


           <div style={{fontSize:"18px",padding:"4px",width:"100px",
             border:"1px solid",margin:"auto",marginTop:"10px"}}
                onClick={this.canel_new_plan}
           >取消</div>

          <div style={{fontSize:"18px",padding:"4px",width:"100px",
                       border:"1px solid",margin:"auto",marginTop:"10px"}}
               onClick={this.create_new_plan}
          >创建新计划</div>
         </div>
       </div>
    }

    var show_view = null;
    if(plans.length == 0)
    {
      var add_btn = null;

      if(this.state.show_new_plan == false)
      {
        add_btn = <div>
          <div style={{marginTop: "20px"}}>
            <p style={{fontSize: "20px"}}> 哈喽 <span style={{fontSize:"28px",marginRight:"10px",}}>{user.nick_name}</span>
            </p>
            <p  style={{fontSize: "20px"}}>  我们来指定第一个小目标吧~</p>
            <p style={{fontSize: "20px"}}>
              做更好的自己
            </p>
          </div>
          <div style={{
                      position: "relative", margin: "auto",
                      width: 200, height: 200, borderRadius: 100,
                      backgroundColor: "yellow", marginTop: "20px",
                      boxShadow:"2px 2px 2px #888888"
                    }}
               onClick={this.show_create_plan}
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
              <span style={{fontSize: "30px"}}>GO</span>
            </div>
          </div>
        </div>
      }

      show_view =<div style={{marginTop:"100px"}}>
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

          return <div style={{border:"1px solid #f2f2f2",padding:"6px",margin:"6px"}}

          >
            <div style={{display:"inline-block",width:"100%"}}
            >
              <div>
                <div style={{display:"inline-block",
                  fontSize:"18px",width:"58%",textAlign:"left"}}
                     onClick={()=>base.goto(`/plan_details/${item.id}`)}
                >{item.name}</div>
                <div style={{display:"inline-block",fontSize:"18px",width:"38%",textAlign:"right"}}>
                 已经完成 <span style={{fontSize:"20px",color:"red",padding:"6px"}}>{item.finished_days}</span>/{item.total_days}天
                </div>
              </div>
            </div>



            <div style={{marginTop:"10px"}}>
              <CProgress percent={0.5} />
            </div>

            {/*<p>{start} - {end}</p>*/}



            <CDaka plan={item_} daka_success={this.componentDidMount} style={{marginTop:"12px"}} />
            {/*<button onClick={()=>this.deletePlan(item.id)}>删除</button>*/}
          </div>
      })

      var new_plan_small_btn = null;
      if(this.state.show_new_plan == false)
        new_plan_small_btn = <button  style={{fontSize:"16px"}} onClick={this.show_create_plan}>
        我还有一个小目标
      </button>

      var show_view = <div style={{marginTop:"10px"}}>
        {plans_}
        {new_plan}
        {new_plan_small_btn}
      </div>
    }

    return (
      <div style={{width:"100%"}}>
        <div style={{backgroundColor:"red",textAlign:"center",padding:"10px"}}>
          <img style={{margin:"auto",width:100,height:100,borderRadius:50,marginTop:30}} src={user.avatar}></img>
          <div style={{margin:"auto",fontSize:"18px"}}>{user.nick_name}</div>
        </div>

        <div style={{textAlign:"center",marginTop:"20px"}}>
          {show_view}
        </div>

      </div>
    )
  }
}

const inner_style = {
  input:{fontSize:"22px",minWidth:"100px",border:"1px solid",marginTop:"10px",padding:"5px"}
}