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
import loadingGif from "../../resource/imgs/Spinner.gif"
const BaseHost = base.BaseHostIreading();
const Playing = 1;
const Stopped = 2;
import { hashHistory } from 'react-router'
import CModalLogin from './components/c_modal_login';
import CSeperator from './components/c_sperator';
import CBack from './components/c_back';

 class ReadingPage_ extends Component
{

  constructor(props)
  {
    super(props)
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    var id = this.props.params.id || parseInt(window.location.href.split("#")[1].split("/")[2]);
    console.log("id", id);

    this.state = {
      user_id:null,
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
      showShare:false, //分享modal,
      collectLoading:false,
      showLoginModal:false//打开
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
    this.get_next_article = this.get_next_article.bind(this);
    this.audioRef = new Object();
    this.wordAudioRef = new Object();
    this.timeoutPlay = null;
    this.showLoginModal = this.showLoginModal.bind(this);
    this.goto = this.goto.bind(this);

    this.interval = null;
    this.lan = base.getLan();
  }

  componentDidMount()
  {
    this.load();
    document.addEventListener("keydown", this.onKeyDown)
    if(this.interval != null){
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      this.scrollSentence();
    }, 500);

    window.share_result = this.share_result;
    this.load_user_state(false);
    this.get_next_article();
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

  playWordAudio(word){
    console.log("playWordAudio",word);
    console.log(word.audio_en);
    var audio = this.refs.wordAudio;
    
    audio.src= word.audio_en;
    audio.play();

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


  showLoginModal(){
    if(!base.getAccessToken()){
      this.setState({showLoginModal:true});
      return true;
    }

    return false;
  }

  hideTooFastModal(){
    this.setState({showModelTooFast:false});
  }

  finish()
  {
    if(this.showLoginModal()){
      return;
    }

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
    this.setState({finishLoading:true});
    axios.post(url, params).then((res) => {
      console.log("res", res);
      this.load();

      that.props.dispatch(get_all_finished_articles());
      that.props.dispatch(get_all_articles());
      that.load_user_state();

      setTimeout(()=>this.setState({finishLoading:false}), 4000);

    }).catch(e => {
      console.log(e);
      this.setState({finishLoading:false});
      that.load();
    })

    this.get_next_article();
  }

  load()
  {
    var that = this;
    this.setState({loading: true});

    var id = this.state.id;
    axios.get(`${BaseHost}/reading/get_article_data.json?article_id=${id}&lan=${this.lan}`).then((res) => {
      console.log("res", res);
      that.setState({data: res.data.data});
      console.log(that.state);
      // that.load_plans(user.id)
      this.setState({loading: false,finishLoading:false,collectLoading:false});
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

    base.putValue("showed_mean_tip","1")
    that.setState({loadingMean: true, to_check_word_mean: null});

    axios.get(`${BaseHost}/reading/dict?word=${word.text}&lan=${this.lan}`).then((res) => {
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

    if(this.showLoginModal()){
      return;
    };

    var params = {
      word_id: w.id,
    }

    var url = `${BaseHost}/reading/collect_word.json`;
    console.log(url);
    this.setState({collectLoading:true});
    axios.post(url, params).then((res) => {
      console.log("res", res);
      this.getCollectWordsIds();

      setTimeout(()=>{
        this.setState({collectLoading:false});
      },2000);
     
    }).catch(e => {
      console.log(e);
      this.setState({collectLoading:false});
    })
  }

  unCollectWord(w){
    var params = {
      word_id: w.id,
    }

    var url = `${BaseHost}/reading/uncollect_word.json`;
    console.log(url);
    this.setState({collectLoading:true});
    axios.post(url, params).then((res) => {
      console.log("res", res);
      this.getCollectWordsIds();
      
      setTimeout(()=>{
        this.setState({collectLoading:false});
      },1000);

    }).catch(e => {
      console.log(e);
      this.setState({collectLoading:false});
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



  get_next_article(){

    var that = this;
    axios.get(`${BaseHost}/reading/get_next_article.json?article_id=${this.state.id}&time=${new Date().getTime()}`).then((res) => {
      console.log("res", res);
      that.setState({recomends: res.data.data});
      console.log(that.state);    
    }).catch(e => {
      console.log(e);
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
    let lan = base.getLan();
    var url =  base.BaseHostIreading()+"/reading/share_page?timestamp="+new Date().getTime()+"&user_id="+this.state.user_id+"lan="+lan+"/#/share_page";
    let content = "test";
    if(window.Android)
    {
      console.log("share2Facebook android");
      var result = window.Android.share2Facebook(url,content);
    }else{
      console.log("share2Facebook other ");
    }
  }


  goto(a){
    if(a.parent_id ){
      console.log("goto",a);
      this.setState({id: a.id,data:{}})
      window.scrollTo(0, 0);
      setTimeout(()=>{
        this.componentDidMount();
      },200);
      
    }else{
      base.goto(`/article_group/${a.id}`)
    }
    //window.location.reload();
  }

  load_user_state(share) {
    var that = this;
    this.setState({loading: true});
    var id = this.state.id;
    let added = this.state.user_id == null?"":"?user_id="+this.state.user_id;

    axios.get(`${BaseHost}/reading/get_user_state.json${added}`).then((res) => {
      console.log("res", res);
      that.setState({user_state: res.data.data,loading:false,showShare:share,user_id:res.data.data.user.id});
      console.log(that.state);
      // that.load_plans(user.id)
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
    })
  }
  render()
  { 
    let tips = base.getTipByLan();
    var lan = base.getLan();

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
    var flag = false;
    var count = 0;
    var showed_mean_tip = base.getValue("showed_mean_tip") !=null
    var sentence_divs = sentences.map((s, index) => {

      let start = s.start_word_order;
      let end = s.end_word_order;
      if (maxOrder <= start) maxOrder = start;
      if (maxOrder <= end) maxOrder = end;

      let s_word_divs = words.filter((w) => {
        return w.order >= start && w.order <= end;
      }).map((w,widx) => {

        let collected = (collect_words[w.text] != null)
        let backgroundColor = "";
        let color = "";
        let fontWeight = "500";
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


        
      
        let ret =  <div ref={`word_${w.id}`} style={{position:"relative",display: "inline-block", padding: `${padding}px`,margin:`${margin}px`,fontSize:"14px",marginBottom:"6px",backgroundColor:backgroundColor,color:color,fontWeight:fontWeight,borderRadius:"2px"}}

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
        >{w.text}
        
        { index==0 && widx == 6 && showed_mean_tip==false ?
        <div style={{position:"absolute",top:"-30px",right:"-10px",background:"black",color:"white", padding:"2px",borderRadius:"4px",display:"inline-block",width:"140px"}}>
            {tips.wordMeanTip}
        </div> : null}

        </div>

       if(flag == false) {
          flag = true;

          
       }

       count+=1;
          
       return ret; 
      })



     
      let istw = lan == "zh_tw" ;

      let trans_div = <div   style={{ padding: "4px", border: "0px solid", fontSize:"14px", color: color,fontWeight:"500"}}> {istw == true ? s.trans_tw : s.trans_zh} </div>

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
          <div style={{display:"inline-block",fontSize:"12px",fontWeight:"bold",color:"white",backgroundColor:"#494949",padding:"1px 5px 2px 5px ",marginLeft:"8px"}} onClick={()=>this.troogleTrans(s.id)}>{tips.transTip}</div>
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
                 if(this.state.collectLoading == true){
                   return ;
                 }

                 if (collected == false)
                 {
                   this.collectWord(to_check_word)
                 } else
                 {
                   this.unCollectWord(to_check_word)
                 }
               }}>

            {this.state.collectLoading == true ?<img width={18} src={loadingGif} /> : <img width={18} src={collected ? likePng : notlikePng} />}
          </div>

          <div style={{fontSize:"18px",fontWeight:"bold"}}>
            <div style={{display:"inline-block",verticalAlign:"top",width:"60%"}}> {this.state.to_check_word.text}</div>
          </div>
          <div className={css.middleText}>
            <div className={[css.box]}>{word.accent}</div>
            <div  className={[css.box]} style={{marginLeft:"20px"}}>
              <div onClick={()=>{this.playWordAudio(word)}}>
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
      <div style={{color:"white",textAlign:"center"}}>{tips.toofast}</div>
    </CToast>

    var audio = this.refs.audioRef;




    let finished_model = null;
    if(this.state.showShare == true && this.state.user_state) {
      finished_model = <CModal style={{background: "rgba(0,0,0,0.3)"}} >
        <div style={{  backgroundColor: "#f2f2f2",paddingBottom:"8px"}}>
        <CShareContent
            data={this.state.user_state}
            style={{
          marginTop: "100px",
          paddingTop: "10px",
          paddingBottom: "20px"
        }}></CShareContent>

          <div  style={{borderRadius:"4px",backgroundColor:"gray",color:"white",padding:"4px",margin:"20px",marginBottom:"20px"}} onClick={()=>this.share2Facebook()}> {tips.shareTo} Facebook </div>
          <div  style={{borderRadius:"4px",backgroundColor:"white",color:"black",padding:"4px",margin:"20px",marginBottom:"20px"}} onClick={()=>this.setState({showShare:false})}> close </div>
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
        width: "100%",
        maxWidth:`${base.maxWidth}px`
      }}>

        <audio key={"audio_"+article.id} ref={"audioRef"} controls src={article.audio_normal} style={{width: "100%", display: "none"}}>
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


    var finish_view = null;
    if(this.state.finishLoading == true){
      finish_view = <img width={18} src={loadingGif} />;
    }else{
      finish_view = finished ? "FINISHED" : "FINISH";
    }


   var reco_article_div = null; 
   //推荐
   if(this.state.recomends && this.state.recomends.brothers ){
     let brothers = this.state.recomends.brothers;
     let next_a_ = brothers.filter(t=>{
       return t.id>   parseInt(this.state.id+"");
     });

     let pre_a_ = brothers.filter(t=>{
      return t.id < parseInt(this.state.id+"");
    });

    let next_a = next_a_.length > 0 ? next_a_[0] : null;
    let pre_a = pre_a_.length > 0 ? pre_a_[pre_a_.length - 1] : null;

    let next_a_div= null;
    if(next_a){
      let title_n = '';
      if(base.isZh()){
        title_n = next_a.title_cn || next_a.title;
      }

      next_a_div = <div style={{margin:"auto",textAlign:"center",padding:"4px",marginLeft:"2px",width:"45%",border:"1px solid #e5e5e5",backgroundColor:'white'}}
                       className={css.ibtn}
                        onClick={()=>this.goto(next_a)}>
                       <span style={{color: base.COLOR.red,fontSize:"10px"}}>{tips.nextArticle}</span>
                      </div>
    }

    let pre_a_div= null;
    if(pre_a){
      let title_p = '';
      if(base.isZh()){
        title_p = pre_a.title_cn || pre_a.title;
      }

      pre_a_div = <div style={{margin:"auto",textAlign:"center",padding:"4px",width:"45%",border:"1px solid #e5e5e5",backgroundColor:'white'}}
                       className={css.ibtn}
                        onClick={()=>this.goto(pre_a)}>
                         <span style={{color: base.COLOR.red,fontSize:"10px"}}>{tips.preArticle}</span>
                      </div>
    }

    

    reco_article_div = 
        <div  style={{width:"100%",textAlign:"center",marginBottom:"20px",marginTop:"20px"}}>
          {pre_a_div}
          {next_a_div}
        </div>
   }

   

   let loginModal = this.state.showLoginModal == true ? <CModalLogin hide={()=>this.setState({showLoginModal:false})}></CModalLogin> :null;

    return (

      <div>
        <audio ref={"wordAudio"} src={"http://dict.youdao.com/dictvoice?audio=good&type=2"}  style={{width:"100px",height:"30x"}} />
       
        {loginModal}
        {finished_model}
        {wordModal}
        {this.state.showModelTooFast ? toastView:null}

        {this.state.loading == true? <CLoading /> : null}

       
        <CBack style={{position:"fixed",right:"8px",top:"8px",width:"30px",height:"30px"}}></CBack>

        <div  onClick={(event)=>{
          this.closeWordModal();
        }}
          style={{display: "block", height: "100%", overflow: "scroll",minHeight:"400px",marginTop:"6px"}}  ref={"sentenceScrollDiv"}>
          <div style={{fontSize:"18px",fontWeight:"bold",marginTop:"6px",marginLeft:"10px",fontWeight:"bold"}}>
            {article.title}
          </div>

          <div style={inner_style.part}>
            {sentence_divs}
          </div>


         
          <div  style={{width:"100%",textAlign:"center",marginBottom:"40px",marginTop:"40px"}}>
            <div className={css.ibtn}
                 style={{padding:"6px",paddingTop:"10px",paddingBottom:"10px",fontSize:"16px", fontWeight:"bold",borderRadius:"4px",width:"90%",display:"inline-block",margin:"auto",backgroundColor:`${finished?base.COLOR.gray1:''}`,color:`${finished?"white":''}`}}
                onClick={()=>{

                    if (finished)
                    {
                      this.load_user_state(true);
                      this.setState({showShare:true});
                    }
                    else{ 
                      this.finish();
                    }
                }
              }
            >
              {finish_view}
            </div>
            <div style={{fontSize:"10px",color:base.COLOR.gray1,marginTop:"4px"}}>{!finished ?tips.finishTip:null}</div>
          </div>


          {/**推荐 */}      
          {reco_article_div}

        <CSeperator/>
          <div style={{marginBottom:"80px",marginTop:"10px"}}>
            {this.state.id ? <Comment key={this.state.id} id={this.state.id} user_id={this.state.user_id} showLoginModal={this.showLoginModal}></Comment> :null}
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