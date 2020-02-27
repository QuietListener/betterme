import React, {Component} from 'react';
import * as base from "../base.js"
import css from "./css/ireading.css"
import {axios} from "../base.js"
import CSeperator from "./components/c_sperator.js"
import CArticle from "./components/c_article.js"
import readedPng from "../../resource/imgs/readed.png"
import levelPng from "../../resource/imgs/level.png"

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

    let img = "https://imagev2.xmcdn.com/group60/M0A/3F/E4/wKgLb1zWy-miCIJLAAAow7cctg8198.jpg!op_type=3&columns=144&rows=144&magick=webp"

    let imgWidth = base.width()*0.2;
    let infoWidth = base.width() - imgWidth - 10;
    let height = imgWidth*4/3;
    return (
      <div style={{textAlign:"left"}}>
        <div style={{padding:"4px"}}>

            <img src={img}  className={css.box} style={{width:`${imgWidth}px`,height:`${height}px`,borderRadius:"4px"}}/>

            <div className={css.box} style={{width:`${infoWidth}px`,height:`${height}px`,paddingLeft:"2px",position:"relative"}}>
              <div className={css.middleText} style={{fontWeight:"bold"}}>{article.title}</div>
              <div className={css.smallText} style={{color:"black",marginTop:"4px"}} >{article.author}</div>

              <div className={css.middleText} style={{fontSize:"14px",paddingBottom:"4px",position:"absolute",bottom:0}} >
                <div className={[css.box]}>  {article.level||1}<img width={12} src={levelPng} /> </div>
                <div className={[css.box]} style={{marginLeft:"6px"}}> {100} <img width={12} src={readedPng}/></div>
              </div>

            </div>

        </div>

        <div style={{boxShadow:"0px 2px 2px #e5e5e5",padding:"4px"}}>
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