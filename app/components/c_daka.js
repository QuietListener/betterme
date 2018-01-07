import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import axios from "axios"
import * as base from "../betterme/base.js"

export default class CDaka extends Component{

  constructor(props)
  {
    super(props)

    this.state={
      show_daka:false,
      thought:null};

    this.valueChange = this.valueChange.bind(this);
    this.show_daka = this.show_daka.bind(this);
    this.create_record = this.create_record.bind(this);
  }

  componentDidMount()
  {
    console.log("componentDidMount",this.state);
  }

  valueChange(e,name)
  {
    var new_value = {}
    new_value[name] = e.target.value,
      this.setState(new_value);
  }


  create_record()
  {
      var desc = this.state.desc;
      var plan_id = this.props.plan.id;
      var that = this;
      axios.post(`${base.BaseHost}/index/create_plan_record.json`,
        {
          plan_id:plan_id,
          desc:desc
        }).then((res)=>{
        if(that.props.daka_success)
            that.props.daka_success();
      })

  }

  show_daka()
  {
    this.setState({show_daka:true});
  }

  render(){
    var show_view = null;

    var plan = this.props.plan;
    if(plan.finished_daka_today == true)
    {
      show_view = <div
        style={{padding:"8px",width:"100%",height:"40px",backgroundColor:"red",color:"white",borderRadius:4,marginTop:10}}
      >
          完成今天的打卡
      </div>
    }
    else if(this.state.show_daka == false)
    {
      show_view = <div
        style={{padding:"8px",width:"100%",height:"40px",backgroundColor:"green",color:"white",borderRadius:4,marginTop:10}}
        onClick={()=>this.show_daka()}
      >
        打卡
      </div>
    }
    else
    {
      show_view = <div style={{padding:"8px",width:"100%",marginTop:10}}>
        <textarea
          style={{width:"100%",border:"1px solid #f2f2f2",fontSize:"16px"}}
          placeholder={"我今天完成了...."}
          value={this.state["desc"]}
          onChange={(event)=>this.valueChange(event,"desc")} />

        <div style={{width:"100%",textAlign:"right"}}>
          <button style={{marginTop:"10px",backgroundColor:"red",color:"white",fontSize:"16px",}} onClick={this.create_record}>确定</button>
        </div>

      </div>
    }

    return show_view;
  }
}
