import * as base from "../../base.js"
import React, {Component} from 'react';
import leftPng from "../../../resource/imgs/array_left.png"

export default class CBack extends Component
{
  constructor(props)
  {
    super(props);
    this.back = this.back.bind(this);
  }

  back(){
    base.back(1);
  }

  render()
  {

    return (
      
        <div onClick={this.back} style={this.props.style}>
          <img alt="" src={leftPng} style={{height: "16px", display: "inline-block", verticalAlign: "top"}}></img>
        </div>
    )
  }
}
