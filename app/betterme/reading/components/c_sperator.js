import * as base from "../../base.js"
import React, {Component} from 'react';
import Moment from "moment"

export default class CSeperator extends Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (<div style={Object.assign({"borderTop": "1px solid #f2f2f2  ", margin: "0px",width:"100%"},this.props.style||{})}>
    </div>)
  }
}
