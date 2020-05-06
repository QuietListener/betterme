import React, {Component} from 'react';
import * as base from "../base.js"
import {axios} from "../base.js"
import CCalendar from "./components/c_calendar.js"
import css from "./css/ireading.css"


const BaseHost = base.BaseHostIreading();
import Moment from "moment"
import CSeperator from "./components/c_sperator";
import stopPng from "../../resource/imgs/stop.png";
import playPng from "../../resource/imgs/play.png";
import arrayLeftPng from "../../resource/imgs/array_left.png"
import arrayRightPng from "../../resource/imgs/array_right.png"
import CShareContent from "./components/c_share_content";
import CModal from "./components/c_modal";

export default class SharePage extends Component
{

  constructor(props)
  {
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    super(props);
    let user_id = base.getParameterByName("user_id",window.location.href);
    this.state = {
      user_id:user_id,
      data: {},
      date:new Moment(),
    };

    this.load_user_state = this.load_user_state.bind(this);
   // this.load = this.load.bind(this);
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

  componentDidMount()
  {
      this.load_user_state();
      //this.load();
  }

  //
  // preMonth(){
  //   var date = this.state.date;
  //   var preMonth = date.month(date.month() - 1).endOf('month');
  //   this.setState({date:preMonth});
  // }
  //
  // nextMonth(){
  //   var now = new Moment();
  //   var date = this.state.date;
  //   var nextMonth = date.month(date.month() + 1).endOf('month');
  //   if(nextMonth > now){
  //     nextMonth = now;
  //   }
  //   this.setState({date:nextMonth})
  // }
  //
  // load()
  // {
  //   var that = this;
  //   this.setState({loading: true});
  //
  //   var id = this.state.id;
  //   axios.get(`${BaseHost}/reading/get_user_state.json`).then((res) => {
  //     console.log("res", res);
  //     that.setState({data: res.data.data});
  //     console.log(that.state);
  //     // that.load_plans(user.id)
  //   }).catch(e => {
  //     console.log(e);
  //     this.setState({loading: false});
  //   })
  // }


  render()
  {
    // if (!this.state.data)
    // {
    //   return null;
    // }

    // var user = this.state.data.user || {};
    // var state = this.state.data.state || {};
    // var date = this.state.date;
    // var finish_dates_ = this.state.data.finish_dates || [];
    //
    // var events = finish_dates_.map(t => {
    //     let tmp = t.split("T")[0];
    //     return base.formatDate(tmp);
    //   }
    // )

      var user = this.state.user_state.user || {};
      var state = this.state.user_state.state || {};

      if(user && user.name && state ){
          window.title = user.name +" 完成了 "+(state.)
      }


    return (
    <div style={ {backgroundColor: "#f2f2f2",height:"100%",minHeight:base.height()+"px"}}>
      <CShareContent user_id={this.state.user_id}
                     data={this.state.user_state}
                     style={{
                        backgroundColor: "#f2f2f2",
                        paddingTop: "30px",
                        paddingBottom: "20px",
                         minHeight:"100px"
                      }}></CShareContent>
    </div>
    );
  }
}

const inner_style = {
}