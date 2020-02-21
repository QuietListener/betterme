import React, {Component} from 'react';
import * as base from "../base.js"
import {axios} from "../base.js"

const BaseHost = "http://localhost:3100"


export default class Articles extends Component
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
    this.handleChange = this.handleChange.bind(this);
    this.saveArticle = this.saveArticle.bind(this);
    this.split = this.split.bind(this);

    this.audioRef = new Object();
    this.timeoutPlay = null;
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

  saveArticle(author,title, text)
  {
    var params = {
      text: text,
      author: author,
      title: title,
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

  render()
  {

    var articles = this.state.data.articles || [];
    console.log("articles", articles);

    var articles_div = articles.map(a => {
      return <div style={{"border": "1px solid", padding: "2px", margin: "4px"}}>
        <div>{a.title}</div>
        <div>{a.id} | {a.created_at}
           <div style={inner_style.btn} onClick={()=>this.split(a.id)}>split</div>
           <div style={inner_style.btn}  onClick={()=>base.goto(`/article/${a.id}`)}>detail</div>
        </div>

      </div>
    })

    return (
      <div style={{}}>

        {articles_div}


        <div>
          <div style={inner_style.box}>
            <label>title:</label>
            <input style={{width: "100%"}} onChange={(event) => {
              this.handleChange("title", event)
            }}></input>
          </div>

          <div style={inner_style.box}>
            <label>author:</label>
            <input style={{width: "100%"}} onChange={(event) => {
              this.handleChange("author", event)
            }}></input>
          </div>

          <div style={inner_style.box}><label>content:</label>
            <textArea style={{width: "100%"}}
                      onChange={(event) => {
                        this.handleChange("text", event)
                      }}
                      rows={14}></textArea>
          </div>

          <div style={{border: "1px solid", textAlign: "center"}} onClick={()=>{
            this.saveArticle(this.state.author,this.state.title,this.state.text)
          }}>save</div>
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