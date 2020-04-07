import * as base from "../../base.js"
import React, {Component} from 'react';
import Moment from "moment"
import css from "../css/ireading.css"
import readedPng from "../../../resource/imgs/readed.png"
import levelPng from "../../../resource/imgs/level.png"


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
    let img = "https://www.lavafox.com/images/movieImg/48df0ca5-a8d6-4a60-82da-7437be8f97d4.jpg";
    let backgroundColor = "";
    let color= "black";
    let width = this.props.width;
    //let height = width + 50;

    if(finished){
      backgroundColor = "#5eca50 "
      color="white";
    }

    let imgWidth = 0.2*base.width();
    if(imgWidth > 70){
      imgWidth = 70;
    }
    let infoWidth = base.width()-imgWidth-40;
    let height =  imgWidth*4/3;

    return (<div className={css.ibtn} style={{backgroundColor:backgroundColor,verticalAlign:"top",fontSize:"12px",padding: "0px",width:"100%",marginTop:"4px",marginBottom:"14px",height:`${height}px`}}
                 onClick={()=>this.goto(a)}>

      <div  style={{textAlign:"left",display:"inline-block",width:`${imgWidth}px`,height:`${height}px`,verticalAlign:"top"}}>
        <img src={img}  style={{width:`${imgWidth}px`,height:`${height}px`,borderRadius:"4px"}}/>
      </div>

      <div style={{marginLeft:"4px",textAlign:"left",display:"inline-block",width:`${infoWidth}px`,verticalAlign:"top",position:"relative",height:`${height}px`}}>

        <div className={css.smallText} style={{color:"black",overflowX:"hidden", color:color,fontSize:"16px",paddingBottom:"4px"}} >
          <p className={css.smallText} style={{color:"black",fontWeight:"bold"}}>{a.title}</p>
          <p className={css.smallText}>{a.author}</p>
        </div>


        <div className={css.smallText} style={{position:"absolute",bottom:"-2px", color:color,fontSize:"14px",paddingBottom:"4px"}} >
          <div className={[css.box]}>  {a.level||1}<img width={12} src={levelPng} /> </div>
          <div className={[css.box]} style={{marginLeft:"6px"}}> {100} <img width={12} src={readedPng}/></div>
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