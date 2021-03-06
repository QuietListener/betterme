import React, {Component} from 'react';
import { connect } from 'react-redux'
import {axios} from "../base.js"
import * as base from "../base.js"
import CArticle from "./components/c_article"
import CArticleCard from "./components/c_article_card"
import css from "./css/ireading.css"
import CSeperator from "./components/c_sperator";
import { get_all_finished_articles, UPDATE_DATA_STATUS} from "../redux/actions/actions";
import {URLS} from "../base";
import CLoading from "./components/c_loading";
import CError from "./components/c_error";


const BaseHost = base.BaseHostIreading();


class ArticlesList_ extends Component
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
  }

  load()
  {
    this.props.dispatch(get_all_finished_articles());
    // var that = this;
    // this.setState({loading: true});
    //
    // let tag_ids = this.state.choosedTagIds||[];
    // let appends = "";
    // for(let i = 0; i < tag_ids; i++){
    //   appends+=`t_ids[]=${tag_ids[i]}&`;
    // }
    //
    // var id = this.state.id;
    // axios.get(`${BaseHost}/reading/finished_articles.json?${appends}`).then((res) => {
    //   console.log("res", res);
    //   that.setState({data: res.data.data});
    //   console.log(that.state);
    //   // that.load_plans(user.id)
    // }).catch(e => {
    //   console.log(e);
    //   this.setState({loading: false});
    // })
  }


  render()
  {
    var tips= base.getTipByLan();
    var data_state = this.props.redux_data.reading[URLS.finished_articles.name]||{};
    var status = data_state["status"] || UPDATE_DATA_STATUS.LOADING;

    if(status == UPDATE_DATA_STATUS.LOADING){
      return (<CLoading />)
    }
    else if(status == UPDATE_DATA_STATUS.FAILED ){
      return <CError refresh={this.load}/>
    }

    var target_data_ =  {};
    if( data_state["data"]){
      target_data_ = data_state["data"]["data"] || {};
    }

    var finished_articles_ = target_data_
    var finished_articles = finished_articles_["finished_articles"]||[];
    var parent_articles = finished_articles_["parent_articles"]||[];
    var pid2article = {}
    for(let i = 0;i  < parent_articles.length; i++){
      pid2article[parent_articles[i].id] = parent_articles[i];
    }

    console.log("finished_articles",finished_articles);

    var articles_div = finished_articles.map(a => {

      let pa = pid2article[a.parent_id];
      return <CArticleCard a={a} pa={pa} finished={true}/>
    })


    // for(let i = 0; i < (base.width()-100)/20;i++){
    //   articles_div.push(<div style={{display:"inline-block",width:"20px",height:"10px"}}></div>)
    // }

    return (
      <div style={{padding:"4px",textAlign:"center"}}>
        {/* <div className={css.middleText}
         style={{textAlign:"center",padding:"6px"}}>{this.props.title||""}</div>
        */}
        {articles_div.length <= 0?
            <div style={{marginTop:"10px",textAlign:"left",color:base.COLOR.gray1}}>{tips.no_finished_articles_tip}</div>
            :articles_div}
      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
    redux_data: state,
  }
}
const ArticlesList = connect(mapStateToProps)(ArticlesList_)
export default ArticlesList;