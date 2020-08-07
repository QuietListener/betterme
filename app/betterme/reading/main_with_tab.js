import React, {Component} from 'react';
import { connect } from 'react-redux'
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

import {test,get_all_articles,get_all_finished_articles,setSettingData} from "../redux/actions/actions"

class MainPageWithTab_ extends Component
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
    this.props.dispatch(test("aaa"))


    try {
      this.props.dispatch(get_all_articles());
    }catch (e) {
      console.error(e);
    }
    try {
      this.props.dispatch(get_all_finished_articles());
    }catch (e) {
      console.error(e);
    }
  }

  choose(id){

    this.props.dispatch(setSettingData({flag:id}));
    this.setState({flag:id});
  }

  render()
  {
    let showView = null;
    let tips = base.getTipByLan();
    let setting_data = this.props.redux_data.setting_data || {};
    console.log("setting_data",setting_data);

    let flag = setting_data.flag || FlagArticle;
    
    if(flag == FlagArticle){
      showView =  <ArticlesChoosePage key={12121}/>
    }else if (flag == FlagMine){
      showView = <MinePage  key={121213} />
    }else{
      showView = <ArticleList title={"finished articles"}  key={121214}/>
    }

    console.log("this.props.redux_data--",this.props.redux_data);

    var hilighted = {};
    var tabsView = [];
     
   var tabBottom =  base.screenWidth() < 600;

   for( let i = 0; i < this.tabFlags.length ; i++){
     let key =  this.tabFlags[i];
     let style = {}
     if(tabBottom == true){
      style = Object.assign(inner_style.tabItem,{borderRight: "0px"});;
     }else{
      style = Object.assign(inner_style.tabItem,{borderRight: "0px", width:"40px",background:base.COLOR.gray});
     }

     let hilight = false;
     if(key == flag){
       hilight = true;
     }

     let tab = <div style={style}
          onClick={()=>this.choose(key)}>
       <img src={hilight? this.tabMap[key]["normal"]: this.tabMap[key]["normal"]} width={20} height={20}/>
       {hilight?<div style={{margin:"auto",border:"1px solid gray",height:"1px",width:"30px"}}></div>:null}
     </div>

      tabsView.push(tab);
   }


   let tabDiv = null;
   if(tabBottom){ //在底部
    tabDiv = <div key={"keyaaaaa"+flag} style={{position: "fixed", display:"relative",zIndex:10000,bottom: "0px", width:"100%", maxWidth:`${base.maxWidth}px`, minHeight: "50px",textAlign:"center"}}>
           {tabsView}
        </div>;
   }else{
    tabDiv = <div key={"keyaaaaa"+flag} style={{textAlign:"left",position: "relative", display:"relative",backgroundColor:base.COLOR.gray,top: "0px", width:"100%", maxWidth:`${base.maxWidth}px`, minHeight: "50px",textAlign:"center"}}>
        
      
       <div style={{width:"48%",display:"inline-block",textAlign:"Left",verticalAlign:"middle"}}>
         <p style={{marginTop:"10px",fontSize:"16px",fontWeight:"bold",color:base.COLOR.gray1}}> 
         <img   src="/logo-11.png" width={30} height={30} />
         {tips.productName}</p>
        </div>
        <div style={{width:"48%",display:"inline-block",textAlign:"right",verticalAlign:"top"}}>{tabsView}</div>
    </div>;
   }


    return (

     
      <div className={css.tabContentDiv} style={{height:"100%",overflow: "hidden"}}>
         {tabDiv}
        <div style={{paddingBottom:"60px"}} >
        {showView}
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

const mapStateToProps = state => {
  return {
    redux_data: state,
  }
}
const MainPageWithTab = connect(mapStateToProps)(MainPageWithTab_)
export default MainPageWithTab;