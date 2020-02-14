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
    super(props)
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    var id = this.props.params.id;
    console.log("id",id);

    this.state = {
      id: id,
      data: {},
      start: -1,
      end: -1,
      which: "start",
      audio_splits: []
    };

    this.load = this.load.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.click = this.click.bind(this);
    this.choose = this.choose.bind(this);
    this.saveSentence = this.saveSentence.bind(this);
    this.saveSentence_ = this.saveSentence_.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.removeAudioSplit = this.removeAudioSplit.bind(this);
    this.saveSplitAudio = this.saveSplitAudio.bind(this);
    this.playAudio = this.playAudio.bind(this);

    this.audioRef = new Object();

    this.timeoutPlay = null;
  }

  componentDidMount()
  {
    this.load();
    document.addEventListener("keydown", this.onKeyDown)
  }

  onKeyDown(event)
  {
    //console.log("key down",event);
    if (event.code == "Space")
    {
      console.log("space click")
      var audio = this.refs.audioRef;
      //console.log(audio);
      this.troggle(audio);
    }
  }

  troggle(audio)
  {
    if (audio !== null)
    {
      //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
      //alert(audio.paused);
      if (audio.paused)
      {
        audio.play();//audio.play();// 这个就是播放
      } else
      {
        audio.pause();// 这个就是暂停
        this.processAudio(audio);
      }
    }
  }

  playAudio(from, to)
  {
    if (this.timeoutPlay != null)
    {
      clearTimeout(this.timeoutPlay);
    }

    let timeOut = Math.abs(to - from)*1000;

    console.log("play",from,to,timeOut);
    var audio = this.refs.audioRef;
    audio.currentTime = from;
    this.timeoutPlay = setTimeout(() => {
      audio.pause()
    }, timeOut);
    audio.play();
  }

  processAudio(audio)
  {
    let currentTime = audio.currentTime;
    console.log("currentTime", currentTime)
    var splits = this.state.audio_splits;
    splits.push(currentTime);
    this.setState({audio_splits: splits})
  }

  removeAudioSplit(t)
  {
    if (!t || t <= 0) return;

    var splits = this.state.audio_splits;
    splits = splits.filter(st => {
      return t > st ;
    });

    this.setState({audio_splits: splits})
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
    this.saveSentence_(id, s_id, start, end);
    this.setState({which:"start"})
  }

  saveSplitAudio(article_id)
  {
    let splits = this.state.audio_splits;
    var sentences = this.state.data.sentences || [];

    // if (splits.length + 1 != sentences.length)
    // {
    //   alert("句子和切分点对不上 切点 " + splits.length + " 句子:" + sentences.length)
    //   return;
    // }

    var params = {
      article_id: article_id,
      splits: this.state.audio_splits
    }

    var url = `${BaseHost}/reading/save_audio_splits.json`;
    console.log(url);
    var that = this;
    axios.post(url, params).then((res) => {
      console.log("res", res);
      this.load();
      that.setState({audio_splits:[]});
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
      this.load();
    })

  }

  saveSentence_(article_id, s_id, word_start, word_end, audio_start, audio_end)
  {
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
    })

  }

  handleChange(propName, event)
  {
    let data = {}
    data[propName] = event.target.value;
    this.setState(data);
  }


  click(which)
  {
    this.setState({which: which});
  }

  choose(order)
  {
    let data = {}
    data[this.state.which + ""] = order;

    var which = this.state.which == "start" ? "end":"start";
    data["which"] = which;
    this.setState(data);


  }


  render()
  {
    var article = this.state.data.article || {};
    var words = this.state.data.words || [];
    var sentences = this.state.data.sentences || [];
    var splits = this.state.data.splits || [];

    var maxOrder = -1;


    var splitsObjs = this.state.audio_splits.map(ss=>{return {point:ss};});
    var splits_ = splits.concat(splitsObjs);
    var audio_splits_divs =splits_.map(t_ => {

      let t =  t_["point"];
      return <div style={{display: "inline-block", padding: "2px",border:"1px solid"}}>
        {t}

        <div>
          <div style={{display:"inline-block",width:"45%", background: "black", color: "white", margin: "1px"}}
               onClick={() => {
                 console.log("del" + t);
                 this.removeAudioSplit(t);
               }}>del
          </div>

          <div style={{display:"inline-block",width:"45%", background: "black", color: "white", margin: "1px"}}
               onClick={() => {
                 console.log("play" + t);
                 this.playAudio(t,100000)
               }}>p
          </div>
        </div>
      </div>
    });



    var sentence_divs = sentences.map((s,index) => {

      let start = s.start_word_order;
      let end = s.end_word_order;
      if (maxOrder <= start) maxOrder = start;
      if (maxOrder <= end) maxOrder = end;

      let s_word_divs = words.filter((w) => {
        return w.order >= start && w.order <= end;
      }).map(w => {
        return <div style={{display: "inline-block", margin: "2px"}}>{w.text}</div>
      })


      let start_audio_ = (index-1 >=0 && index < splits_.length) ? splits_[index-1]["point"] : 0 ;
      let end_audio_ =  index < splits_.length ?  splits_[index]["point"] : 1000000;

      return <div style={{margin: "4px", padding: "2px", border: "1px solid"}}>
        <div>
          <span>word：</span><span>{s.id}:{start}:{end}</span>
          <span>音频：</span>
          <input style={{width: "60px"}} value={start_audio_}
                 // onChange={(event) => {
                 //   this.handleChange("audio_start_" + s.id, event)
                 // }}
          /> :
          <input style={{width: "60px"}} value={end_audio_}
                 // onChange={(event) => {
                 //   this.handleChange("audio_end_" + s.id, event)
                 // }}
          />

          {/*<div style={{display: "inline-block", border: "1px solid"}}*/}
               {/*onClick={() => this.saveSentence_(this.state.id, s.id, null, null, this.state["audio_start_" + s.id], this.state["audio_end_" + s.id])}*/}
          {/*>save*/}
          {/*</div>*/}

          <div style={{display: "inline-block", border: "1px solid",marginLeft:"2px"}} onClick={()=>this.playAudio(start_audio_,end_audio_)}>play</div>
        </div>

        {s_word_divs}
        <div style={{display: "inline-block"}}></div>
      </div>
    })


    var words_divs = words.map(w => {
      let background = w.order <= maxOrder ? "green" : "black";

      //console.log(maxOrder + ":" + w.order + ":" + color);

      return <div
        style={{display: "inline-block", margin: "2px", color:"white",background:background}}
        onClick={() => this.choose(w.order)}>
        <div>{w.text}</div>
        <div>{w.order}</div>
      </div>
    })



    return (

      <div>
      <div style={{display:"block",height:"80%",overflow:"scroll"}}>
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


        </div>
      </div>



        <div style={{display:"block",height:"18%",overflow:"scroll"}}>

          <audio ref={"audioRef"} controls src={article.audio_normal} style={{width: "100%"}}>
            Your browser does not support this audio format.
          </audio>

          <div>
            {audio_splits_divs}
          </div>

          <div style={{border: "2px solid ", padding: "6px",textAlign:"center",marginTop:"10px",marginBottom:"50px"}}
               onClick={() => {
                 this.saveSplitAudio(this.state.id)
               }}
          >fill all
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