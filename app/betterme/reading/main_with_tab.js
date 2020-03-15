import React, {Component} from 'react';
import * as base from "../base.js"
import {axios} from "../base.js"
import CCalendar from "./components/c_calendar.js"
import css from "./css/ireading.css"
import Moment from "moment"
import CSeperator from "./components/c_sperator";
import ArticlesChoosePage from "./articles_choose_page"
import MinePage from "./mine_page.js"

import ArticleList from "./articles_list.js"

import articlePng from "../../resource/imgs/article.png";
import articlePngHilight from "../../resource/imgs/article_hilight.png";
import userPng from "../../resource/imgs/user_.png";
import userPngHilight from "../../resource/imgs/user_hilight.png";
import finishedPng from "../../resource/imgs/finished_.png";
import finishedPngHilight from "../../resource/imgs/finished_hilight.png";

const BaseHost = base.BaseHostIreading();

const FlagMine = 1;
const FlagArticle = 2;
const FlagArticleOk = 3;


export default class MainPageWithTab extends Component
{

  constructor(props)
  {
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    super(props);

    this.tabMap = {}
    this.tabMap[FlagArticle] = {normal:articlePng,hilight:articlePngHilight};
    this.tabMap[FlagArticleOk] = {normal:finishedPng,hilight:finishedPngHilight};
    this.tabMap[FlagMine] =  {normal:userPng,hilight:userPngHilight};
    this.tabFlags = [FlagArticle,FlagArticleOk,FlagMine]

    this.state = {
      data: {},
      flag: FlagArticle
    };

    this.choose = this.choose.bind(this);

  }

  componentDidMount()
  {
  }

  choose(id){
    this.setState({flag:id})
  }

  render()
  {
    let showView = null;

    let flag = this.state.flag || FlagArticle;
    if(flag == FlagArticle){
      showView =  <ArticlesChoosePage />
    }else if (flag == FlagMine){
      showView = <MinePage />
    }else{
      showView = <ArticleList title={"finished articles"}/>
    }

    var hilighted = {};
    var tabsView = [];
   for( let i = 0; i < this.tabFlags.length ; i++){
     let key =  this.tabFlags[i];
     let style = Object.assign(inner_style.tabItem,{borderRight: "0px"});
     let hilight = false;
     if(key == this.state.flag){
       hilight = true;
     }

     let tab = <div style={style}
          onClick={()=>this.choose(key)}>
       <img src={hilight? this.tabMap[key]["hilight"]: this.tabMap[key]["normal"]} width={20} height={20}/>
     </div>

      tabsView.push(tab);
   }

    return (

      <div className={css.tabContentDiv} style={{height:"100%",overflow: "hidden"}}>
        <div style={{paddingBottom:"60px"}} >
        {showView}
        </div>
        <div style={{position: "fixed", zIndex:10000,bottom: "0px", width:"100%", minHeight: "50px",textAlign:"center"}}>
          {tabsView}
        </div>
      </div>
    );
  }
}

const inner_style = {
  statistics_item: {width: "33.333%", display: "inline-block", border: "1px solid #e9e4d9"},
  statistics_count: {fontSize: "20px", fontWeight: "bold", textAlign: "center"},
  statistics_title: {fontSize: "12px", fontWeight: "normal", textAlign: "center", padding: "4px,0,4px 0"},
  tabItem: {
    display: "inline-block",
    minHeight: "50px",
    paddingTop:"15px",
    verticalAlign: "top",
    fontSize: "10px",
    textAlign: "center",
    width: "33.2%",
    backgroundColor:"white",
    boxShadow:"0px -2px 2px #e5e5e5"
  },

  part: {display: "inline-block", verticalAlign: "top", width: "44%", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"},
  box: {"padding": "2px", "margin": "4px"},
  btn: {display: "inline-block", verticalAlign: "top", "padding": "2px", "margin": "4px", border: "1px solid"}
}