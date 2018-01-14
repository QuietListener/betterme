import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import axios from "axios"
import * as base from "../betterme/base.js"

export default class CProgress extends Component{

  constructor(props)
  {
    super(props)
    var plan = this.props.plan
  }


  render(){

    var percent = this.props.percent*100;
    var percent_str = `${percent}%`;
    return (<div style={{width:"100%",height:"6px",backgroundColor:"#f2f2f2",border:"1px solid #f2f2f2",borderRadius:"2px"}}>
              <div style={{width:percent_str,height:"6px",backgroundColor:base.COLOR.blue,borderRadius:"5px"}}></div>
    </div>)
  }
}
