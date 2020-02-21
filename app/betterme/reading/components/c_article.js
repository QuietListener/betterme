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
    let img = "https://imagev2.xmcdn.com/group60/M0A/3F/E4/wKgLb1zWy-miCIJLAAAow7cctg8198.jpg!op_type=3&columns=144&rows=144&magick=webp";
    let backgroundColor = "";
    let color= "black";
    let width = this.props.width;
    let height = width + 50;

    if(finished){
      backgroundColor = "#5eca59 "
      color="white";
    }
    return (<div className={css.ibtn} style={{backgroundColor:backgroundColor,verticalAlign:"top",fontSize:"12px",padding: "2px", margin: "4px",width:`96%`,height:`76px`}}
                 onClick={()=>this.goto(a)}>

      <div  style={{textAlign:"left",display:"inline-block",width:"70px",verticalAlign:"top"}}>
        <img src={img}  style={{width:"70px",borderRadius:"4px"}}/>
      </div>

      <div style={{marginLeft:"4px",textAlign:"left",display:"inline-block",width:"60%",verticalAlign:"top",position:"relative",height:"70px"}}>

        <div className={css.middleText} style={{overflowX:"hidden", color:color,fontSize:"16px",paddingBottom:"4px",height:"45px"}} >
          {a.title}
        </div>


        <div className={css.middleText} style={{position:"absolute",bottom:"-2px", color:color,fontSize:"16px",paddingBottom:"4px"}} >
          level:{a.level}   {100} listen
        </div>

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