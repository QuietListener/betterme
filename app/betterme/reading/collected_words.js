import React, {Component} from 'react';
import {axios} from "../base.js"
import * as base from "../base.js"
import CArticle from "./components/c_article"
import css from "./css/ireading.css"
import CSeperator from "./components/c_sperator";

const BaseHost = base.BaseHostIreading();

export default class CollectedWords extends Component
{

  constructor(props)
  {
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    super(props);
    this.state = {
      data: {}
    };

    this.load = this.load.bind(this);
    this.audioRef = new Object();
    this.timeoutPlay = null;
  }

  componentDidMount()
  {
    this.load();
  }


  load()
  {
    var that = this;
    this.setState({loading: true});

    axios.get(`${BaseHost}/reading/collected_words.json`).then((res) => {
      console.log("res", res);
      that.setState({data: res.data.data});
      console.log(that.state);
      // that.load_plans(user.id)
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
    })
  }

  render()
  {
    let words = this.state.data || [];

    let words_div = [];
    for(let key in words){
        let word = words[key];
        let div_ = <div  style={{margin:"4px"}}>
          {word.text}
        </div> 
        words_div.push(div_)
    }

    return (
      <div>
        <div className={css.bigText} style={{padding:"6px"}}>{this.props.title||""}</div>
          {words_div}
      </div>
    );
  }
}

const inner_style = {
  part: {display: "inline-block", verticalAlign: "top", width: "44%", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"},
  box: {"padding": "2px", "margin": "4px"},
  btn: {display: "inline-block", verticalAlign: "top","padding": "2px", "margin": "4px",border:"1px solid"}
}