import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import axios from "axios"
import * as base from "./base.js"

const img = "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTInk6tZfjiaebxVTn2TkN0ImuRYGyg3p19uUPMSFyU1GD4vrj3yh2C2E7SLsC7rgibOu0sCAUZedK6g/0"

const plan_info = {
  name:"背单词",
  from:"2017-12-12",
  to:"2019-11-12",
  daka_records:[
    {
    daka_date:"2017-12-12",
    text:"完成了8个单词",
    images:[img,img]
    },
    {
      daka_date:"2017-12-12",
      text:"完成了12个单词",
      images:[img,img,img]
    }
  ]
}
class PlanDetails extends Component{

  constructor(props)
  {
    super(props)
    var id = this.props.params.id;
    this.state={id:id};
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
    axios.get(`${base.BaseHost}/index/plan.json?id=${this.state.id}`).then((res)=>{
      console.log("res",res);
      var plan = res.data.data;
      that.setState({plan_info:plan});
      console.log(that.state);
    })

    this.load_records();
  }

  render(){

    var plan_info = this.state.plan_info;
    var daka_records = this.state.daka_records;

    if(plan_info == null )
      return null;

    daka_records =  daka_records == null ? [] :daka_records;

    var daka_views = daka_records.map((item)=>{

      var images = [];
      if(item.images != null)
          images = item.images;

      var images_view = images.map((img)=>{
        return <img style={{margin:"4px"}} width={100} src={img} />
      })
      console.log("record",item)
      return <div>
        <div>
          {item.desc} from {item.created_at}
        </div>

         <div>
           {images_view}
         </div>
      </div>
    })

    return <div>
      <div>
        {plan_info.name}
        {plan_info.start}-{plan_info.end}
      </div>

      <div>
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