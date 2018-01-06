import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import * as base from "../betterme/base.js"
import "../css/new_plan_flow.css"

const Name="name";
const Start = "start";
const End = "end";

export default class NewPlanFlow extends Component{

  constructor(props)
  {
    super(props)
    this.state={step:0}
    this.valueChange = this.valueChange.bind(this);
  }

  valueChange(e,name)
  {
    var new_value = {}
    new_value[name] = e.target.value,
    this.setState(new_value);
  }

  render()
  {
    var show_view = null;
    if(this.state.step == 0)
    {
        show_view = <div>
          <div>
            <input value={this.state[Name]} onChange={(event)=>this.valueChange(event,Name)}/>
          </div>
        </div>
    }
    if(this.state.step == 1)
    {
      show_view = <div>
          <p>{this.state[Name]}</p>
           <div>
             <p>开始时间</p>
             <input value={this.state[Start]} onChange={(event)=>this.valueChange(event,Start)}/>
             <p>结束时间</p>
             <input value={this.state[End]} onChange={(event)=>this.valueChange(event,End)}/>
           </div>
      </div>
    }

    var name = "下一步";
    if(this.state.step == 1)
    {
        name = "完成"
    }

    return (
      <div style={{position:"absolute",top:0,left:0,
        width:"100%",height:"100%",textAlign:"center",color:"white",
        backgroundColor:"rgba(0,0,0,0.6)"}}>
       <div style={{marginTop:"30%"}}>
         <div>{base.slogon}</div>
        <div>
        {show_view}
        </div>
        <div onClick={()=>this.setState({step:this.state.step+1})}>{name}</div>
       </div>
      </div>
    );
  }

}
