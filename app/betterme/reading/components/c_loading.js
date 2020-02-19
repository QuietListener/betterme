import * as base from "../../base.js"
import React, {Component} from 'react';
import Moment from "moment"
import css from "../css/ireading.css"
import loadingGif from "../../../resource/imgs/Spinner.gif"

export default class CLoading extends Component
{
  constructor(props)
  {
    super(props);
  }


  render()
  {

    return (
      <div style={Object.assign({fontSize: "12px",width:"100%",textAlign:"center"},this.props.style||{})}>
        <img src={loadingGif} alt="" style={{width: "20px", height: "20px"}}>

        </img>
      </div>)
  }
}
