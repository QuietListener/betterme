import React, {Component} from 'react';
import '../../css/app.css';
import * as base from "../base.js"
import {axios} from "../base.js"


const BaseHost = base.BaseHostIreading();

const SplitSentence = 1;
const WordGroup = 2;

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
      audio_splits: [],
      mode:SplitSentence,
      troogle_ids:[]
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
    this.troogle_word_group = this.troogle_word_group.bind(this);
    this.choose_word_group = this.choose_word_group.bind(this);
    this.saveWord = this.saveWord.bind(this);
    this.updateTrans = this.updateTrans.bind(this);

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
    this.setState({loading: true});
    axios.get(`${BaseHost}/reading/get_article_data.json?article_id=${id}`).then((res) => {
      console.log("res", res);


      var sentences = res.data.data.sentences || [];

      let data_ = {}
      for(let i = 0; i < sentences.length; i++){
        let s = sentences[i];
        data_["trans_"+s.id] = s.trans_zh;
      }

      data_["data"] = res.data.data;
      that.setState(data_);
      console.log(that.state);
      // that.load_plans(user.id)
      this.setState({loading: false});
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
    this.refs.sId.value = "";
  }

  updateTrans(s_id) {

    var trans = this.state["trans_"+s_id];
    var id = this.state.id;
    var params = {
      sentence_id: s_id,
      article_id: id,
      trans:trans
    }
    console.log("save trans",params);
    this.setState({loading: true});
    var url = `${BaseHost}/reading/update_trans.json`;
    console.log(url);
    axios.post(url, params).then((res) => {
      console.log("res", res);
      this.load();
      this.setState({loading: false});
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
      this.load();
    })


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
    this.setState({loading: true});
    axios.post(url, params).then((res) => {
      console.log("res", res);
      this.load();
      that.setState({audio_splits:[]});
      this.setState({loading: false});
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
    this.setState({loading: true});
    axios.post(url, params).then((res) => {
      console.log("res", res);
      this.load();
      this.setState({loading: false});
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
      this.load();
    })

  }


  saveWord()
  {

    let order = this.refs.order.value
    let text = this.refs.text.value
    var id = this.state.id;

    var params = {
      article_id: id,
      order: order,
      text: text
    }

    var url = `${BaseHost}/reading/update_word.json`;
    console.log(url);
    axios.post(url, params).then((res) => {
      console.log("res", res);
      this.load();
      this.setState({loading: false});
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

  troogle_word_group(){
    var id = this.state.id;
    let troogle_ids = this.state.troogle_ids || [];
    let word_group_ids =  troogle_ids.join(",");

    axios.get(`${BaseHost}/reading/troogle_phrase.json?article_id=${id}&ids=${word_group_ids}`).then((res) => {
      console.log("res", res);
      this.load();
      this.setState({troogle_ids:[]});
    }).catch(e => {
      console.log(e);
      alert(e.message);
      this.setState({loading: false});
    })
  }


  choose_word_group(word_group_id){
    var id = this.state.id;
    console.log("troogle_word_group:"+word_group_id);
    let troogle_ids = this.state.troogle_ids || [];

    let idx = troogle_ids.indexOf(word_group_id);

    if(idx >= 0 ){
        troogle_ids.splice(idx,1);
    }else{
      troogle_ids.push(word_group_id);
    }
   
    this.setState({troogle_ids:troogle_ids});
  }


  render()
  {
    var article = this.state.data.article || {};
    var words = this.state.data.words || [];
    var sentences = this.state.data.sentences || [];
    var splits = this.state.data.splits || [];
    var word_groups = this.state.data.word_groups || [];
    var end_word_orders = sentences.map(t=>t.end_word_order);
    var start_word_orders = sentences.map(t=>t.start_word_order);
    var maxOrder = -1;



    let phase_map = {}
    for(let i = 0; i < word_groups.length; i++){
      let wg = word_groups[i];
      let ids = wg.word_ids.split(",")
      for(let j = 0; j < ids.length; j++){
        phase_map[ids[j]] = wg;
      }
    }

    var loading = this.state.loading;
    var loading_div = loading == true ? <div style={{position:"fixed",top:"2px",right:"2px"}}>loading...</div>: null;

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
          {index}
          <span style={{marginLeft:"4px",fontWeight:"bold",color:"white",backgroundColor:"black",marginRight:"4px"}}>word</span><span>id:{s.id} , {start}-> {end}</span>
          <span style={{marginLeft:"4px",fontWeight:"bold",color:"white",backgroundColor:"black"}}>音频</span>
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
        <div style={{display: "inline-block",border:"1px solid"}}>
          <textarea  placeholder={"翻译"} value={this.state["trans_"+s.id]}  cols={60} rows={2} onChange={(event)=>this.handleChange("trans_"+s.id, event)}/>
          <span style={{marginLeft:"10px",background:"black",color:"white"}} onClick={()=>this.updateTrans(s.id)}>save tran</span>
        </div>
      </div>
    })


    let color=["red","green"]
    let count_ = 0;
    var words_divs = words.map(w => {
      let border = w.order <= maxOrder ? "1px solid green" : "1px solid black";

      let color = "black"
      let background = ""
      if(phase_map[w.id] != null) {
        if(phase_map[w.id].enabled == true){
          background="red";
        }else{
          background="gray"
        }
        
        color="white"
      }

      if(end_word_orders.indexOf(w.order) >=0){
        border="3px solid yellow";
      }else if(start_word_orders.indexOf(w.order) >= 0){
        border="3px solid blue";
      }

      //console.log(maxOrder + ":" + w.order + ":" + color);
      return <div
        style={{ display: "inline-block", margin: "2px", color:color,background:background,border:border}}
        onClick={() => this.choose(w.order)}>
        <div>{w.text}</div>
        <div>{w.order}</div>
      </div>
    })

    let split_sentence_div =   <div>
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


        <div style={{border:"1px solid",marginTop:"20px"}}>
          <div style={{ display: "inline-block",  margin: "2px",width:"160px" ,verticalAlign:"top"}}>
            修改单词:
          </div>

          <div style={{ display: "inline-block",  margin: "2px",width:"160px" ,verticalAlign:"top"}}>
            order:<input ref={"order"} style={{width:"100px"}}/>
          </div>

          <div style={{ display: "inline-block",  margin: "2px" ,width:"200px",verticalAlign:"top"}}>
            text:<input ref={"text"} style={{width:"120px"}}/>
          </div>
          <br/><br/>

          <div style={{ display: "block", border: "1px solid ", background: "black", padding: "2px", color: "white" }}
               onClick={()=>this.saveWord()}>
            save
          </div>
        </div>

    </div>
    </div>

    let unique = []
    let troogle_ids = this.state.troogle_ids || [];
    let word_group_items = word_groups.map(item=>{
      if(unique.indexOf(item.text) >= 0)
      {
        return null;
      }
      else
      {
        unique.push(item.text);

        let color = "black"
        if(item.enabled == true || item.enabled == 1){
          color = "red";
        }

        let border = ""
        if(troogle_ids.indexOf(item.id) >= 0){
          border = "1px solid"
        }
        return <p onClick={()=>this.choose_word_group(item.id)} style={{color:color,border:border}}>
          {item.text} : {item.mean_cn}
        </p>
      }
    });

    let word_group_div=<div>

      <div onClick={this.troogle_word_group} style={{backgroundColor:"black",color:"white",padding:"4px",margin:"4px"}}>troogle</div>
      {word_group_items}
    </div>


   
    return (
      <div style={{height:"100%"}}>
        {loading_div}

      <div style={{position:"fixed",right:10,top:20,padding:"6px",backgroundColor:"black",color:"white"}}
                                onClick={()=>{this.setState({mode: (this.state.mode == SplitSentence ? WordGroup: SplitSentence)})}}>
            {this.state.mode == SplitSentence ? "s":"wg" }
      </div>


      <div style={{display:"block",height:"80%",maxHeight:"440px",overflow:"scroll",marginBottom:"20px"}}>
        <div style={inner_style.part}>{words_divs}</div>


        <div style={inner_style.part}>

          {this.state.mode == SplitSentence ? split_sentence_div : word_group_div}


        </div>
      </div>



        <div style={{display:"block",height:"200px",background:"white", height:"250px",width:"100%",bottom:0,overflow:"scroll"}}>

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