import React, {Component} from 'react';
import { connect } from 'react-redux'
import * as base from "../base.js"
import {axios,URLS} from "../base.js"
import CArticle from "./components/c_article";
import css from "./css/ireading.css"
import CSeperator from "./components/c_sperator";
import CLoading from "./components/c_loading.js"
import CError from "./components/c_error.js"
import {get_all_articles, get_all_finished_articles, UPDATE_DATA_STATUS} from "../redux/actions/actions"
import {Articles} from "../redux/actions/actions"

const BaseHost = base.BaseHostIreading();

class ArticlesChoosePage__ extends Component
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
    // if( index < 0){
    //     choosedTagIds = [];
    //     choosedTagIds.push(id);
    // }else{
    //     choosedTagIds.splice(index,1);
    // }

    choosedTagIds = [id];

    this.setState({choosedTagIds:choosedTagIds})
    console.log("choosedTagIds",choosedTagIds);
  }

  load()
  {
    this.props.dispatch(get_all_articles());
    this.props.dispatch(get_all_finished_articles());
    // var that = this;
    // this.setState({loading: true});
    //
    // let tag_ids = this.state.choosedTagIds||[];
    // let appends = "";
    // console.log("tag_ids",tag_ids);
    // for(let i = 0; i < tag_ids.length; i++){
    //   if(tag_ids[i]) {
    //     appends += `t_ids[]=${tag_ids[i]}&`;
    //   }
    // }
    //
    // var id = this.state.id;
    // var url__ = `${BaseHost}/reading/show_articles.json?${appends}`;
    // console.log("url__",url__);
    //
    // axios.get(url__).then((res) => {
    //   console.log("res", res);
    //   that.setState({data: res.data.data});
    //   console.log(that.state);
    //   // that.load_plans(user.id)
    //   this.setState({loading: false,loadError:false});
    // }).catch(e => {
    //   console.log(e);
    //
    //   this.setState({loadError: true,loading:false});
    // })
  }

  render()
  {

    let isZh = base.isZh();
    var articles_data_state = this.props.redux_data.reading[URLS.all_articles.name]||{};
    var status = articles_data_state["status"] || UPDATE_DATA_STATUS.LOADING;

    if(status == UPDATE_DATA_STATUS.LOADING){
      return (<CLoading />)
    }
    else if(status == UPDATE_DATA_STATUS.FAILED ){
      return <CError refresh={this.load}/>
    }

    var articles_data_ =  {};
    if( articles_data_state["data"]){
      articles_data_ = articles_data_state["data"]["data"];
    }

    console.log("articles_data_",articles_data_);
    var articles_ = articles_data_.articles || [];
    var finished_article_ids = articles_data_.finished_article_ids || [];
    var all_tags = articles_data_.all_tags || [];
    var tag_2_articles = articles_data_.tag_2_articles || {};
    let choosedTagIds = this.state.choosedTagIds  || [];
    finished_article_ids = finished_article_ids.map(t=>parseInt(t));
    console.log("finished_article_ids",finished_article_ids);

    var articles = []
    if(choosedTagIds.length<=0 ||  choosedTagIds[0] < 0){
      articles = articles_;
    }else{
      let tag_id = choosedTagIds[0];
      let choosed_article_ids = tag_2_articles[tag_id]||[];
      console.log("choosed_article_ids",choosed_article_ids);
      for(let j = 0; j < articles_.length; j++){
        let aa = articles_[j];
        if(choosed_article_ids.indexOf(aa.id) >=0){
          articles.push(aa);
        }
      }
    }
    console.log("articles", articles);

    //let articleWidth = base.width()-40;
    var articles_div = articles.map(a => {
      let aa = a;
      let finished = (finished_article_ids.indexOf(a.id) >= 0)
      return <CArticle a={aa} width={null} finished={finished}  key={"article_id__"+aa.id}/>
    })

    for(let i = 0; i < (base.width()-100)/20;i++){
      articles_div.push(<div style={{display:"inline-block",width:"20px",height:"10px"}}></div>)
    }
    
    if(all_tags.filter(t=>t.id==-1).length == 0){
      all_tags.splice(0,0,{id:-1,name:"All",name_cn:"所有"});
    }

    var tags_div = all_tags.map(t=>{

      let color ="black";
      let fontWeight = "";
      let borderBottom = ""
      if(choosedTagIds.indexOf(t.id) >= 0){
        borderBottom = "2px solid";
        fontWeight = "bold"
      }

      let name = isZh?t.name_cn : t.name;

      let tag_id = t.id;
      return <div key={"tag_id__"+tag_id} style={{display:"inline-block", padding:"2px",fontSize:"15px",borderRadius:"0px",margin:"2px", marginLeft:"6px", borderBottom:borderBottom, fontWeight:fontWeight }}
                  onClick={()=>this.toggleTag(tag_id)} >
        {name}
      </div>
    })



    return (
      <div style={{}}>

        <div  style={{boxShadow:"0px 2px 2px #e5e5e5",padding:"10px 0px 10px 0px"}}>
          {tags_div}
        </div>

        <div style={{margin:"2px",textAlign:"center"}}>
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


const mapStateToProps = state => {
  return {
    redux_data: state,
  }
}
const ArticlesChoosePage = connect(mapStateToProps)(ArticlesChoosePage__)
export default ArticlesChoosePage;