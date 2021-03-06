import * as base from "../../base.js"
import React, {Component} from 'react';
import Moment from "moment"
import css from "../css/ireading.css"
import readedPng from "../../../resource/imgs/readed.png"
import levelPng from "../../../resource/imgs/level.png"


export default class CArticleCard extends Component
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
    //let height = width + 50;

    if(finished){
      backgroundColor = base.COLOR.gray1;
      color="white";
    }


    
    let totalWidth = base.width()*0.9;
    let imgWidth = 0.28*totalWidth;
    if(imgWidth > 70){
      imgWidth = 70;
    }
    let infoWidth = totalWidth - imgWidth-10;
    let height =  imgWidth*4/3;

    let title = a.title;
    let author = a.author;
    let title_cn = a.title_cn;
    let is_cn =  base.isZh();

    //let title = (pa && pa.title) ? pa.title+":  "+a.title: a.title;
    return (<div className={css.ibtn} style={{position:"relative",backgroundColor:backgroundColor,verticalAlign:"top",fontSize:"12px",padding: "0px",width:`${totalWidth}`,marginTop:"4px",marginBottom:"14px",height:`${height}px`}}
                 onClick={()=>this.goto(a)}>

      {img?<div  style={{textAlign:"left",display:"inline-block",width:`${imgWidth}px`,height:`${height}px`,verticalAlign:"top"}}>
        <img src={img}  style={{width:`${imgWidth}px`,height:`${height-4}px`,borderRadius:"4px",marginTop:"2px"}}/>
      </div>:null}

      <div style={{marginLeft:"4px",textAlign:"left",display:"inline-block",width:`${infoWidth}px`,verticalAlign:"top",position:"relative",height:`${height}px`}}>

        <div className={css.smallText} style={{paddingTop:"4px",overflowX:"hidden", color:color,fontSize:"16px",paddingBottom:"4px"}} >
         {is_cn? <p className={css.smallText} style={{color:color,fontWeight:"bold",    overflowX: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",fontSize:"18px"}}>{title_cn}</p> : null}
          <p className={css.smallText} style={{color:color,fontWeight:"normal",    overflowX: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",fontSize:"15px"}}>{title}</p>
         
        </div>


        <div className={css.smallText} style={{position:"absolute",bottom:"-2px", color:color,fontSize:"14px",paddingBottom:"4px"}} >
          <div className={[css.box]} style={{color:color,background:backgroundColor}}> 
          {/* <img width={12} src={levelPng} />  */}
         
          <span style={{fontSize:"12px",color:color}}> L{a.level||1} </span></div>
          {/*<div className={[css.box]} style={{marginLeft:"10px",color:"#2F4F4F"}}> <img width={12} src={readedPng}/>  {100}</div>*/}
        </div>

      </div>
      {finished? <div className={[css.box]} style={{position:"absolute",color:color,fontWeight:"bold",fontSize:"12px", bottom:"4px", right:"4px"}}> FINISHED</div> : null}

    </div>)
  }
}


const inner_style = {
  part: {display: "inline-block", verticalAlign: "top", width: "44%", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"},
  box: {"padding": "2px", "margin": "4px"},
  btn: {display: "inline-block", verticalAlign: "top","padding": "2px", "margin": "4px",border:"1px solid"}
}