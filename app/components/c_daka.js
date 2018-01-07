import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import axios from "axios"
import * as base from "../betterme/base.js"

export default class CDaka extends Component{

  constructor(props)
  {
    super(props)
    var plan = this.props.plan

    this.state={plan:plan,
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
      var plan_id = this.state.plan.id;
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

    if(this.state.show_daka == false)
    {
      show_view = <div onClick={()=>this.show_daka()}>
          打卡
      </div>
    }
    else
    {
      show_view = <div>
        <textarea value={this.state["desc"]} onChange={(event)=>this.valueChange(event,"desc")} />
        <button onClick={this.create_record}>确定</button>
      </div>
    }

    return (<div>
      {show_view}
    </div>)
  }
}
