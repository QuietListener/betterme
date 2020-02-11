import React, {Component} from 'react';
import config from '../conf/config.json';
import * as base from "./base.js"
import _ from "lodash"
import '../css/app.css';
import {axios} from "./base.js"


const BaseHost = "http://127.0.0.1:3100"


export default class Article extends Component
{

  constructor(props)
  {
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    super(props);
    this.state = {
      id: 1,
      data: {}
    };

    this.load = this.load.bind(this);
  }

  componentDidMount()
  {
    this.load();
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


    var words = this.state.data.words || [];
    var sentences = this.state.data.sentences || [];

    var words_divs = words.map(w => {
      return <div style={{display: "inline-block", margin: "2px" , border: "1px solid"}}>
        <div>{w.text}</div> <div>{w.order}</div>
      </div>
    })



    var sentence_divs = sentences.map(s => {

      let start = s.start_word_order;
      let end = s.end_word_order;
      let s_word_divs = words.filter((w) => {
        return w.order >= start && w.order <= end;
      }).map(w => {
        return <div style={{display: "inline-block", margin: "2px"}}>{w.text}</div>
      })

      return <div style={{display: "inline-block", margin: "4px", padding: "2px", border: "1px solid"}}>
        {s_word_divs}
      </div>
    })

    return (<div style={{}}>
        <div style={inner_style.part}>{words_divs}</div>
        <div style={inner_style.part}>
          {sentence_divs}
        </div>
      </div>
    );
  }
}

const inner_style = {
  part: {display: "inline-block", verticalAlign: "top", width: "44%", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"}
}