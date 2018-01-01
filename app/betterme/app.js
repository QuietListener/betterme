import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import  '../css/app.css';


const avatar = "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTInk6tZfjiaebxVTn2TkN0ImuRYGyg3p19uUPMSFyU1GD4vrj3yh2C2E7SLsC7rgibOu0sCAUZedK6g/0"
const user_name = "君君"


const PlanName = "plan_name";
const Start = "start";
const End = "end";

export default class App extends Component{

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

    this.canel_new_plan = this.canel_new_plan.bind(this);
    this.show_create_plan = this.show_create_plan.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.create_new_plan = this.create_new_plan.bind(this);
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

      this.setState({plans:plans,show_new_plan:false});
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

    var plans = this.state.plans;
    var new_plan = null;

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
            <p style={{fontSize: "25px"}}> Hello~ <span>{user_name}</span></p>
            <p style={{fontSize: "20px"}}>
              做更好的自己,制定第一个小目标吧
            </p>
          </div>
          <div style={{
                      position: "relative", margin: "auto",
                      width: 200, height: 200, borderRadius: 100,
                      backgroundColor: "yellow", marginTop: "20px"
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
          return <div>
            <p>{item.plan_name}</p>
            <p>{item.start} --> {item.end}</p>
            <button onClick={()=>this.deletePlan(item.id)}>删除</button>
          </div>
      })

      var new_plan_small_btn = null;
      if(this.state.show_new_plan == false)
        new_plan_small_btn = <button  onClick={this.show_create_plan}>
        我还有一个小目标
      </button>

      var show_view = <div>
        {plans_}
        {new_plan}
        {new_plan_small_btn}
      </div>
    }

    return (
      <div style={{width:"100%"}}>
        <div style={{backgroundColor:"red",textAlign:"center",padding:"10px"}}>
          <img style={{margin:"auto",width:100,height:100,borderRadius:50,marginTop:30}} src={avatar}></img>
          {/*<div style={{margin:"auto",fontSize:"18px"}}>{user_name}</div>*/}

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