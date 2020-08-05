import React, {Component} from 'react';
import * as base from "../base.js"
import css from "./css/ireading.css"
import {axios} from "../base.js"
import CSeperator from "./components/c_sperator.js"
import CArticle from "./components/c_article_card.js"
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

    var finished_article_ids = this.state.data.finished_article_ids || [];
    let children_divs = children.map(c=>{
      let finished = (finished_article_ids.indexOf(c.id+"") >= 0);
      return <CArticle a={c} finished={finished} />
    });

    let img = article.img;

    let imgWidth = base.width()*0.2;
    if(imgWidth > 120){
      imgWidth = 120;
    }
    let infoWidth = null;//base.width() - imgWidth - 20;
    let height = imgWidth*4/3;
    
    let is_cn = base.isZh();
    return (
      <div style={{textAlign:"left"}}>
        <div style={{padding:"10px 10px 2px 10px"}}>

            <img src={img}  className={css.box} style={{borderRadius:"4px",width:`${imgWidth}px`,height:`${height}px`}}/>

            <div className={css.box} style={{width:`${infoWidth}px`,height:`${height}px`,paddingLeft:"4px",position:"relative"}}>
            {is_cn?  <div className={css.middleText} style={{fontWeight:"bold"}}>{article.title_cn}</div> : null}
             <div className={css.smallText} style={{fontWeight:"normal"}}>{article.title}</div>
              <div className={css.smallText} style={{color:"gray",marginTop:"4px"}} >{article.author}</div>

              <div className={css.middleText} style={{fontSize:"14px",paddingBottom:"4px",position:"absolute",bottom:0}} >
                <div className={[css.box]} style={{color:"#2F4F4F",fontSize:"16px"}}>  
                {/* <img width={12} src={levelPng} />  */}
                L{article.level||1} </div>
                {/* <div className={[css.box]} style={{color:"#2F4F4F",marginLeft:"10px"}}> 
                 <img width={12} src={readedPng}/>  {100}
                 </div> */}
              </div>

            </div>

        </div>

        <div style={{boxShadow:"0px 2px 2px #e5e5e5",padding:"4px 12px 4px 12px"}}>
          <div className={css.smallText}style={{color:"#969ca4",marginTop:"10px"}}>{article.origin_text}</div>
        </div>


        <div style={{marginTop:"8px",padding:"12px"}}>
          {children_divs}
        </div>


      </div>
    );
  }
}

const inner_style={}