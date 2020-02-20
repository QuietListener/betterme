import * as base from "../../base.js"
import React, {Component} from 'react';
import Moment from "moment"
import css from "../css/ireading.css"

export default class CArticle extends Component
{
  constructor(props)
  {
    super(props);
    this.goto = this.goto.bind(this);
  }

  goto(a){
    if(a.parent_id ){
      base.goto(`/reading_page/${a.id}`)
    }else{
      base.goto(`/article_group/${a.id}`)
    }

  }

  render()
  {
    let a = this.props.a; //a 是Article
    let finished  = this.props.finished || false; //是否完成

    let backgroundColor = "";
    if(finished){
      backgroundColor = "#5eca59 "
    }
    return (<div className={css.ibtn} style={{backgroundColor:backgroundColor, verticalAlign:"top",fontSize:"12px",padding: "8px", margin: "4px",width:"95%"}}
                 onClick={()=>this.goto(a)}>
      <div className={css.middleText} >
        {a.title}
      </div>
      <div>
        <div className={css.smallText}>Level:{a.level}</div>
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