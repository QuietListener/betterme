import React, {Component} from 'react';
import * as base from "../base.js"
import css from "./css/ireading.css"
import {axios} from "../base.js"
import CSeperator from "./components/c_sperator.js"
import CArticle from "./components/c_article.js"


const BaseHost = base.BaseHostIreading();


export default class ArticleGroup extends Component
{

  constructor(props)
  {

    super(props);
    var id = this.props.params.id;
    console.log("id",id);

    this.state = {
      id: id,
      data: {}
    };

    this.load = this.load.bind(this);
    this.timeoutPlay = null;
  }

  componentDidMount()
  {
    this.load();
    document.addEventListener("keydown", this.onKeyDown)
  }


  load()
  {
    var that = this;
    this.setState({loading: true});

    var id = this.state.id;
    axios.get(`${BaseHost}/reading/get_article_data.json?article_id=${id}`).then((res) => {
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

    var article = this.state.data.article || {};
    var children = this.state.data.child_articles || [];

    if(!article || !article.id)
    {
      return (null);
    }
    let children_divs = children.map(c=>{
      return <CArticle a={c} finished={true} />
    });

    return (
      <div style={{textAlign:"left"}}>
        <div style={{padding:"5px" ,boxShadow:"0px 2px 2px #e5e5e5",paddingBottom:"6px"}}>
          <div className={css.middleText} style={{fontWeight:"bold"}}>{article.title}</div>
          <div className={css.smallText} style={{color:"black",marginTop:"4px",fontWeight:"bold"}} >{article.author}</div>
          <div className={css.smallText}style={{color:"#969ca4",marginTop:"10px"}}>{article.origin_text}</div>
        </div>


        <div style={{marginTop:"8px",padding:"8px"}}>
          {children_divs}
        </div>


      </div>
    );
  }
}

const inner_style={}