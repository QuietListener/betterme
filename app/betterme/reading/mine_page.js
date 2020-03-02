import React, {Component} from 'react';
import * as base from "../base.js"
import {axios} from "../base.js"
import CCalendar from "./components/c_calendar.js"
import css from "./css/ireading.css"


const BaseHost = base.BaseHostIreading();
import Moment from "moment"
import CSeperator from "./components/c_sperator";

export default class ReadingMinePage extends Component
{

  constructor(props)
  {
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    super(props);
    this.state = {
      data: {}
    };

    this.load = this.load.bind(this);
    this.logout = this.logout.bind(this);
    this.audioRef = new Object();
    this.timeoutPlay = null;

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
    var finish_dates_ = this.state.data.finish_dates || [];

    var events = finish_dates_.map(t => {
        let tmp = t.split("T")[0];
        return base.formatDate(tmp);
      }
    )

    return (
      <div style={{padding: "0px"}}>

        <div className={[css.background_green]}>
          <div className={css.bigText}
               style={{paddingTop: "20px", paddingBottom: "20px", paddingLeft: "8px", border: "1px solid #e9e4d9"}}>
            {user.name}

            <div style={{position: "absolute", top: "4px", right: "4px",fontSize:"12px",color:"white",border:"1px solid",borderColor:"white",padding:"4px"}}
                 onClick={() => {
                   this.logout()
                 }}
            >
              logout
            </div>
          </div>

          <div style={{marginTop: "0px", marginBottom: "10px"}}>
            <div style={inner_style.statistics_item}>
              <div style={inner_style.statistics_count}>{state.readed_words || 0} </div>
              <div style={inner_style.statistics_title}> words</div>
            </div>
            <div style={inner_style.statistics_item}>

              <div style={inner_style.statistics_count}> {state.read_days || 0}  </div>
              <div style={inner_style.statistics_title}> days</div>
            </div>
            <div style={inner_style.statistics_item}>

              <div style={inner_style.statistics_count}>  {this.state.data.readed_count || 0}  </div>
              <div style={inner_style.statistics_title}> articles</div>
            </div>
          </div>
        </div>


        <div style={{textAlign: "center", marginTop: "10px"}}>
          <CCalendar width={400} today={new Moment()} events={events} style={{}} onPress={() => {
          }}/>
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
    color: "#f2f2f2",
    fontWeight: "normal",
    textAlign: "center",
    padding: "4px,0,4px 0"
  },

  part: {display: "inline-block", verticalAlign: "top", width: "44%", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"},
  box: {"padding": "2px", "margin": "4px"},
  btn: {display: "inline-block", verticalAlign: "top", "padding": "2px", "margin": "4px", border: "1px solid"}
}