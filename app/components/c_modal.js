import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import * as base from "../betterme/base.js"
import "../css/new_plan_flow.css"

export default class CModal extends Component{

  constructor(props)
  {
    super(props)
  }


  render()
  {

    return (
      <div style={{position:"absolute",top:0,left:0,
        width:"100%",height:"100%",textAlign:"center",color:"white",
        backgroundColor:"rgba(0,0,0,0.5)"}}>
        {this.props.children}
      </div>
    );
  }

}
