import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"

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
  }

  render(){

    var daka_views = plan_info.daka_records.map((item)=>{

      var images = item.images.map((img)=>{
        return <img style={{margin:"4px"}} width={100} src={img} />
      })
      return <div>
        <div>
          {item.text} from {item.daka_date}
        </div>

         <div>
           {images}
         </div>
      </div>
    })

    return <div>
      <div>
        {plan_info.name}
        {plan_info.from}-{plan_info.to}
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