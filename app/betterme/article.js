import React, {Component} from 'react';
import config from '../conf/config.json';
import * as base from "./base.js"
import _ from "lodash"
import '../css/app.css';
import {axios} from "./base.js"


const BaseHost = "http://localhost:3100"


export default class Article extends Component
{

  constructor(props)
  {
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    super(props);
    this.state = {
      id: 1,
      data: {},
      start: -1,
      end: -1,
      which: "start"
    };

    this.load = this.load.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.click = this.click.bind(this);
    this.choose = this.choose.bind(this);
    this.saveSentence = this.saveSentence.bind(this);
    this.saveSentence_ = this.saveSentence_.bind(this);
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

  saveSentence()
  {
    var that = this;
    this.setState({loading: true});

    let s_id = this.refs.sId.value
    var id = this.state.id;

    var start = this.state.start;
    var end = this.state.end;
    this.saveSentence_(id,s_id,start,end);
  }

  saveSentence_(article_id,s_id,word_start,word_end,audio_start,audio_end){
    var params = {
      sentence_id: s_id,
      article_id: article_id,
      start_word_order: word_start,
      end_word_order: word_end,
      audio_start_at: audio_start,
      audio_end_at: audio_end,
    }

    var url = `${BaseHost}/reading/update_sentence.json`;
    console.log(url);
    axios.post(url, params).then((res) => {
      console.log("res", res);
      this.load();
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
      this.load();
    }).done();

  }

  handleChange(propName, event)
  {
    this.setState({propName: event.target.value});
  }

  click(which)
  {
    this.setState({which: which});
  }

  choose(order)
  {
    let data = {}
    data[this.state.which + ""] = order;

    this.setState(data);
  }


  render()
  {


    var article = this.state.data.article || {};
    var words = this.state.data.words || [];
    var sentences = this.state.data.sentences || [];

    var maxOrder = -1;


    var sentence_divs = sentences.map(s => {

      let start = s.start_word_order;
      let end = s.end_word_order;
      if (maxOrder <= start) maxOrder = start;
      if (maxOrder <= end) maxOrder = end;

      let s_word_divs = words.filter((w) => {
        return w.order >= start && w.order <= end;
      }).map(w => {
        return <div style={{display: "inline-block", margin: "2px"}}>{w.text}</div>
      })

      return <div style={{margin: "4px", padding: "2px", border: "1px solid"}}>
        <div>
          <span>word：</span><span>{s.id}:{start}:{end}</span>
          <span>音频：</span><input style={{width:"60px"}} value={s.audio_start_at||-1} /> :
          <input  style={{width:"60px"}}value={s.audio_end_at||-1}/>
        </div>
          {s_word_divs}
        <div style={{display: "inline-block"}}></div>
      </div>
    })


    var words_divs = words.map(w => {
      let color = w.order <= maxOrder ? "2px solid red" : "1px solid black";

      console.log(maxOrder + ":" + w.order + ":" + color);

      return <div
        style={{display: "inline-block", margin: "2px", border: color}}
        onClick={() => this.choose(w.order)}>
        <div>{w.text}</div>
        <div>{w.order}</div>
      </div>
    })

    return (

      <div style={{}}>
        <div style={inner_style.part}>{words_divs}</div>


        <div style={inner_style.part}>
          {sentence_divs}

          <div>
            <div style={{
              display: "inline-block",
              margin: "10px"
            }}>
              句子Id:<input ref={"sId"}/>
            </div>

            <div style={{
              display: "inline-block",
              border: this.state.which == "start" ? "1px solid" : "0px",
              margin: "10px"
            }}
                 onClick={() => this.click("start")}>
              start:{this.state.start}
            </div>

            <div
              style={{display: "inline-block", border: this.state.which == "end" ? "1px solid" : "0px", margin: "10px"}}
              onClick={() => this.click("end")}>
              end:{this.state.end}
            </div>

            <div style={{
              display: "inline-block",
              border: "1px solid ",
              background: "black",
              padding: "2px",
              color: "white"
            }}
                 onClick={this.saveSentence}>
              save
            </div>

          </div>


          <div>

            <audio controls src={article.audio_normal} style={{width:"100%"}}>
                Your browser does not support this audio format.
            </audio>
          </div>


        </div>
      </div>
  );
  }
  }

  const inner_style = {
    part: {display: "inline-block", verticalAlign: "top", width: "44%", fontSize: "10px"},
    input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"}
  }