import * as base from "../../base.js"
import React, {Component} from 'react';
import Moment from "moment"

export default class CArticle extends Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    let a = this.props.a; //a 是Article
    return (<div style={{"border": "1px solid", padding: "2px", margin: "4px"}}>
      <div>{a.title}</div>
      <div>{a.id} | {a.created_at}
        <div style={inner_style.btn}  onClick={()=>base.goto(`/article/${a.id}`)}>detail</div>
      </div>
    </div>)
  }
}


const inner_style = {
  part: {display: "inline-block", verticalAlign: "top", width: "44%", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"},
  box: {"padding": "2px", "margin": "4px"},
  btn: {display: "inline-block", verticalAlign: "top","padding": "2px", "margin": "4px",border:"1px solid"}
}