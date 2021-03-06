import React, {Component} from 'react';
import * as base from "../base.js"
import {axios} from "../base.js"
import CCalendar from "./components/c_calendar.js"
import css from "./css/ireading.css"
import {connect} from "react-redux";

const BaseHost = base.BaseHostIreading();
import Moment from "moment"
import CSeperator from "./components/c_sperator";
import stopPng from "../../resource/imgs/stop.png";
import playPng from "../../resource/imgs/play.png";
import arrayLeftPng from "../../resource/imgs/array_left.png"
import arrayRightPng from "../../resource/imgs/array_right.png"

 class ReadingMinePage_ extends Component
{

  constructor(props)
  {
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    super(props);
    this.state = {
      data: {},
      date:new Moment(),
    };

    this.load = this.load.bind(this);
    this.logout = this.logout.bind(this);
    this.audioRef = new Object();
    this.timeoutPlay = null;
    this.preMonth = this.preMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
  }

  componentDidMount()
  {
    this.load();
  }

  preMonth(){

    var date = this.state.date;
    var preMonth = date.month(date.month() - 1).endOf('month');
    this.setState({date:preMonth});
  }

  nextMonth(){
    var now = new Moment();
    var date = this.state.date;
    var nextMonth = date.month(date.month() + 1).endOf('month');
    if(nextMonth > now){
      nextMonth = now;
    }
    this.setState({date:nextMonth})
  }

  load()
  {
    var that = this;
    this.setState({loading: true});

    var id = this.state.id;
    axios.get(`${BaseHost}/reading/get_user_state.json`).then((res) => {
      console.log("res", res);
      that.setState({data: res.data.data});
      console.log(that.state);
      // that.load_plans(user.id)
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
    })
  }

  logout()
  {
    if(window.Android)
    {
      var result = window.Android.logout();
    }
    else{
      base.request("post",`${BaseHostIreading()}/reading/logout.json?timestamp=${new Date().getTime()}`)
    }
    console.log("logout");
  }

  render()
  {
    if (!this.state.data)
    {
      return null;
    }

    var user = this.state.data.user || {};

    var state = this.state.data.state || {};
    var date = this.state.date;
    var finish_dates_ = this.state.data.finish_dates || [];

    var events = finish_dates_.map(t => {
        let tmp = t.split("T")[0];
        return base.formatDate(tmp);
      }
    )

  
    
 
    let logined = (user != null && user != {} && user["access_token"]);

    let name =  user.name;

    var tips = base.getTipByLan();
    let img_ = user.img || "https://freepic.store/static/reading/resources/imgs/bee02_squire.jpg"

    let notLogin = tips.loginOrSignUp;
    return (
      <div style={{padding: "0px"}}>

        <div /*style={{background: 'linear-gradient(to bottom, gray, #ffffff)'}}*/>
          <div className={css.bigText}
               style={{paddingTop: "20px", 
                      paddingBottom: "20px",
                      paddingLeft: "8px",
                      border: "1px solid #e9e4d9",
                      minHeight:"70px"
                      }}>


           {/* {logined?<img style={{borderRadius:"20"}} width={40} height={40} src={img_ } /> : null}  */}

            {logined ? 
            <span style={{fontSize:"12px"}}>{name}</span>
            : <span onClick={()=>{base.goto("/signin")}} style={{fontSize:"12px"}}>{notLogin}</span>
          }

            {/* <div style={{position: "absolute", top: "10px", right: "10px",fontSize:"12px",color:"white",border:"1px solid",borderColor:"white",padding:"4px",borderRadius:"2px"}}
                 onClick={() => { console.log("goto setting");base.goto("/setting_page")} }>
              {tips.settingTip}
            </div> */}
          </div>

          <div style={{marginTop: "0px", marginBottom: "10px"}}>
            <div style={inner_style.statistics_item}>
              <div style={inner_style.statistics_count}>{state.readed_words || 0} </div>
              <div style={inner_style.statistics_title}> {tips.statistics_1}</div>
            </div>
            <div style={inner_style.statistics_item}>

              <div style={inner_style.statistics_count}> {state.read_days || 0}  </div>
              <div style={inner_style.statistics_title}> {tips.statistics_2}</div>
            </div>
            <div style={inner_style.statistics_item}>

              <div style={inner_style.statistics_count}>  {this.state.data.readed_count || 0}  </div>
              <div style={inner_style.statistics_title}> {tips.statistics_3}</div>
            </div>
          </div>
        </div>


        <div style={{textAlign: "center", marginTop: "20px"}}>
          <div style={{textAlign: "center",position:"relative"}}>

            <div style={{fontSize:"16px",display:"inline-block",verticalAlign:"top" ,marginTop:"8px",marginRight:"20px"}} onClick={()=>{this.preMonth()}}>
              <img width={14} src={arrayLeftPng}/>
            </div>

            <div style={{width:"200px",height:"30px",position:"relative",padding:"5px",color:base.COLOR.gray1,margin:"auto",display:"inline-block",verticalAlign:"top"}}>
             {date?date.format("YYYY-MM"):null}
            </div>

            <div style={{fontSize:"16px",display:"inline-block",verticalAlign:"top",marginTop:"8px",marginLeft:"2px"}} onClick={()=>{this.nextMonth()}}>
              <img width={14} src={arrayRightPng}/>
            </div>
          </div>

          <CCalendar width={400} today={date} events={events} style={{}} onPress={() => {
          }}/>
        </div>

        <CSeperator />

        <div style={{textAlign:"center", width:"90%",borderRadius:"4px",margin:"auto",padding:"10px",backgroundColor:"gray",color:"white",fontWeight:"bold",marginTop:"20px"}}
             onClick={()=>base.goto("/collected_words")}>
          {tips.collectWords}
          </div>  

          <div style={{textAlign:"center", width:"90%",borderRadius:"4px",margin:"auto",padding:"10px",backgroundColor:"gray",color:"white",fontWeight:"bold",marginTop:"20px"}}
             onClick={() => { console.log("goto setting");base.goto("/setting_page")} }>
             {tips.settingTip}
          </div>  

      </div>
    );
  }
}

const inner_style = {
  statistics_item: {width: "33.333%", display: "inline-block", border: "1px solid #e9e4d9", padding: "8px"},
  statistics_count: {fontSize: "20px", fontWeight: "bold", textAlign: "center"},
  statistics_title: {
    fontSize: "12px",
    color: "black",
    fontWeight: "normal",
    textAlign: "center",
    padding: "4px,0,4px 0"
  },

  part: {display: "inline-block", verticalAlign: "top", width: "44%", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"},
  box: {"padding": "2px", "margin": "4px"},
  btn: {display: "inline-block", verticalAlign: "top", "padding": "2px", "margin": "4px", border: "1px solid"}
}


const mapStateToProps = state => {
  return {
    redux_data: state,
  }
}
const ReadingMinePage = connect(mapStateToProps)(ReadingMinePage_)
export default ReadingMinePage;