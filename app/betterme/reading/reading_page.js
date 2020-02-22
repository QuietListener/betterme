import React, {Component} from 'react';
import css from './css/ireading.css';
import Comment from "./comment.js"
import {axios} from "../base.js"
import * as base from "../base.js"
import playPng from "../../resource/imgs/play.png";
import stopPng from "../../resource/imgs/stop.png";
import CLoading from "./components/c_loading"


const BaseHost = base.BaseHostIreading();
const Playing = 1;
const Stopped = 2;

export default class ReadingPage extends Component
{

  constructor(props)
  {
    super(props)
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    var id = this.props.params.id;
    console.log("id", id);

    this.state = {
      user_id:1,
      id: id,
      data: {},
      start: -1,
      end: -1,
      which: "start",
      audio_splits: [],
      playingSentence: -1,//正在播放哪个,
      progress: 0.0,
      playState: Stopped
    };

    this.load = this.load.bind(this);
    this.playAudio = this.playAudio.bind(this);
    this.scrollSentence = this.scrollSentence.bind(this);
    this.playSpan = this.playSpan.bind(this);
    this.finish = this.finish.bind(this);
    this.audioRef = new Object();
    this.timeoutPlay = null;

    this.interval = null;
  }

  componentDidMount()
  {
    this.load();
    document.addEventListener("keydown", this.onKeyDown)
    this.interval = setInterval(() => {
      this.scrollSentence();
    }, 500);
  }


  scrollSentence()
  {
    try
    {

      var audio = this.refs.audioRef;
      var sentences = this.state.data.sentences || [];
      var splits_ = this.state.data.splits || [];

      if (!audio || sentences.length <= 0)
      {
        return;
      }

      var curTime = audio.currentTime;
      var duration = audio.duration;
      let progress = curTime / duration;
      this.setState({progress: progress});

      var sentenceScrollDiv = this.refs["sentenceScrollDiv"];

      for (let index = 0; index < sentences.length; index++)
      {

        let s = sentences[index];
        let start_audio_ = (index - 1 >= 0 && index < splits_.length) ? splits_[index - 1]["point"] : 0;
        let end_audio_ = index < splits_.length ? splits_[index]["point"] : 10000;

        var refName = "s_s_" + s.id;
        var sentence_div = this.refs[refName];
        // console.log(refName+"_height",sentence_div.height);

        if (curTime > start_audio_ && curTime < end_audio_ && this.setState.playingSentence != s.id)
        {
          this.setState({playingSentence: s.id});

          var span = 250;
          let top = parseInt(sentence_div.offsetTop / span);
          let shouldScrollTo = span * top;
          console.log(refName + "_scroll_height:" + sentence_div.offsetTop + " top:" + top);
          console.log("shouldScrollTo", shouldScrollTo);

          if (shouldScrollTo <= 0)
          {
            return;
          }

          sentenceScrollDiv.scrollTo(0, shouldScrollTo - 30);
          return;
        }

      }

    } catch (e)
    {
      console.log(e);
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
        this.setState({playState:Playing})
      } else
      {
        audio.pause();// 这个就是暂停
        this.setState({playState:Stopped});
      }
    }
  }

  playSpan(span){
    var audio = this.refs.audioRef;
    if(!audio)
      return;

    audio.currentTime += span;
    audio.play();
    this.setState({playState:Playing})
  }
  playAudio(from, to)
  {
    if (this.timeoutPlay != null)
    {
      clearTimeout(this.timeoutPlay);
    }

    let timeOut = Math.abs(to - from) * 1000;

    console.log("play", from, to, timeOut);
    var audio = this.refs.audioRef;
    audio.currentTime = from;
    this.timeoutPlay = setTimeout(() => {
      audio.pause()
    }, timeOut);
    audio.play();
  }

  finish()
  {
    var params = {
      article_id: this.state.id,
    }

    var url = `${BaseHost}/reading/finish_article.json`;
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
      this.setState({loading: false});
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
    })
  }


  render()
  {

    if(this.state.loading == true){
      return (<CLoading />)
    }

    var article = this.state.data.article || {};
    var finished = this.state.data.finished || false;
    var words = this.state.data.words || [];
    var sentences = this.state.data.sentences || [];
    var splits_ = this.state.data.splits || [];
    var maxOrder = -1;


    var sentence_divs = sentences.map((s, index) => {

      let start = s.start_word_order;
      let end = s.end_word_order;
      if (maxOrder <= start) maxOrder = start;
      if (maxOrder <= end) maxOrder = end;

      let s_word_divs = words.filter((w) => {
        return w.order >= start && w.order <= end;
      }).map(w => {
        return <div style={{display: "inline-block", margin: "2px",fontSize:"14px"}}>{w.text}</div>
      })


      let start_audio_ = (index - 1 >= 0 && index < splits_.length) ? splits_[index - 1]["point"] : 0;
      let end_audio_ = index < splits_.length ? splits_[index]["point"] : 1000000;

      let color = this.state.playingSentence == s.id ? "green" : "black";
      return <div id={`s_s_${s.id}`} key={`s_s_${s.id}`} ref={`s_s_${s.id}`}
                  style={{margin: "4px", padding: "4px", border: "0px solid", color: color}}>
        {s_word_divs}
        <div style={{display: "inline-block"}}></div>
      </div>
    })



    return (

      <div>
        <div style={{display: "block", height: "90%", overflow: "scroll",minHeight:"400px"}} ref={"sentenceScrollDiv"}>
          <div style={{fontSize:"18px",fontWeight:"bold",marginTop:"6px",marginLeft:"10px"}}>
            {article.title}
          </div>

          <div style={inner_style.part}>
            {sentence_divs}
          </div>


          <div  style={{width:"100%",textAlign:"center",marginBottom:"20px"}}>
            <div className={css.ibtn}
                 style={{padding:"6px",fontSize:"16px", borderRadius:"4px",width:"90%",display:"inline-block",margin:"auto",backgroundColor:`${finished?"green":''}`,color:`${finished?"white":''}`}}
                onClick={this.finish}
            >
              {finished ? "finished" : "finish"}
            </div>
          </div>


          <div style={{marginBottom:"80px"}}>
            {this.state.id ? <Comment id={this.state.id} user_id={this.state.user_id}></Comment> :null}
          </div>

        </div>


        <div style={{display: "block", height: "60px", overflow: "scroll",backgroundColor:"#f2f2f2",position:"fixed",bottom:0,width:"100%"}}>

          <audio ref={"audioRef"} controls src={article.audio_normal} style={{width: "100%", display: "none"}}>
            Your browser does not support this audio format.
          </audio>

          <div style={{textAlign: "center",marginTop:"5px"}}>

            <div style={{width: "100%", textAlign: "left", verticalAlign: "top"}}>
              <div style={{width: `${this.state.progress * 100}%`, height: "1px", background: "green"}}></div>
            </div>

            <div style={{textAlign: "center",position:"relative"}}>


              <div style={{fontSize:"14px",display:"inline-block",verticalAlign:"top" ,marginTop:"8px",marginRight:"10px"}} onClick={()=>{this.playSpan(-5)}}>
                5s
              </div>

              <div style={{width:"30px",height:"30px",borderRadius:"15px",position:"relative",padding:"5px",margin:"auto",display:"inline-block",verticalAlign:"top"}}
                  onClick={() => {var audio = this.refs.audioRef;this.troggle(audio);}}>
                <img src={this.state.playState == Playing ? stopPng : playPng} style={{ width: "20px"}}/>
              </div>


              <div style={{fontSize:"14px",display:"inline-block",verticalAlign:"top",marginTop:"8px",marginLeft:"10px"}} onClick={()=>{this.playSpan(5)}}>
                5s
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }
}

const inner_style = {
  part: {display: "inline-block", verticalAlign: "top", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"}
}