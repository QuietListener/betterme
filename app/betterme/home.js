import React, {Component} from 'react';
import config from '../conf/config.json';
import * as base from "./base.js"
import _ from "lodash"
import  '../css/app.css';
import NewPlanFlow from "../components/new_plan_flow.js"
import axios from "axios"

import CDaka from "../components/c_daka.js"
import CProgress from "../components/c_progress.js"


import moment from "moment"
import DatePicker  from 'material-ui/DatePicker';
import TextField   from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
const ControlPoint = require('react-icons/lib/md/control-point');
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
const PlanName = "plan_name";
const Start = "start";
const End = "end";

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
    this.handleClose = this.handleClose.bind(this);
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


  check_date(from,to,span)
  {
    console.log("check_date",from,to)
    if(from != null)
    {
      var today =moment().startOf("day")

      if(from - today < 0 )
      {
        this.setState({new_plan_msg:`开始时间要在${today.format(base.DateFormat)}之后喔~`})
        return false;
      }
    }

    if(from == null || to == null)
      return true;

    let min_seconds = to-from ;
    var days = min_seconds*1.0/base.DayMinSeconds;
    if(days > span)
    {
      this.setState({new_plan_msg:`这个目标太大了，最好不要超过${span}天`})
      return false;
    }  

    return true;
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

  handleClose()
  {
    this.setState({open: false});
  };

  render(){

    var user = this.state.user;
    if(user == null)
      return null;

    var plans = this.state.plans;
    var new_plan = null;

    //plans = [];
    if(this.state.show_new_plan == true)
    {
      const actions = [
        <FlatButton
          label="取消"
          primary={true}
          onClick={this.handleClose}
        />,
      ];

       new_plan = <div style={{position:"absolute",top:0,left:0,
         width:"100%",height:"100%",
         backgroundColor:"rgba(0,0,0,0.5)"
       }}
       >
           <div style={{position:"absolute", height:"200px",
                        width:"100%",backgroundColor:"rgba(0,0,0,0.1)"
           }}
                onClick={()=>{this.setState({show_new_plan:false})}}
           />

            <div style={{margin:"auto",backgroundColor:"white",marginTop:"200px",margin:"8px",borderRadius:"4px"}}>

              <div style={{textAlign:"center",marginBottom:"1px",marginTop:"20px",marginTop:"20px"}}>
                  <p style={{padding:"9px",fontSize:"25px",color:base.COLOR.red}}>{base.slogon1}</p>
              </div>

                 <div style={{textAlign:"center",marginBottom:"1px"}}>
                  {/*<input style={inner_style.input}*/}
                         {/*value={this.state.plan_name}*/}
                         {/*placeholder={"输入我要制定的目标"}*/}
                         {/*onChange={(event)=>this.valueChange(event,PlanName)} />*/}

                   <TextField
                     hintText={"我的目标名字"}
                     value={this.state.plan_name}
                     onChange={(event,new_value)=>this.setState({plan_name:new_value})}
                   />
                 </div>


                 <div style={{textAlign:"center"}}>

                   <DatePicker value={this.state.start} hintText="开始日期" autoOk={true}
                               formatDate={(date)=>{return base.formatDate1(date)}}
                               onChange={(event,newValue)=>{
                                 console.log(newValue);
                                 let ret = this.check_date(newValue,this.state.end,7);
                                 if(ret == false)
                                 {
                                   this.setState({open:true})
                                   return;
                                 }
                                 this.setState({start:newValue})

                               }}/>

                   <DatePicker value={this.state.end} hintText="结束日期" autoOk={true}
                               formatDate={(date)=>{return base.formatDate1(date)}}
                               onChange={(event,newValue)=>{
                                 console.log(newValue);
                                 let ret = this.check_date(this.state.start,newValue,7);
                                 if(ret == false)
                                 {
                                   this.setState({open:true})
                                   return;
                                 }

                                 this.setState({end:newValue})
                               }}/>
                 {/*<input style={inner_style.input}*/}
                        {/*value={this.state.start}*/}
                        {/*placeholder={"开始日期"}*/}
                        {/*onChange={(event)=>this.valueChange(event,Start)} />*/}

                 {/*<input style={inner_style.input}*/}
                        {/*value={this.state.end}*/}
                        {/*placeholder={"结束日期"}*/}
                        {/*onChange={(event)=>this.valueChange(event,End)} />*/}


                   <RaisedButton label={"取消"} primary={true} style={{margin:"10px"}} onClick={this.canel_new_plan}  ></RaisedButton>

                  <RaisedButton label={"制定小目标"} secondary={true} style={{margin:"10px"}} onClick={this.create_new_plan} ></RaisedButton>
                 </div>
            </div>

             <div style={{position:"absolute",height:"150px",
                          width:"100%", backgroundColor:"rgba(0,0,0,0.5)"}}
                  onClick={()=>{this.setState({show_new_plan:false})}}
             />


         <Dialog
           title=""
           actions={actions}
           modal={false}
           open={this.state.open}
           onRequestClose={this.handleClose}
         >
           {this.state.new_plan_msg}
         </Dialog>

       </div>
    }

    var show_view = null;
    if(plans.length == 0 )
    {
      var add_btn = null;

      if(this.state.show_new_plan == false)
      {
        add_btn = <div>
          <div style={{marginTop: "20px"}}>
            <p style={{fontSize: "18px",color:"black"}}>
              <span style={{fontSize:"28px",padding:"8px",color:base.COLOR.red}}>@{user.nick_name}</span>
            </p>
            <p  style={{fontSize: "20px",color:"black",fontSize: "18px"}}> 我们来制定你第一个小目标吧~</p>
          </div>
          <div style={{
                      position: "relative", margin: "auto",
                      width: 200, height: 200, borderRadius: 100,
                      backgroundColor: base.COLOR.red, marginTop: "20px",
                      boxShadow:"0 4px 8px hsla(0,0%,71%,.8)"
                    }}
               onClick={this.show_create_plan
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

          return <div style={{border:"1px solid #fff",
                              backgroundColor:"white",
                              padding:"20px",paddingTop:"2px",margin:"10px",borderRadius:"4px",
                              boxShadow:"0 4px 8px hsla(0,0%,71%,.8)"

          }}
          >
            <div style={{display:"inline-block",width:"100%"}}>
              <div style={{}}>

                <div style={{padding:"4px",display:"inline-block",color:base.COLOR.red, fontSize:"18px",width:"100%",textAlign:"center"}}
                     onClick={()=>base.goto(`/plan_details/${item.id}`)}
                >{item.name}</div>

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
            <CDaka plan={item_} daka_success={this.componentDidMount} style={{}} />
            {/*<button onClick={()=>this.deletePlan(item.id)}>删除</button>*/}
          </div>
      })

      var new_plan_small_btn = null;
      if(this.state.show_new_plan == false)
        new_plan_small_btn = <button  style={{fontSize:"16px",backgroundColor:base.COLOR.red,color:"white",borderRadius:"4px",marginTop:"10px",padding:"8px"}} onClick={this.show_create_plan}>
          <ControlPoint style={{fontSize:"18px",marginRight:"4px",marginBottom:"2px"}}/>
        <span>我还有一个小目标</span>
      </button>

      var show_view = <div style={{marginTop:"10px"}}>
        {plans_}

        {new_plan_small_btn}
      </div>
    }

    return (
      <div style={{width:"100%"}}>
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