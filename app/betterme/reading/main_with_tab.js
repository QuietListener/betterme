import React, {Component} from 'react';
import * as base from "../base.js"
import {axios} from "../base.js"
import CCalendar from "./components/c_calendar.js"
import css from "./css/ireading.css"
import Moment from "moment"
import CSeperator from "./components/c_sperator";
import ArticlesChoosePage from "./articles_choose_page"
import MinePage from "./mine_page.js"

const BaseHost = "http://localhost:3100"

const FlagMine = 1;
const FlagArticle = 2;

export default class MainPageWithTab extends Component
{

  constructor(props)
  {
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    super(props);
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
    }else{
      showView = <MinePage />
    }

    var hilighted = { background: "black", color : "white"};
    return (

      <div style={{}}>
        <div>
          {showView}
        </div>


        <div style={{position: "absolute", bottom: "0px", width: "100%", height: "40px"}}>


          <div style={Object.assign({},inner_style.tabItem,{borderRight: "0px"},flag == FlagArticle?hilighted:{})}
               onClick={()=>this.choose(FlagArticle)}>
            <span>Articles</span>
          </div>

          <div style={Object.assign({}, inner_style.tabItem,flag == FlagMine?hilighted:{})}
               onClick={()=>this.choose(FlagMine)}>
            <span>Mine</span>
          </div>

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
    height: "40px",
    paddingTop: "10px",
    verticalAlign: "top",
    fontSize: "10px",
    textAlign: "center",
    width: "49.4%",
    border: "1px solid"
  },

  part: {display: "inline-block", verticalAlign: "top", width: "44%", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"},
  box: {"padding": "2px", "margin": "4px"},
  btn: {display: "inline-block", verticalAlign: "top", "padding": "2px", "margin": "4px", border: "1px solid"}
}