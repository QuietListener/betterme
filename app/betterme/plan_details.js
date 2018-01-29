import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import axios from "axios"
import * as base from "./base.js"
import CCalendar from "../components/c_calendar.js"
import moment from "moment"
const ThumbsUp = require('react-icons/lib/fa/thumbs-up')
import CDaka from "../components/c_daka.js"
import CLoading from "../components/loadings/c_loading.js"

import "../css/app.css"

class PlanDetails extends Component{

  constructor(props)
  {
    super(props)
    var id = this.props.params.id;
    this.state={id:id,loading:true};

    this.componentDidMount = this.componentDidMount.bind(this);
    this.load = this.load.bind(this);
  }

  componentDidMount()
  {
    this.load();
    console.log("componentDidMount",this.state);
  }

  load_records()
  {
    var that = this;
    axios.get(`${base.BaseHost}/index/plan_records.json?plan_id=${this.state.id}`).then((res)=>{
      console.log("res",res);
      var daka_records = res.data.data;
      that.setState({daka_records:daka_records});
      console.log(that.state);
    })
  }

  load()
  {
    var that = this;
    that.daka_start();
    axios.get(`${base.BaseHost}/index/plan.json?id=${this.state.id}`).then((res)=>{
      console.log("res",res);
      var plan = res.data.data;
      that.setState({plan_info:plan,loading:false});
      console.log(that.state);
    }).catch(e=>{
      this.daka_error(e);
    })

    this.load_records();
  }

  daka_start()
  {
    this.setState({loading:true})
  }

  daka_error(e)
  {
    console.error(e);
    this.setState({loading:false})
  }

  render(){

    var loading_view = <CLoading/>
    if(this.state.loading == false)
      loading_view = null;

    var plan_info = this.state.plan_info;
    var daka_records = this.state.daka_records ||[];

    if(plan_info == null || daka_records == null)
      return loading_view;


    daka_records =  daka_records == null ? [] :daka_records;

    var daka_views = daka_records.map((item)=>{

      var images = [];
      if(item.images != null)
      {
        let images_ = item.images;
        images = JSON.parse(images_);
      }

      var images_view = null;
      if(images!=null && images.length > 0)
      {
        images_view = images.map((img) => {
          let url = `${base.IMG_BASE}/${img}`;
          return <img style={{margin: "4px", border: "1px solid #f2f2f2", borderRadius: "2px"}} width={80} height={80}
                      src={url}/>
        })
      }


      return <div style={{position:"relative",width:"100%",padding:"8px",borderRadius:"2px",border:"1px solid #f2f2f2",padding:"4px",marginBottom:"10px",backgroundColor:"#f2f2f2"}}>

         <div style={{fontSize:"14px",margin:"4px",borderBottom:"1px solid #f2f2f2",paddingBottom:"4px"}}>
           <div style={{color:"#808080",fontSize:"12px",textAlign:"left"}}>
             {base.formatDateTime(item.created_at)}
           </div>
           <p style={{color:base.COLOR.red}}>{item.desc}</p>
           </div>

         <div>
             {images_view}
          </div>

        {<ThumbsUp style={{position:"absolute",top:2,right:2,fontSize:20,color:base.COLOR.red}}/>}

      </div>
    })


    var start = base.formatDate(plan_info.start);
    var end = base.formatDate(plan_info.end);


    var events =  daka_records.map((item)=>{
      return base.formatDate(item.created_at);
    })
    return <div style={{backgroundColor:"white"}}>

      {loading_view}

      <div style={{textAlign:"left",borderBottom:"1px solid #f2f2f2",marginBottom:"6px",padding:"8px",backgroundColor:base.COLOR.red}}>

        <p style={{color:"white"}}> {plan_info.name}</p>
        <p style={{color:"white",fontSize:"12px"}}> 从{start} 到  {end}</p>

      </div>

      <div style={{textAlign:"center",borderBottom:"1px solid #f2f2f2"}}>
        <CCalendar start={start} end={end} today={moment(start)} events={events}></CCalendar>
      </div>

      <div style={{backgroundColor:"white",padding:"18px",minHeight:400}}>
            <div style={{paddingBottom:"8px",textAlign:"center",fontSize:"14px",color:"#808080"}}>--- 我的打卡记录 ---</div>

        <CDaka plan={this.state.plan_info}
               daka_success={this.componentDidMount}
               daka_start={()=>this.daka_start()}
               daka_error={(e)=>this.daka_error(e)}
               style={{marginBottom:"20px"}} />
        <div style={{height:"20px"}} />
        {daka_views}
      </div>

      {/*<div onClick={()=>this.props.test("lalala")}>details</div>*/}
    </div>

  }
}


import { connect } from "react-redux";
import {TEST,test} from "./redux/actions/actions"


const mapStateToProps = state => {
  return {
    test: state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    test: txt => {
      dispatch(test(txt))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(PlanDetails);