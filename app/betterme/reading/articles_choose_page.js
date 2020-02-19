import React, {Component} from 'react';
import * as base from "../base.js"
import {axios} from "../base.js"
import CArticle from "./components/c_article";
import css from "./css/ireading.css"
import CSeperator from "./components/c_sperator";
const BaseHost = "http://localhost:3100"


export default class ArticlesChoosePage extends Component
{

  constructor(props)
  {
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    super(props);
    this.state = {
      data: {},
      choosedTagIds:[]
    };

    this.load = this.load.bind(this);
    this.audioRef = new Object();
    this.timeoutPlay = null;
  }

  componentDidMount()
  {
    this.load();
    document.addEventListener("keydown", this.onKeyDown)
  }

  toggleTag(id){
    let choosedTagIds = this.state.choosedTagIds  || [];

    let index = choosedTagIds.indexOf(id);
    if( index < 0){
        choosedTagIds.push(id);
    }else{
        choosedTagIds.splice(index,1);
    }

    this.load();
  }

  load()
  {
    var that = this;
    this.setState({loading: true});

    let tag_ids = this.state.choosedTagIds||[];
    let appends = "";
    for(let i = 0; i < tag_ids; i++){
      appends+=`t_ids[]=${tag_ids[i]}&`;
    }

    var id = this.state.id;
    axios.get(`${BaseHost}/reading/show_articles.json?${appends}`).then((res) => {
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
    var articles = this.state.data.articles || [];
    var all_tags = this.state.data.all_tags || [];
    let choosedTagIds = this.state.choosedTagIds  || [];

    console.log("articles", articles);

    var articles_div = articles.map(a => {
      let aa = a;
      return <CArticle a={aa}/>
    })

    var tags_div = all_tags.map(t=>{

      let backgroundColor = null;
      if(choosedTagIds.indexOf(t.id) >= 0){
        backgroundColor = "#5eca59";
      }

      return <div className={css.ibtn} style={{display:"inline-block",borderRadius:"0px",margin:"2px",backgroundColor:backgroundColor}}
                  onClick={()=>this.toggleTag(t.id)}
      >
        {t.name}
      </div>
    })

    return (
      <div style={{padding:"6px"}}>

        <div style={{margin:"8px"}}>
          {tags_div}
        </div>

        <CSeperator/>

        <div style={{margin:"8px"}}>
          {articles_div}
        </div>

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