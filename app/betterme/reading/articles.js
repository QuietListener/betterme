import React, {Component} from 'react';
import * as base from "../base.js"
import {axios} from "../base.js"
import CModal from "../../components/c_modal";


const BaseHost = base.BaseHostIreading();


export default class Articles extends Component
{

  constructor(props)
  {
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    super(props);
    this.state = {
      data: {},
      modified:{},
      toggleState:{},
      choosedTagId:-1
    };

    this.load = this.load.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveArticle = this.saveArticle.bind(this);
    this.split = this.split.bind(this);
    this.modify = this.modify.bind(this);
    this.toggle = this.toggle.bind(this);
    this.troogle_article = this.troogle_article.bind(this);
    this.chooseTag = this.chooseTag.bind(this);

    this.audioRef = new Object();
    this.timeoutPlay = null;
  }

  toggle(tag_id){
    let toggleState = this.state.toggleState || {};
    toggleState[tag_id] = !toggleState[tag_id];
    this.setState({toggleState:toggleState})
  }
  componentDidMount()
  {
    this.load();
    document.addEventListener("keydown", this.onKeyDown)
  }


  handleChange(propName, event)
  {
    let data = {}
    data[propName] = event.target.value;
    this.setState(data);
  }

  load()
  {
    var that = this;
    this.setState({loading: true});

    var id = this.state.id;
    axios.get(`${BaseHost}/reading/all_articles.json`).then((res) => {
      console.log("res", res);
      that.setState({data: res.data.data});
      console.log(that.state);
      // that.load_plans(user.id)
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
    })
  }

  saveArticle(id,author,author_cn,title,title_cn, text,audio,img,parent_id,tag_id)
  {
    var params = {
      id: id,
      text: text,
      author: author,
      author_cn: author_cn,
      img:img,
      title: title,
      title_cn: title_cn,
      audio:audio,
      parent_id:parent_id,
      tag_id:tag_id
    }

    var url = `${BaseHost}/reading/create_article.json`;
    console.log(url);
    axios.post(url, params).then((res) => {
      console.log("res", res);
      this.load();
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
      this.load();
    })

  }

  split(id)
  {
    var params = {
      article_id: id
    }

    var url = `${BaseHost}/reading/split.json`;
    console.log(url);
    axios.post(url, params).then((res) => {
      console.log("res", res);
      alert(res.data.msg);
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
      alert(e.message);
    })

  }


  troogle_article(id)
  {
    var params = {
      article_id: id
    }
    var that = this;
    var url = `${BaseHost}/reading/troogle_article.json?article_id=${id}`;
    console.log(url);
    axios.get(url, params).then((res) => {
      console.log("res", res);
      alert(res.data.msg);
      that.load();
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
      alert(e.message);
    })

  }

  chooseTag(id)
  {
    this.setState({choosedTagId:id});
  }

  modify(a,tag_id){
    this.setState({
      showModifyModal:true,
      id: a.id,
      author: a.author,
      author_cn: a.author_cn,
      tag_id:tag_id,
      title: a.title,
      title_cn: a.title_cn,
      img:a.img,
      parent_id:a.parent_id,
      audio: a.audio_normal,
      text: a.origin_text,
    })
  }

  renderArticle(a,tag,childCount){
    var tag_id = tag?tag.id:null;
    return <div style={{"border": "1px solid #f2f2f2", padding: "2px", margin: "4px"}}>
      <div>
        <span onClick={()=>this.toggle(a.id)} style={{fontSize:"10px",fontWeight:"bold"}}>{a.title}({childCount})</span>

        <span style={{fontSize:"10px",marginLeft:"10px",border:"1px solid red",padding:"4px",backgroundColor:a.state+"" == "1" ? "gray":"white"}} 
            onClick={()=>this.troogle_article(a.id)}>
               {a.state+"" == "2" ? "enabled":"disabled" } 
        </span>
      </div>
      {tag?<div style={{fontSize:"10px"}}>tag: {tag.name}({tag.id})</div>:null}


      <div><span style={{background:"black",color:"white",padding:"2px",borderRadius:"10px"}}>{a.id}</span>
        <div style={inner_style.btn} onClick={()=>this.split(a.id)}>split</div>
        <div style={inner_style.btn}  onClick={()=>base.goto(`/article/${a.id}`)}>detail</div>
        <div style={inner_style.btn}  onClick={()=>this.modify(a,tag_id)}>modify</div>
      </div>
    </div>
  }

  render()
  {

    var articles = this.state.data.articles || [];
    var tags = this.state.data.tags || [];
    var tag2articles = this.state.data.tag2articles || [];
    var tagsMap = {};
    for(let i =0; i < tags.length; i++){
      let tag = tags[i];
      tagsMap[tag.id] = tag;
    }
    var article2tagMap = {};
    for(let i =0; i < tag2articles.length; i++){
      let tag2article = tag2articles[i];
      article2tagMap[tag2article.article_id] = tag2article.reading_tag_id;
    }

   
    if(tags.filter(t=>t.id == -1).length == 0){
      tags.push({id:-1,name:"all"})
    }

    let tags_div = tags.map(t=>{
      return <span style={{padding:"2px",background:"black",color:"white",margin:"4px"}}
                   onClick={()=>this.chooseTag(t.id)}
      >{t.name}({t.id})</span>
    });
  

    console.log("articles", articles);

    let parentArticles = articles.filter(a=> (a.parent_id == null || a.parent_id ==""  || a.parent_id<0) )

    var articles_div = parentArticles.map(a => {

      let tag_id = article2tagMap[a.id];
      if(this.state.choosedTagId > 0  && parseInt(tag_id+"") != parseInt(this.state.choosedTagId +"") ){
          return null;
      }

      let child_articles = articles.filter(aa=>aa.parent_id == a.id);

      let child_articles_div = child_articles.map(aa_=> this.renderArticle(aa_));

      let tag = tagsMap[tag_id];
      let childCount = child_articles?child_articles.length:0;
      let parent_article_div = this.renderArticle(a,tag,childCount);

       return  <div style={{marginBottom:"10px",backgroundColor:"#f2f2f2",display:"inline-block",verticalAlign:"top",width:"30%",margin:"2px"}}>
         {parent_article_div}
         {this.state.toggleState[a.id] ? <div style={{marginLeft: "20px"}}>
           {child_articles_div}
         </div>:null
         }
        </div>
    })

    let modified = this.state.modified;


    return (
      <div style={{width:"1560px"}}>

        <div style={{marginBottom:"10px"}}>{tags_div}</div>
        {articles_div}

        <div style={{padding:"4px",margin:"6px",color:"white",backgroundColor:"black"} } onClick={()=>this.modify({})}> clear modify</div>


        {this.state.showModifyModal == true ?
        <div style={{position:"fixed",top:0,left:0,zIndex:1000,
        width:"100%",height:"100%",textAlign:"center",color:"black",
        backgroundColor:"white" ,textAlign:"left",padding:"20px"}}>
           <div style={{right:"20px",top:"10px",position:"fixed",fontSize:"30px"}} 
                 onClick={()=>{this.modify({}); this.setState({showModifyModal:false}) } }
           >x</div>

          <div style={inner_style.box}>
            <label>id:</label>
            <input style={{width: "100%"}} onChange={(event) => {
              this.handleChange("id", event)
            }}
                   value={this.state.id}
            ></input>

          </div>

          <div style={inner_style.box}>
            <label>parent_id:</label>

            <input style={{width: "100%"}} onChange={(event) => {
              this.handleChange("parent_id", event)
            }}
                   value={this.state.parent_id}
            ></input>
          </div>

          <div style={inner_style.box}>
            <label>tag_id:</label>

            <input style={{width: "100%"}} onChange={(event) => {
              this.handleChange("tag_id", event)
            }}
                   value={this.state.tag_id}
            ></input>
          </div>


          <div style={inner_style.box}>
            <label>title:</label>

            <input style={{width: "100%"}} onChange={(event) => {
              this.handleChange("title", event)
            }}
                   value={this.state.title}
            ></input>
          </div>

          <div style={inner_style.box}>
            <label>title_cn:</label>

            <input style={{width: "100%"}} onChange={(event) => {
              this.handleChange("title_cn", event)
            }}
                   value={this.state.title_cn}
            ></input>
          </div>


          <div style={inner_style.box}>
            <label>author:</label>
            <input style={{width: "100%"}} onChange={(event) => {
              this.handleChange("author", event)
            }}
                   value={this.state.author}
            ></input>
          </div>

          <div style={inner_style.box}>
            <label>author_cn:</label>
            <input style={{width: "100%"}} onChange={(event) => {
              this.handleChange("author_cn", event)
            }}
                   value={this.state.author_cn}
            ></input>
          </div>

          <div style={inner_style.box}>
            <label>audio:</label>
            <input style={{width: "100%"}} onChange={(event) => {
              this.handleChange("audio", event)
            }}
                   value={this.state.audio}
            ></input>
          </div>

          <div style={inner_style.box}>
            <label>img:</label>
            <input style={{width: "100%"}} onChange={(event) => {
              this.handleChange("img", event)
            }}
                   value={this.state.img}
            ></input>
          </div>


          <div style={{maxWidth:"1200px"}}><label>content:</label>
            <textArea style={{width: "100%"}}
                      onChange={(event) => {
                        this.handleChange("text", event)
                      }}
                      rows={18}
                      value={this.state.text}
            ></textArea>
          </div>

          <div style={{border: "1px solid", textAlign: "center"}} onClick={()=>{
            this.saveArticle(this.state.id,this.state.author,this.state.author_cn,this.state.title,this.state.title_cn,this.state.text,this.state.audio,this.state.img,this.state.parent_id,this.state.tag_id)
          }}>save</div>
        </div>
  : null}

      </div>
    );
  }
}

const inner_style = {
  part: {display: "inline-block", verticalAlign: "top", width: "44%", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"},
  box: {"padding": "2px", "margin": "4px",width:"600px",display:"inline-block",verticalAlign:"top"},
  btn: {display: "inline-block",fontSize: "12px",verticalAlign: "top","padding": "2px", "margin": "4px",border:"1px solid",borderRadius:"2px"}
}