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
import CPicker from "../components/c_picker.js"

const PlanName = "plan_name";
const Start = "start";
const End = "end";

import init_share from "../lib/weixin_share.js"
import CReward from "../components/c_reward";
import CTimepicker from "../components/c_timepicker";

const PlanTypeIng = 0
const PlanTypeOverdue = 1
export default class Test extends Component{

  constructor(props)
  {
      super(props);
      this.value_changed = this.value_changed.bind(this);
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

  value_changed(values)
  {
    console.log("value_changed",values);
  }

  render()
  {

    var default_option_groups = [
      [["01时",1],["02时",2],["03时",3],["04时",4]],
      [["1分",1],["2分",2],["3分",3]]
    ];
    var default_value_indexes = [1,2];

    return <div>
        <CTimepicker hours={3} minutes={10}/>
        <div style={{margin:"auto"}}>
        <CPicker style={{width:"70%",margin:"auto",textAlign:"center",border:"1px solid black",padding:20}}
                 item_style={{fontSize:"24px",minWidth:"100px"}}
                 show_item_style={{fontSize:"26px",minHeight:60,minWidth:"100px",color:"red"}}
                 value_changed={this.value_changed}
                 option_groups={default_option_groups}
                 default_value_indexes={default_value_indexes}></CPicker>
        </div>
      </div>
  }
}

const inner_style = {
   stat_row:{
     borderRadius:"4px",
     padding:"6px",
     fontSize:"14px",
     margin:"8px"
   }
}