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
    let pa = this.props.pa ||{}; //a 是Parent Article
    let a = this.props.a||{}; //a 是Article
    let finished  = this.props.finished || false; //是否完成
    let img = a.img || pa.img;
    let backgroundColor = "rgb(211,211,211,0.2)";
    let color= base.COLOR.gray1;
   
    let width = this.props.width || base.width();
    console.log("final width",width)
    //let height = width + 50;

    let border = null;
    if(finished){
      backgroundColor = "#5eca50 "
      color="white";
    }


    let imgWidth = 0.3*width;
    if(imgWidth > 190){
        imgWidth = 190;
    }
    let infoWidth = imgWidth;//width-imgWidth-40;
    let height =  imgWidth*4/3;
    let title = a.title;
    let author = a.author;
    if(base.isZh()){
      title = a.title_cn;
      author = a.author_cn;
    }

    //let title = (pa && pa.title) ? pa.title+":  "+a.title: a.title;
    return (<div className={css.ibtn} style={{border:border,position:"relative",backgroundColor:backgroundColor,verticalAlign:"top",fontSize:"12px",padding: "0px",width:`${infoWidth}px`,marginTop:"4px",marginBottom:"14px",margin:"2px", height:`${height+60}px`,textAlign:"center",marginLet:"2px"}}
                 onClick={()=>this.goto(a)}>

      {img?<div  style={{textAlign:"left",display:"inline-block",width:`${imgWidth}px`,height:`${height}px`,verticalAlign:"top"}}>
        <img src={img}  style={{width:`${imgWidth}px`,height:`${height-4}px`,borderRadius:"4px",marginTop:"0px"}}/>
      </div>:null}

      <div style={{marginLeft:"4px",textAlign:"left",display:"inline-block",width:`${infoWidth}px`,verticalAlign:"top",position:"relative",height:`${height}px`}}>

        <div className={css.smallText} style={{paddingTop:"4px",overflowX:"wrap", color:color,fontSize:"10px",paddingBottom:"1px"}} >
          <p className={css.smallText} style={{color:color,fontWeight:"bold",    overflowX: null, textOverflow: "ellipsis",fontSize:"10px"}}>{title}</p>
          <p className={css.smallText} style={{color:color,marginTop:"2px"}}>{author}</p>
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