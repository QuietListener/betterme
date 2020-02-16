import React, {Component} from 'react';
import * as base from "../base.js"
import {axios} from "../base.js"

const BaseHost = "http://localhost:3100"


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

    let children_divs = children.map(c=>{
      return <div style={{padding:"2px"}}>
        {c.title}
      </div>
    });

    return (
      <div style={{}}>
        <div style={inner_style.headBox}>
          <div style={{fontSize:"16px",fontWeight:"bold"}}>{article.title}</div>
          <div style={{fontSize:"14px"}}>{article.author}</div>
          <div style={{fontSize:"14px"}}>{article.origin_text}</div>
        </div>

        <div style={{marginTop:"8px",padding:"8px"}}>
          {children_divs}
        </div>


      </div>
    );
  }
}

const inner_style = {
  headBox:{padding:"8px"},
  part: {display: "inline-block", verticalAlign: "top", width: "44%", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"},
  box: {"padding": "2px", "margin": "4px"},
  btn: {display: "inline-block", verticalAlign: "top","padding": "2px", "margin": "4px",border:"1px solid"}
}