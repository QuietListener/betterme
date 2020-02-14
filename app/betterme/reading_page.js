import React, {Component} from 'react';
import config from '../conf/config.json';
import * as base from "./base.js"
import _ from "lodash"
import '../css/app.css';
import {axios} from "./base.js"


const BaseHost = "http://localhost:3100"


export default class ReadingPage extends Component
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
      audio_splits: [],
      playingSentence:-1 //正在播放哪个
    };

    this.load = this.load.bind(this);
    this.playAudio = this.playAudio.bind(this);
    this.scrollSentence = this.scrollSentence.bind(this);

    this.audioRef = new Object();
    this.timeoutPlay = null;

    this.interval = null;
  }

  componentDidMount()
  {
    this.load();
    document.addEventListener("keydown", this.onKeyDown)
    this.interval = setInterval(()=>{
      this.scrollSentence();
    },500);
  }


  scrollSentence(){
    try{

      var audio = this.refs.audioRef;
      var sentences = this.state.data.sentences || [];
      var splits_ = this.state.data.splits || [];

      if(!audio || sentences.length <= 0){
        return;
      }

      var curTime = audio.currentTime;
      var sentenceScrollDiv =  this.refs["sentenceScrollDiv"];

      for(let index = 0; index < sentences.length; index++){

        let s = sentences[index];
        let start_audio_ = (index - 1 >= 0 && index < splits_.length) ? splits_[index - 1]["point"] : 0;
        let end_audio_ = index < splits_.length ? splits_[index]["point"] : 10000;

        var refName = "s_s_"+s.id;
        var sentence_div = this.refs[refName];
       // console.log(refName+"_height",sentence_div.height);

        if(curTime>start_audio_ && curTime <end_audio_ &&  this.setState.playingSentence != s.id){
          this.setState({playingSentence: s.id});

          var span = 250;
          let top = parseInt(sentence_div.offsetTop/span);
          let shouldScrollTo = span*top;
          console.log(refName+"_scroll_height:"+sentence_div.offsetTop+" top:"+top);
          console.log("shouldScrollTo",shouldScrollTo);

          if(shouldScrollTo <= 0){
            return;
          }

          sentenceScrollDiv.scrollTo(0, shouldScrollTo-30);
          return;
        }

      }

    }catch(e){
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
    var words = this.state.data.words || [];
    var sentences = this.state.data.sentences || [];
    var splits_ = this.state.data.splits || [];
    var maxOrder = -1;



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

      let color = this.state.playingSentence == s.id ? "green":"black";
      return <div id={`s_s_${s.id}`} key={`s_s_${s.id}`}  ref={`s_s_${s.id}`}  style={{margin: "4px", padding: "2px", border: "1px solid",color:color}}>



        {s_word_divs}
        <div style={{display: "inline-block"}}></div>
      </div>
    })


    return (

      <div>
        <div style={{display:"block",height:"90%",overflow:"scroll"}} ref={"sentenceScrollDiv"}>


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



        <div style={{display:"block",height:"8%",overflow:"scroll"}}>

          <audio ref={"audioRef"} controls src={article.audio_normal} style={{width: "100%"}}>
            Your browser does not support this audio format.
          </audio>

        </div>

      </div>
    );
  }
}

const inner_style = {
  part: {display: "inline-block", verticalAlign: "top", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"}
}