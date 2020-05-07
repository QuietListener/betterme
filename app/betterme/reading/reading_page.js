import React, {Component} from 'react';
import css from './css/ireading.css';
import Comment from "./comment.js"
import {axios} from "../base.js"
import * as base from "../base.js"
import playPng from "../../resource/imgs/play.png";
import stopPng from "../../resource/imgs/stop.png";
import CLoading from "./components/c_loading"
import crossPng from "../../resource/imgs/cross.png"
import speakerPng from "../../resource/imgs/speaker.png"
import likePng from "../../resource/imgs/like.png"
import notlikePng from "../../resource/imgs/notlike.png"
import arrayLeftPng from "../../resource/imgs/array_left.png"
import arrayRightPng from "../../resource/imgs/array_right.png"
import ok1Png from "../../resource/imgs/ok1.png"
import CToast from "./components/c_toast";
import {connect} from "react-redux";
import {get_all_articles, get_all_finished_articles} from "../redux/actions/actions";
import CModal from "./components/c_modal";
import CShareContent from "./components/c_share_content";

const BaseHost = base.BaseHostIreading();
const Playing = 1;
const Stopped = 2;

 class ReadingPage_ extends Component
{

  constructor(props)
  {
    super(props)
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    var id = this.props.params.id;
    console.log("id", id);

    this.state = {
      user_id:10,
      id: id,
      data: {},
      start: -1,
      end: -1,
      which: "start",
      audio_splits: [],
      playingSentence: -1,//正在播放哪个,
      progress: 0.0,
      playState: Stopped,
      showModelTooFast:false,
      showShare:false //分享modal
    };

    this.startAt = new Date();
    this.load = this.load.bind(this);
    this.playAudio = this.playAudio.bind(this);
    this.scrollSentence = this.scrollSentence.bind(this);
    this.playSpan = this.playSpan.bind(this);
    this.finish = this.finish.bind(this);
    this.showMean = this.showMean.bind(this);
    this.closeWordModal = this.closeWordModal.bind(this);
    this.collectWord = this.collectWord.bind(this);
    this.unCollectWord = this.unCollectWord.bind(this);
    this.getCollectWordsIds = this.getCollectWordsIds.bind(this);
    this.showTooFastModal = this.showTooFastModal.bind(this);
    this.hideTooFastModal = this.hideTooFastModal.bind(this);
    this.troogleTrans = this.troogleTrans.bind(this);
    this.load_user_state = this.load_user_state.bind(this);
    this.share2Facebook = this.share2Facebook.bind(this);
    this.share_result = this.share_result.bind(this);
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

    window.share_result = this.share_result;
  }


  share_result(result){
    console.log("share_result:"+result);
    if(result == "1" || result == 1) {
      this.setState({showShare: false});
    }
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

          console.log("--shouldScrollTo",shouldScrollTo);
          sentenceScrollDiv.scrollTo(0, shouldScrollTo - 30);
          return;
        }

      }

    } catch (e)
    {
      console.log(e);
    }
  }


  play(audio){
    audio.play();//audio.play();// 这个就是播放
    this.setState({playState:Playing})
  }

  pause(audio)
  {
    audio.pause();// 这个就是暂停
    this.setState({playState: Stopped});
  }

  troggle(audio)
  {
    if (audio !== null)
    {
      //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
      //alert(audio.paused);
      if (audio.paused)
      {
        this.play(audio);
      } else
      {
        this.pause(audio);
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

  showTooFastModal(){
    this.setState({showModelTooFast:true});
  }

  hideTooFastModal(){
    this.setState({showModelTooFast:false});
  }

  finish()
  {

    let now = new Date();
    let span = now.getTime() - this.startAt.getTime();
    console.log(" this.startAt", this.startAt.getTime());
    console.log(" now", now.getTime());
    console.log("span:",span);
    if(span < 20*1000){
      this.showTooFastModal();
      return;
    }

    var params = {
      article_id: this.state.id,
    }

    var url = `${BaseHost}/reading/finish_article.json`;
    console.log(url);
    var that = this;
    axios.post(url, params).then((res) => {
      console.log("res", res);
      this.load();

      that.props.dispatch(get_all_finished_articles());
      that.props.dispatch(get_all_articles());
      that.load_user_state();

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
    });

    this.getCollectWordsIds();
  }


  showMean(word){
    console.log(word);
    var that = this;
    if(this.state.to_check_word_mean != null || this.state.to_check_word != null){
      this.closeWordModal();
      return;
    }

    that.setState({loadingMean: true, to_check_word_mean: null});

    axios.get(`${BaseHost}/reading/dict?word=${word.text}`).then((res) => {
      console.log("res", res);
      that.setState({loadingMean: false,to_check_word_mean:res.data});
    }).catch(e => {
      console.log(e);
      this.setState({loadingMean: false, to_check_word_mean:null});
    });

    this.setState({to_check_word:word})
    var audio = this.refs.audioRef;
    this.pause(audio);
  }

  closeWordModal(){
    console.log("--closeWordModal")
    this.setState({to_check_word:null,to_check_word_mean: null})
  }


  collectWord(w){
    var params = {
      word_id: w.id,
    }

    var url = `${BaseHost}/reading/collect_word.json`;
    console.log(url);
    axios.post(url, params).then((res) => {
      console.log("res", res);
      this.getCollectWordsIds();
    }).catch(e => {
      console.log(e);
    })
  }

  unCollectWord(w){
    var params = {
      word_id: w.id,
    }

    var url = `${BaseHost}/reading/uncollect_word.json`;
    console.log(url);
    axios.post(url, params).then((res) => {
      console.log("res", res);
      this.getCollectWordsIds();
    }).catch(e => {
      console.log(e);
    })
  }

  getCollectWordsIds(){

    var that = this;
    axios.get(`${BaseHost}/reading/collected_words.json`).then((res) => {
      console.log("res", res);
      that.setState({collect_words: res.data.data});
      console.log(that.state);
      // that.load_plans(user.id)
      this.setState({loading: false});
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
    })
  }

  troogleTrans(s_id){
    var show_trans_ids = this.state.show_trans_ids || [];
    
    let index = show_trans_ids.indexOf(s_id);
    if(index >= 0){
      show_trans_ids.splice(index,1);
    }else{
      show_trans_ids.push(s_id)
    }

    this.setState({show_trans_ids});
  }


  share2Facebook()
  {
    var url =  base.BaseHostIreading()+"/reading/share_page?user_id="+this.state.user_id+"/#/share_page";
    let content = "test";
    if(window.Android)
    {
      console.log("share2Facebook android");
      var result = window.Android.share2Facebook(url,content);
    }else{
      console.log("share2Facebook other ");
    }
  }




  load_user_state() {
    var that = this;
    this.setState({loading: true});
    var id = this.state.id;
    let added = this.state.user_id == null?"":"?user_id="+this.state.user_id;

    axios.get(`${BaseHost}/reading/get_user_state.json${added}`).then((res) => {
      console.log("res", res);
      that.setState({user_state: res.data.data,loading:false,showShare:true});
      console.log(that.state);
      // that.load_plans(user.id)
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
    var should_show_trans = this.state.data.should_show_trans || false;
    var finished = this.state.data.finished || false;
    var words = this.state.data.words || [];
    var sentences = this.state.data.sentences || [];
    var splits_ = this.state.data.splits || [];
    var collect_words = [];
    var word_infos = [];
    if(this.state.collect_words){
      collect_words = this.state.collect_words.collected_words || {};
      word_infos = this.state.collect_words.word_infos || {};
    }

    var maxOrder = -1;
    var sentence_divs = sentences.map((s, index) => {

      let start = s.start_word_order;
      let end = s.end_word_order;
      if (maxOrder <= start) maxOrder = start;
      if (maxOrder <= end) maxOrder = end;

      let s_word_divs = words.filter((w) => {
        return w.order >= start && w.order <= end;
      }).map(w => {

        let collected = (collect_words[w.text] != null)
        let backgroundColor = "";
        let color = "";
        let fontWeight = "";
        if(collected){
          //backgroundColor = base.COLOR.gray1;
          color = "black";
          fontWeight="bold";
        }

        let padding= 2;
        let margin = 1;
        if([".","?","!","\"",","].indexOf(w.text) >= 0){
          padding = 0;
          margin = 0;
        }

        return <div ref={`word_${w.id}`} style={{display: "inline-block", padding: `${padding}px`,margin:`${margin}px`,fontSize:"14px",backgroundColor:backgroundColor,color:color,fontWeight:fontWeight,borderRadius:"2px"}}

                    onClick={(event)=>{
                      try
                      {
                        event.stopPropagation();
                        event.nativeEvent.stopImmediatePropagation();
                      }catch(e){
                        console.error(e);
                      }
                      this.showMean(w);

                    }}
        >{w.text}</div>
      })


      let trans_div = <div   style={{ padding: "4px", border: "0px solid", fontSize:"14px", color: color}}> {s.trans_zh} </div>

      let show_trans_ids = this.state.show_trans_ids || [];
      let showTrans  = show_trans_ids.indexOf(s.id) >= 0;
      let showTransTip = should_show_trans && s.trans_zh && s.trans_zh.length >2 ;
      let start_audio_ = (index - 1 >= 0 && index < splits_.length) ? splits_[index - 1]["point"] : 0;
      let end_audio_ = index < splits_.length ? splits_[index]["point"] : 1000000;

      let color = this.state.playingSentence == s.id ? "green" : "#494949";
      return <div id={`s_s_${s.id}`} key={`s_s_${s.id}`} ref={`s_s_${s.id}`}
                  style={{margin: "4px", padding: "4px", border: "0px solid", color: color}}>
        {s_word_divs}
        { showTransTip ?
          <span style={{fontSize:"14px",fontWeight:"bold",color:"white",backgroundColor:"#494949",padding:"4px",marginLeft:"8px"}} onClick={()=>this.troogleTrans(s.id)}>T</span>
          : null
        }
        {showTrans?trans_div:null}

      </div>
    });



    let wordModal = null;
    let to_check_word = this.state.to_check_word
    let to_check_word_mean = this.state.to_check_word_mean ||{};
    let loadingMean = this.state.loadingMean;
    if(to_check_word) {
      let word = to_check_word_mean["word"] ||{};
      console.log("word",word);
      let collected = (collect_words[to_check_word.text] != null)
      let showViewMean = null;
      if(loadingMean == true){
        showViewMean = <CLoading/>
      }else
      {
        showViewMean = <div style={{textAlign: "left", marginTop: "4px",minHeight:"100px", position: "relative",padding:"4px",border:"1px solid #f2f2f2"}}>

          <div style={{position: "absolute", padding:"6px",top: 0, right: 4}}
               onClick={() => {
                 if (collected == false)
                 {
                   this.collectWord(to_check_word)
                 } else
                 {
                   this.unCollectWord(to_check_word)
                 }
               }}>

             <img width={18} src={collected ? likePng : notlikePng} />
          </div>

          <div style={{fontSize:"18px",fontWeight:"bold"}}>
            <div style={{display:"inline-block",verticalAlign:"top",width:"60%"}}> {this.state.to_check_word.text}</div>
          </div>
          <div className={css.middleText}>
            <div className={[css.box]}>{word.accent}</div>
            <div  className={[css.box]} style={{marginLeft:"20px"}}>
              <audio ref={"audio_en"} src={word.audio_en} />
              <div onClick={()=>{this.refs["audio_en"].play();}}>
                <img src={speakerPng} width={18}></img>
              </div>
            </div>
          </div>
          <div className={css.middleText}>{word.mean}</div>
          <div>
          </div>
        </div>;
      }

      let refName = `word_${to_check_word.id}`;
      let ref = this.refs[refName];

      let boxWidth = 260;
      let top = ref.offsetTop+20;
      let left = ref.offsetLeft - boxWidth/2;
      if(left < 0) left = 6;
      //console.log("base.width()",base.width())
      //console.log("left",left);

      if(left+boxWidth+2 >= base.width()){
        left = base.width()-boxWidth-6;
      }

      wordModal = <div style={{position:"absolute",top:top,left:left, minHeight:"100px",width:boxWidth,zIndex:100,background:"white"}} >
        {showViewMean}
      </div>
    }


    var toastView = <CToast hide={this.hideTooFastModal}>
      <div style={{color:"white"}}>you are too fast~</div>
    </CToast>

    var audio = this.refs.audioRef;




    let finished_model = null;
    if(this.state.showShare == true && this.state.user_state) {
      finished_model = <CModal style={{background: "rgba(0,0,0,0.3)"}}
                               close={() => this.setState({showShare: false})}
      >
        <div style={{  backgroundColor: "#f2f2f2",paddingBottom:"8px"}}>
        <CShareContent
            data={this.state.user_state}
            style={{
          marginTop: "100px",
          paddingTop: "10px",
          paddingBottom: "20px"
        }}></CShareContent>

          <div  style={{borderRadius:"4px",backgroundColor:"blue",color:"white",padding:"4px",margin:"20px",marginBottom:"20px"}} onClick={()=>this.share2Facebook()}> 分享到 Facebook </div>
        </div>
      </CModal>
    }


    var playerBar = null;

    if(article.audio_normal) {
      playerBar = <div style={{
        display: "block",
        height: "46px",
        boxShadow: "0px -2px 2px #e5e5e5",
        overflow: "scroll",
        backgroundColor: "#f2f2f2",
        position: "fixed",
        bottom: 0,
        width: "100%"
      }}>

        <audio ref={"audioRef"} controls src={article.audio_normal} style={{width: "100%", display: "none"}}>
          Your browser does not support this audio format.
        </audio>

        <div style={{textAlign: "center", marginTop: "5px"}}>

          <div style={{width: "100%", textAlign: "left", verticalAlign: "top", marginTop: "-4px"}}>
            <div style={{width: `${this.state.progress * 100}%`, height: "4px", background: "green"}}></div>
          </div>

          <div style={{textAlign: "center", position: "relative"}}>


            <div style={{
              fontSize: "16px",
              display: "inline-block",
              verticalAlign: "top",
              marginTop: "8px",
              marginRight: "30px"
            }} onClick={() => {
              this.playSpan(-5)
            }}>
              <img width={14} src={arrayLeftPng}/>
              5s
            </div>

            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "15px",
              position: "relative",
              padding: "5px",
              margin: "auto",
              display: "inline-block",
              verticalAlign: "top"
            }}
                 onClick={() => {
                   this.troggle(audio);
                 }}>
              <img src={this.state.playState == Playing ? stopPng : playPng} style={{width: "20px"}}/>
            </div>


            <div style={{
              fontSize: "16px",
              display: "inline-block",
              verticalAlign: "top",
              marginTop: "8px",
              marginLeft: "30px"
            }} onClick={() => {
              this.playSpan(5)
            }}>
              5s
              <img width={14} src={arrayRightPng}/>
            </div>
          </div>

        </div>
      </div>
    }

    return (

      <div>
        {finished_model}
        {wordModal}
        {this.state.showModelTooFast ? toastView:null}

        <div  onClick={(event)=>{
          this.closeWordModal();
        }}
          style={{display: "block", height: "100%", overflow: "scroll",minHeight:"400px"}}  ref={"sentenceScrollDiv"}>
          <div style={{fontSize:"18px",color:base.COLOR.gray1,fontWeight:"bold",marginTop:"6px",marginLeft:"10px"}}>
            {article.title}
          </div>

          <div style={inner_style.part}>
            {sentence_divs}
          </div>


          <div  style={{width:"100%",textAlign:"center",marginBottom:"40px",marginTop:"40px"}}>
            <div className={css.ibtn}
                 style={{padding:"6px",paddingTop:"10px",paddingBottom:"10px",fontSize:"16px", fontWeight:"bold",borderRadius:"4px",width:"90%",display:"inline-block",margin:"auto",backgroundColor:`${finished?"#5eca50":''}`,color:`${finished?"white":''}`}}
                onClick={()=>{
                  if (finished)
                  {
                    this.load_user_state();
                    this.setState({showShare:true});
                  }
                  else{ this.finish();}
                }}
            >
              {finished ? "FINISHED" : "FINISH"}
            </div>
          </div>


          <div style={{marginBottom:"80px"}}>
            {this.state.id ? <Comment id={this.state.id} user_id={this.state.user_id}></Comment> :null}
          </div>

        </div>


        {playerBar}

      </div>
    );
  }
}

const inner_style = {
  part: {display: "inline-block", verticalAlign: "top", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"}
}


const mapStateToProps = state => {
  return {
    redux_data: state,
  }
}
const ReadingPage = connect(mapStateToProps)(ReadingPage_)
export default ReadingPage;